import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_MEMBER_EMAIL,
  DEMO_PASSWORD,
  demoAdmin,
  demoMember,
  exercises,
  learningPaths,
  seedClasses,
} from "../data/seed";
import type {
  Booking,
  FitnessLevel,
  Goal,
  GymClass,
  Limitation,
  PersonalRecord,
  UserProfile,
  WorkoutLogEntry,
  WorkoutSet,
  Equipment,
} from "../types";
import { todayKey, yesterdayKey } from "../utils/engagement";

type FormFeel = "great" | "ok" | "needs_work";

interface AppState {
  user: UserProfile | null;
  classes: GymClass[];
  bookings: Booking[];
  workoutLogs: WorkoutLogEntry[];
  personalRecords: PersonalRecord[];
  offlineQueue: WorkoutLogEntry[];
  authError: string | null;
  hydrated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (data: {
    level: FitnessLevel;
    goals: Goal[];
    equipmentPreferences: Equipment[];
    limitations: Limitation[];
  }) => void;
  completeAssessment: (level: FitnessLevel) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  bookClass: (classId: string) => { ok: boolean; message: string };
  cancelBooking: (bookingId: string) => { ok: boolean; message: string };
  createClass: (klass: Omit<GymClass, "id" | "bookedCount" | "waitlistCount" | "status">) => void;
  updateClass: (id: string, patch: Partial<GymClass>) => void;
  deleteClass: (id: string) => void;
  markLessonComplete: (exerciseId: string, pathId?: string) => void;
  toggleFavorite: (exerciseId: string) => void;
  logWorkout: (entry: Omit<WorkoutLogEntry, "id" | "synced">) => void;
  flushOfflineQueue: () => void;
  getCheckInCode: () => string;
  /** Bump form streak / lastFormDate */
  touchFormActivity: () => void;
  markFormUnderstood: (exerciseId: string) => void;
  toggleSessionExercise: (exerciseId: string) => void;
  setSessionExercises: (ids: string[]) => void;
  clearSession: () => void;
  submitFormFeel: (bookingId: string, feel: FormFeel) => void;
  markBookingAttended: (bookingId: string) => void;
  setActivePath: (pathId: string) => void;
}

function blankEngagement(): Pick<
  UserProfile,
  | "formStreak"
  | "lastFormDate"
  | "formUnderstood"
  | "formFeelByBooking"
  | "sessionExerciseIds"
> {
  return {
    formStreak: 0,
    lastFormDate: null,
    formUnderstood: [],
    formFeelByBooking: {},
    sessionExerciseIds: [],
  };
}

function applyFormStreak(user: UserProfile): UserProfile {
  const today = todayKey();
  const yesterday = yesterdayKey();
  if (user.lastFormDate === today) return user;
  const nextStreak =
    user.lastFormDate === yesterday ? (user.formStreak || 0) + 1 : 1;
  return { ...user, formStreak: nextStreak, lastFormDate: today };
}

