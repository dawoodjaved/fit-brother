import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Linking } from "react-native";
import { seedTrainers } from "../data/trainersSeed";
import { adminNotifyEmail } from "../services/firebase";
import {
  addMessageRemote,
  addRatingRemote,
  addReportRemote,
  updateSessionRemote,
  upsertSessionRemote,
  upsertThreadRemote,
} from "../services/guidance";
import {
  approveApplicationRemote,
  rejectApplicationRemote,
  updateTrainerRemote,
  upsertTrainerApplicationRemote,
} from "../services/trainers";
import type {
  GuidanceMessage,
  GuidancePackage,
  GuidanceRating,
  GuidanceSession,
  GuidanceThread,
  TrainerApplication,
  TrainerCity,
  TrainerLanguage,
  TrainerProfile,
  TrainerSpecialty,
} from "../types";
import { GUIDANCE_PACKAGES } from "../types";

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function packageFee(trainer: TrainerProfile, pkg: GuidancePackage) {
  if (pkg === "form_check_30") return Math.round(trainer.feePkr * 1.8);
  if (pkg === "chat_pack_5") return Math.round(trainer.feePkr * 1.2);
  if (pkg === "whatsapp_voice") return trainer.feePkr;
  return trainer.feePkr;
}

interface GuidanceState {
  trainers: TrainerProfile[];
  applications: TrainerApplication[];
  threads: GuidanceThread[];
  messagesByThread: Record<string, GuidanceMessage[]>;
  sessions: GuidanceSession[];
  ratings: GuidanceRating[];

  submitTrainerApplication: (input: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: TrainerCity;
    bio: string;
    experienceYears: number;
    specialties: TrainerSpecialty[];
    languages: TrainerLanguage[];
    feePkr: number;
    whatsappE164?: string;
    acceptsWhatsAppVoice: boolean;
  }) => Promise<{ ok: boolean; message: string }>;

  approveApplication: (applicationId: string) => Promise<boolean>;
  rejectApplication: (applicationId: string) => Promise<boolean>;

  getOrCreateThread: (input: {
    memberId: string;
    memberName: string;
    trainer: TrainerProfile;
  }) => string;

  sendTextMessage: (threadId: string, senderId: string, text: string) => void;
  sendVoiceMessage: (threadId: string, senderId: string, voiceUri: string) => void;
  sendSystemMessage: (threadId: string, text: string) => void;

  blockThread: (threadId: string, byUserId: string) => void;
  reportThread: (threadId: string, reporterId: string, reason: string) => void;

  bookSession: (input: {
    threadId: string;
    memberId: string;
    trainerId: string;
    packageId: GuidancePackage;
    scheduledAt?: string;
  }) => GuidanceSession | null;

  markSessionPaid: (sessionId: string) => void;
  confirmSessionPayment: (sessionId: string) => void;

  rateTrainer: (input: {
    sessionId: string;
    trainerId: string;
    memberId: string;
    stars: number;
    comment?: string;
  }) => void;

  openWhatsAppVoice: (trainer: TrainerProfile) => Promise<void>;
}

