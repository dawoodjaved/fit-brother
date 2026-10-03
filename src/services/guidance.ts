/**
 * Guidance chat / sessions (Spark free tier).
 * One snapshot per open thread only. Voice notes use local URIs in demo.
 */
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import type {
  GuidanceMessage,
  GuidanceRating,
  GuidanceReport,
  GuidanceSession,
  GuidanceThread,
} from "../types";
import { getFirebase } from "./firebase";

const MSG_CAP = 50;

export async function upsertThreadRemote(thread: GuidanceThread): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await setDoc(doc(db, "guidanceThreads", thread.id), thread);
  return true;
}

export async function addMessageRemote(msg: GuidanceMessage): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await setDoc(doc(db, "guidanceThreads", msg.threadId, "messages", msg.id), msg);
  await updateDoc(doc(db, "guidanceThreads", msg.threadId), {
    lastMessage: msg.text || (msg.type === "voice" ? "Voice note" : ""),
    lastMessageAt: msg.createdAt,
  });
  return true;
}

/** Subscribe only while chat screen is focused — Spark quota friendly. */
export function subscribeMessagesRemote(
  threadId: string,
  onData: (msgs: GuidanceMessage[]) => void
): Unsubscribe | null {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return null;
  const q = query(
    collection(db, "guidanceThreads", threadId, "messages"),
    orderBy("createdAt", "asc"),
    limit(MSG_CAP)
  );
  return onSnapshot(q, (snap) => {
    onData(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GuidanceMessage, "id">),
      }))
    );
  });
}

export async function upsertSessionRemote(session: GuidanceSession): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await setDoc(doc(db, "guidanceSessions", session.id), session);
  return true;
}

export async function updateSessionRemote(
  id: string,
  patch: Partial<GuidanceSession>
): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await updateDoc(doc(db, "guidanceSessions", id), patch);
  return true;
}

export async function addRatingRemote(rating: GuidanceRating): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await setDoc(doc(db, "guidanceRatings", rating.id), rating);
  return true;
}

export async function addReportRemote(report: GuidanceReport): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await addDoc(collection(db, "reports"), report);
  return true;
}