function resolvePathId(exerciseId: string, preferred?: string) {
  if (preferred && learningPaths.some((p) => p.id === preferred && p.exerciseIds.includes(exerciseId))) {
    return preferred;
  }
  const hit = learningPaths.find((p) => p.exerciseIds.includes(exerciseId));
  return hit?.id;
}

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function recomputeStatus(c: GymClass): GymClass {
  const status = c.bookedCount >= c.capacity ? "full" : "open";
  return { ...c, status };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      classes: seedClasses.map(recomputeStatus),
      bookings: [],
      workoutLogs: [],
      personalRecords: [],
      offlineQueue: [],
      authError: null,
      hydrated: false,

      login: async (email, password) => {
        const e = email.trim().toLowerCase();
        if (password !== DEMO_PASSWORD) {
          set({ authError: "Invalid credentials. Use demo1234 for demo accounts." });
          return false;
        }
        if (e === DEMO_ADMIN_EMAIL) {
          set({ user: { ...demoAdmin }, authError: null });
          return true;
        }
        if (e === DEMO_MEMBER_EMAIL) {
          set({ user: { ...demoMember }, authError: null });
          return true;
        }
        // Allow any email with demo password as a new member session
        set({
          user: {
            ...demoMember,
            uid: `user-${Date.now()}`,
            email: e,
            firstName: e.split("@")[0] || "Athlete",
            lastName: "User",
            initials: initials(e.split("@")[0] || "A", "U"),
            onboardingComplete: false,
            assessmentComplete: false,
            pathProgress: {},
            completedLessons: [],
            favorites: [],
            ...blankEngagement(),
          },
          authError: null,
        });
        return true;
      },

      signup: async ({ firstName, lastName, email, password, phoneNumber }) => {
        if (!firstName || !lastName || !email || password.length < 6) {
          set({ authError: "Fill all fields. Password must be 6+ characters." });
          return false;
        }
        set({
          user: {
            uid: `user-${Date.now()}`,
            email: email.trim().toLowerCase(),
            firstName,
            lastName,
            phoneNumber,
            role: email.trim().toLowerCase() === DEMO_ADMIN_EMAIL ? "admin" : "member",
            level: "beginner",
            goals: [],
            equipmentPreferences: ["bodyweight"],
            limitations: [],
            initials: initials(firstName, lastName),
            membershipStatus: "trial",
            onboardingComplete: false,
            assessmentComplete: false,
            pathProgress: {},
            completedLessons: [],
            favorites: [],
            ...blankEngagement(),
            createdAt: new Date().toISOString(),
          },
          authError: null,
        });
        return true;
      },

      logout: () => set({ user: null, authError: null }),

      completeOnboarding: (data) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            ...data,
            onboardingComplete: true,
          },
        });
      },

      completeAssessment: (level) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            level,
            assessmentComplete: true,
          },
        });
      },

      updateProfile: (patch) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...patch } });
      },

      bookClass: (classId) => {
        const { user, classes, bookings } = get();
        if (!user) return { ok: false, message: "Not signed in" };

        const existing = bookings.find(
          (b) => b.userId === user.uid && b.classId === classId && b.status !== "cancelled"
        );
        if (existing) return { ok: false, message: "Already booked or waitlisted" };

        const klass = classes.find((c) => c.id === classId);
        if (!klass) return { ok: false, message: "Class not found" };

        const isFull = klass.bookedCount >= klass.capacity;
        const status = isFull ? "waitlisted" : "booked";
        const booking: Booking = {
          id: `bk-${Date.now()}`,
          userId: user.uid,
          classId,
          status,
          createdAt: new Date().toISOString(),
          userName: `${user.firstName} ${user.lastName}`,
          classTitle: klass.title,
          classDate: klass.date,
          classTime: klass.time,
        };

        const nextClasses = classes.map((c) => {
          if (c.id !== classId) return c;
          if (isFull) {
            return recomputeStatus({ ...c, waitlistCount: c.waitlistCount + 1 });
          }
          return recomputeStatus({ ...c, bookedCount: c.bookedCount + 1 });
        });

        set({ bookings: [booking, ...bookings], classes: nextClasses });
        return {
          ok: true,
          message: isFull ? "Added to waitlist" : "Booked successfully",
        };
      },

      cancelBooking: (bookingId) => {
        const { bookings, classes, user } = get();
        const booking = bookings.find((b) => b.id === bookingId);
        if (!booking || !user) return { ok: false, message: "Booking not found" };
        if (booking.status === "cancelled") return { ok: false, message: "Already cancelled" };

        const klass = classes.find((c) => c.id === booking.classId);
        if (klass) {
          const classDateTime = new Date(`${klass.date}T${klass.time}:00`);
          const hoursLeft = (classDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
          if (hoursLeft < klass.cancelWindowHours && hoursLeft > 0) {
            return {
              ok: false,
              message: `Cancel window is ${klass.cancelWindowHours}h before class`,
            };
          }
        }

        let nextClasses = [...classes];
        if (klass) {
          if (booking.status === "booked") {
            // promote first waitlisted
            const waitlisted = bookings
              .filter(
                (b) =>
                  b.classId === klass.id &&
                  b.status === "waitlisted" &&
                  b.id !== bookingId
              )
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

            nextClasses = classes.map((c) => {
              if (c.id !== klass.id) return c;
              let bookedCount = Math.max(0, c.bookedCount - 1);
              let waitlistCount = c.waitlistCount;
              if (waitlisted[0]) {
                bookedCount += 1;
                waitlistCount = Math.max(0, waitlistCount - 1);
              }
              return recomputeStatus({ ...c, bookedCount, waitlistCount });
            });

            const promotedId = waitlisted[0]?.id;
            set({
              bookings: bookings.map((b) => {
                if (b.id === bookingId) return { ...b, status: "cancelled" };
                if (promotedId && b.id === promotedId) return { ...b, status: "booked" };
                return b;
              }),
              classes: nextClasses,
            });
            return { ok: true, message: "Cancelled" + (promotedId ? " — waitlist promoted" : "") };
          }

          if (booking.status === "waitlisted") {
            nextClasses = classes.map((c) =>
              c.id === klass.id
                ? recomputeStatus({ ...c, waitlistCount: Math.max(0, c.waitlistCount - 1) })
                : c
            );
          }
        }

        set({
          bookings: bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" } : b
          ),
          classes: nextClasses,
        });
        return { ok: true, message: "Cancelled" };
      },

      createClass: (klass) => {
        const id = `class-${Date.now()}`;
        const created = recomputeStatus({
          ...klass,
          id,
          bookedCount: 0,
          waitlistCount: 0,
          status: "open",
        });
        set({ classes: [created, ...get().classes] });
      },

      updateClass: (id, patch) => {
        set({
          classes: get().classes.map((c) =>
            c.id === id ? recomputeStatus({ ...c, ...patch }) : c
          ),
        });
      },

      deleteClass: (id) => {
        set({ classes: get().classes.filter((c) => c.id !== id) });
      },

      markLessonComplete: (exerciseId, pathId) => {
        const user = get().user;
        if (!user) return;
        const already = user.completedLessons.includes(exerciseId);
        const completedLessons = already
          ? user.completedLessons
          : [...user.completedLessons, exerciseId];
        const resolved = resolvePathId(exerciseId, pathId || user.activePathId);
        const pathProgress = { ...user.pathProgress };
        if (resolved && !already) {
          const path = learningPaths.find((p) => p.id === resolved);
          const doneInPath = completedLessons.filter((id) =>
            path?.exerciseIds.includes(id)
          ).length;
          pathProgress[resolved] = doneInPath;
        }
        set({
          user: applyFormStreak({
            ...user,
            completedLessons,
            pathProgress,
            activePathId: resolved || user.activePathId,
          }),
        });
      },

      toggleFavorite: (exerciseId) => {
        const user = get().user;
        if (!user) return;
        const favorites = user.favorites.includes(exerciseId)
          ? user.favorites.filter((id) => id !== exerciseId)
          : [...user.favorites, exerciseId];
        set({ user: { ...user, favorites } });
      },

      logWorkout: (entry) => {
        const id = `log-${Date.now()}`;
        const full: WorkoutLogEntry = { ...entry, id, synced: true };
        const logs = [full, ...get().workoutLogs];

        const bestSet = entry.sets.reduce(
          (best, s) => (s.weight * s.reps > best.weight * best.reps ? s : best),
          { reps: 0, weight: 0, completed: true } as WorkoutSet
        );
        let personalRecords = [...get().personalRecords];
        const existing = personalRecords.find((p) => p.exerciseId === entry.exerciseId);
        const score = bestSet.weight * bestSet.reps;
        if (!existing || existing.weight * existing.reps < score) {
          const pr: PersonalRecord = {
            exerciseId: entry.exerciseId,
            exerciseName: entry.exerciseName,
            weight: bestSet.weight,
            reps: bestSet.reps,
            date: entry.date,
          };
          personalRecords = [
            pr,
            ...personalRecords.filter((p) => p.exerciseId !== entry.exerciseId),
          ];
        }

        const user = get().user;
        set({
          workoutLogs: logs,
          personalRecords,
          user: user ? applyFormStreak(user) : user,
        });
      },

      flushOfflineQueue: () => {
        const queue = get().offlineQueue;
        if (!queue.length) return;
        set({
          workoutLogs: [...queue.map((q) => ({ ...q, synced: true })), ...get().workoutLogs],
          offlineQueue: [],
        });
      },

      getCheckInCode: () => {
        const user = get().user;
        const day = new Date().toISOString().slice(0, 10);
        return `FV-${user?.uid?.slice(-6) || "GUEST"}-${day.replace(/-/g, "")}`;
      },

      touchFormActivity: () => {
        const user = get().user;
        if (!user) return;
        set({ user: applyFormStreak(user) });
      },

      markFormUnderstood: (exerciseId) => {
        const user = get().user;
        if (!user) return;
        const formUnderstood = user.formUnderstood?.includes(exerciseId)
          ? user.formUnderstood
          : [...(user.formUnderstood || []), exerciseId];
        set({
          user: applyFormStreak({ ...user, formUnderstood }),
        });
      },

      toggleSessionExercise: (exerciseId) => {
        const user = get().user;
        if (!user) return;
        const cur = user.sessionExerciseIds || [];
        const sessionExerciseIds = cur.includes(exerciseId)
          ? cur.filter((id) => id !== exerciseId)
          : cur.length >= 5
            ? cur
            : [...cur, exerciseId];
        set({ user: { ...user, sessionExerciseIds } });
      },

      setSessionExercises: (ids) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, sessionExerciseIds: ids.slice(0, 5) } });
      },

      clearSession: () => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, sessionExerciseIds: [] } });
      },

      submitFormFeel: (bookingId, feel) => {
        const user = get().user;
        if (!user) return;
        set({
          user: applyFormStreak({
            ...user,
            formFeelByBooking: { ...(user.formFeelByBooking || {}), [bookingId]: feel },
          }),
        });
      },

      markBookingAttended: (bookingId) => {
        set({
          bookings: get().bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "attended" } : b
          ),
        });
      },

      setActivePath: (pathId) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, activePathId: pathId } });
      },
    }),
    {
      name: "fitbrother-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        user: s.user,
        classes: s.classes,
        bookings: s.bookings,
        workoutLogs: s.workoutLogs,
        personalRecords: s.personalRecords,
        offlineQueue: s.offlineQueue,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
          // migrate older persisted users missing engagement fields
          if (state.user) {
            state.user = {
              ...blankEngagement(),
              ...state.user,
              formUnderstood: state.user.formUnderstood || [],
              formFeelByBooking: state.user.formFeelByBooking || {},
              sessionExerciseIds: state.user.sessionExerciseIds || [],
              formStreak: state.user.formStreak || 0,
              lastFormDate: state.user.lastFormDate ?? null,
            };
          }
        }
      },
    }
  )
);