export const useGuidanceStore = create<GuidanceState>()(
  persist(
    (set, get) => ({
      trainers: seedTrainers,
      applications: [],
      threads: [],
      messagesByThread: {},
      sessions: [],
      ratings: [],

      submitTrainerApplication: async (input) => {
        const app: TrainerApplication = {
          id: id("tapp"),
          ...input,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set({ applications: [app, ...get().applications] });
        await upsertTrainerApplicationRemote(app);

        const subject = encodeURIComponent(
          `FitBrother trainer application — ${input.firstName} ${input.lastName}`
        );
        const body = encodeURIComponent(
          [
            `Name: ${input.firstName} ${input.lastName}`,
            `Email: ${input.email}`,
            `Phone: ${input.phone}`,
            `City: ${input.city}`,
            `Experience: ${input.experienceYears} years`,
            `Fee: PKR ${input.feePkr}`,
            `Specialties: ${input.specialties.join(", ")}`,
            `Languages: ${input.languages.join(", ")}`,
            `WhatsApp: ${input.whatsappE164 || "—"}`,
            `Accepts WhatsApp voice: ${input.acceptsWhatsAppVoice ? "yes" : "no"}`,
            "",
            input.bio,
            "",
            `Application id: ${app.id}`,
            "Approve in FitBrother Admin → Trainers, or set status in Firestore.",
          ].join("\n")
        );
        try {
          await Linking.openURL(
            `mailto:${adminNotifyEmail}?subject=${subject}&body=${body}`
          );
        } catch {
          /* mailto may fail on some web/dev setups */
        }
        return {
          ok: true,
          message: "Application submitted. We’ll email you after review.",
        };
      },

      approveApplication: async (applicationId) => {
        const app = get().applications.find((a) => a.id === applicationId);
        if (!app || app.status !== "pending") return false;
        const trainer: TrainerProfile = {
          id: app.uid || app.id,
          uid: app.uid || app.id,
          firstName: app.firstName,
          lastName: app.lastName,
          email: app.email,
          phone: app.phone,
          city: app.city,
          bio: app.bio,
          experienceYears: app.experienceYears,
          specialties: app.specialties,
          languages: app.languages,
          feePkr: app.feePkr,
          ratingAvg: 0,
          ratingCount: 0,
          photoColor: "#3DFFC8",
          verified: true,
          status: "approved",
          whatsappE164: app.whatsappE164,
          acceptsWhatsAppVoice: app.acceptsWhatsAppVoice,
          responseHoursHint: "New on FitBrother",
          createdAt: new Date().toISOString(),
        };
        set({
          applications: get().applications.map((a) =>
            a.id === applicationId ? { ...a, status: "approved" } : a
          ),
          trainers: [
            trainer,
            ...get().trainers.filter((t) => t.id !== trainer.id),
          ],
        });
        await approveApplicationRemote({ ...app, status: "approved" }, trainer);
        return true;
      },

      rejectApplication: async (applicationId) => {
        set({
          applications: get().applications.map((a) =>
            a.id === applicationId ? { ...a, status: "rejected" } : a
          ),
        });
        await rejectApplicationRemote(applicationId);
        return true;
      },

      getOrCreateThread: ({ memberId, memberName, trainer }) => {
        const existing = get().threads.find(
          (t) =>
            t.memberId === memberId &&
            t.trainerId === trainer.id &&
            t.status !== "blocked"
        );
        if (existing) return existing.id;

        const thread: GuidanceThread = {
          id: id("gth"),
          memberId,
          memberName,
          trainerId: trainer.id,
          trainerName: `${trainer.firstName} ${trainer.lastName}`,
          status: "open",
          lastMessage: "Guidance started",
          lastMessageAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        const system: GuidanceMessage = {
          id: id("gmsg"),
          threadId: thread.id,
          senderId: "system",
          type: "system",
          text: "Form guidance only — not medical advice. Be respectful. Report misuse anytime.",
          createdAt: new Date().toISOString(),
        };
        set({
          threads: [thread, ...get().threads],
          messagesByThread: {
            ...get().messagesByThread,
            [thread.id]: [system],
          },
        });
        upsertThreadRemote(thread);
        addMessageRemote(system);
        return thread.id;
      },

      sendTextMessage: (threadId, senderId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const thread = get().threads.find((t) => t.id === threadId);
        if (!thread || thread.status === "blocked") return;
        const msg: GuidanceMessage = {
          id: id("gmsg"),
          threadId,
          senderId,
          type: "text",
          text: trimmed,
          createdAt: new Date().toISOString(),
        };
        const prev = get().messagesByThread[threadId] || [];
        set({
          messagesByThread: {
            ...get().messagesByThread,
            [threadId]: [...prev, msg],
          },
          threads: get().threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  lastMessage: trimmed,
                  lastMessageAt: msg.createdAt,
                }
              : t
          ),
        });
        addMessageRemote(msg);
      },

      sendVoiceMessage: (threadId, senderId, voiceUri) => {
        const thread = get().threads.find((t) => t.id === threadId);
        if (!thread || thread.status === "blocked") return;
        const msg: GuidanceMessage = {
          id: id("gmsg"),
          threadId,
          senderId,
          type: "voice",
          text: "Voice note",
          voiceUri,
          createdAt: new Date().toISOString(),
        };
        const prev = get().messagesByThread[threadId] || [];
        set({
          messagesByThread: {
            ...get().messagesByThread,
            [threadId]: [...prev, msg],
          },
          threads: get().threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  lastMessage: "Voice note",
                  lastMessageAt: msg.createdAt,
                }
              : t
          ),
        });
        addMessageRemote(msg);
      },

      sendSystemMessage: (threadId, text) => {
        const msg: GuidanceMessage = {
          id: id("gmsg"),
          threadId,
          senderId: "system",
          type: "system",
          text,
          createdAt: new Date().toISOString(),
        };
        const prev = get().messagesByThread[threadId] || [];
        set({
          messagesByThread: {
            ...get().messagesByThread,
            [threadId]: [...prev, msg],
          },
        });
        addMessageRemote(msg);
      },

      blockThread: (threadId, byUserId) => {
        set({
          threads: get().threads.map((t) =>
            t.id === threadId
              ? { ...t, status: "blocked", blockedBy: byUserId }
              : t
          ),
        });
        get().sendSystemMessage(threadId, "This conversation was blocked.");
      },

      reportThread: (threadId, reporterId, reason) => {
        const report = {
          id: id("rep"),
          threadId,
          reporterId,
          reason,
          createdAt: new Date().toISOString(),
        };
        addReportRemote(report);
        get().sendSystemMessage(
          threadId,
          "Report received. FitBrother admin will review."
        );
      },

      bookSession: ({ threadId, memberId, trainerId, packageId, scheduledAt }) => {
        const trainer = get().trainers.find((t) => t.id === trainerId);
        if (!trainer) return null;
        const pkg = GUIDANCE_PACKAGES.find((p) => p.id === packageId);
        const session: GuidanceSession = {
          id: id("gsess"),
          threadId,
          memberId,
          trainerId,
          packageId,
          feePkr: packageFee(trainer, packageId),
          paymentStatus: "unpaid",
          scheduledAt,
          createdAt: new Date().toISOString(),
        };
        set({ sessions: [session, ...get().sessions] });
        upsertSessionRemote(session);
        get().sendSystemMessage(
          threadId,
          `Session booked: ${pkg?.title || packageId} · PKR ${session.feePkr}. Pay via JazzCash/EasyPaisa, then tap I paid.`
        );
        if (packageId === "whatsapp_voice") {
          get().sendSystemMessage(
            threadId,
            scheduledAt
              ? `WhatsApp voice slot noted for ${scheduledAt}. Use Voice call on WhatsApp when ready.`
              : "WhatsApp voice session ready — use Voice call on WhatsApp from the trainer profile."
          );
        }
        return session;
      },

      markSessionPaid: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session) return;
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId ? { ...s, paymentStatus: "marked_paid" } : s
          ),
        });
        updateSessionRemote(sessionId, { paymentStatus: "marked_paid" });
        get().sendSystemMessage(
          session.threadId,
          "Member marked payment sent. Trainer/admin can confirm."
        );
      },

      confirmSessionPayment: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session) return;
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId ? { ...s, paymentStatus: "confirmed" } : s
          ),
        });
        updateSessionRemote(sessionId, { paymentStatus: "confirmed" });
        get().sendSystemMessage(
          session.threadId,
          "Payment confirmed. Guidance session unlocked."
        );
      },

      rateTrainer: ({ sessionId, trainerId, memberId, stars, comment }) => {
        const rating: GuidanceRating = {
          id: id("grat"),
          sessionId,
          trainerId,
          memberId,
          stars: Math.max(1, Math.min(5, stars)),
          comment,
          createdAt: new Date().toISOString(),
        };
        const trainer = get().trainers.find((t) => t.id === trainerId);
        if (trainer) {
          const nextCount = trainer.ratingCount + 1;
          const nextAvg =
            (trainer.ratingAvg * trainer.ratingCount + rating.stars) / nextCount;
          const patch = {
            ratingAvg: Math.round(nextAvg * 10) / 10,
            ratingCount: nextCount,
          };
          set({
            ratings: [rating, ...get().ratings],
            trainers: get().trainers.map((t) =>
              t.id === trainerId ? { ...t, ...patch } : t
            ),
          });
          updateTrainerRemote(trainerId, patch);
        } else {
          set({ ratings: [rating, ...get().ratings] });
        }
        addRatingRemote(rating);
      },

      openWhatsAppVoice: async (trainer) => {
        const num = (trainer.whatsappE164 || "").replace(/\D/g, "");
        if (!num) return;
        const text = encodeURIComponent(
          `Hi ${trainer.firstName}, I'm messaging from FitBrother for form guidance.`
        );
        await Linking.openURL(`https://wa.me/${num}?text=${text}`);
      },
    }),
    {
      name: "fitbrother-guidance",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        trainers: s.trainers,
        applications: s.applications,
        threads: s.threads,
        messagesByThread: s.messagesByThread,
        sessions: s.sessions,
        ratings: s.ratings,
      }),
    }
  )
);
