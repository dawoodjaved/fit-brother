/**
 * Trainer marketplace Firestore helpers (Spark free tier).
 * Cap writes; no Cloud Functions. Demo mode is handled by the Zustand store.
 */
import { doc, setDoc, updateDoc, type Firestore } from "firebase/firestore";
import type { TrainerApplication, TrainerProfile } from "../types";
import { getFirebase } from "./firebase";

export async function upsertTrainerApplicationRemote(
  app: TrainerApplication
): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await setDoc(doc(db as Firestore, "trainerApplications", app.id), app);
  return true;
}

export async function approveApplicationRemote(
  application: TrainerApplication,
  trainer: TrainerProfile
): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await updateDoc(doc(db, "trainerApplications", application.id), {
    status: "approved",
  });
  await setDoc(doc(db, "trainers", trainer.id), trainer);
  return true;
}

export async function rejectApplicationRemote(id: string): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await updateDoc(doc(db, "trainerApplications", id), { status: "rejected" });
  return true;
}

export async function updateTrainerRemote(
  id: string,
  patch: Partial<TrainerProfile>
): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await updateDoc(doc(db, "trainers", id), patch);
  return true;
}