export function getExerciseById(id: string) {
  return exercises.find((e) => e.id === id);
}

export function getSwapCandidates(exerciseId: string, equipment: Equipment[], limitations: Limitation[]) {
  const current = getExerciseById(exerciseId);
  if (!current) return [];
  return exercises.filter((e) => {
    if (e.id === exerciseId) return false;
    if (e.pattern !== current.pattern) return false;
    const equipOk =
      e.equipment.some((eq) => equipment.includes(eq)) || e.equipment.includes("bodyweight");
    if (!equipOk) return false;
    if (limitations.includes("knee_sensitive") && (e.pattern === "squat" || e.pattern === "lunge")) {
      return e.level === "beginner";
    }
    if (limitations.includes("shoulder_sensitive") && e.pattern === "push" && e.name.includes("Overhead")) {
      return false;
    }
    if (limitations.includes("lower_back_sensitive") && e.pattern === "hinge" && e.level === "advanced") {
      return false;
    }
    return true;
  });
}

export function overloadHint(exerciseId: string, logs: WorkoutLogEntry[]) {
  const last = logs.find((l) => l.exerciseId === exerciseId);
  if (!last || !last.sets.length) return "Log your first set to unlock overload hints.";
  const top = last.sets.reduce((a, b) => (b.weight >= a.weight ? b : a));
  if (top.reps >= 10) {
    return `Last: ${top.weight}kg × ${top.reps}. Try ${top.weight + 2.5}kg or keep weight and push clean reps.`;
  }
  return `Last: ${top.weight}kg × ${top.reps}. Aim for +1–2 reps or +2.5kg next time.`;
}

export function restGuidance(goal: Goal | undefined, level: FitnessLevel) {
  if (goal === "strength") {
    return { seconds: level === "advanced" ? 180 : 150, why: "Strength needs fuller ATP recovery between heavy sets." };
  }
  if (goal === "muscle") {
    return { seconds: 90, why: "Hypertrophy thrives on ~60–90s rest to keep tension high." };
  }
  if (goal === "fat_loss") {
    return { seconds: 45, why: "Shorter rests keep heart rate elevated for conditioning." };
  }
  return { seconds: 75, why: "General fitness: enough recovery to keep form crisp." };
}
