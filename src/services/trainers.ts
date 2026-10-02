/**
 * Trainer marketplace Firestore helpers (Spark free tier).
 * Cap reads; no Cloud Functions. Demo mode is handled by the Zustand store.
 */
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
  type Firestore,
} from "firebase/firestore";
import type { TrainerApplication, TrainerProfile } from "../types";
import { getFirebase } from "./firebase";

const TRAINER_LIST_CAP = 40;

export async function fetchApprovedTrainersRemote(): Promise<TrainerProfile[] | null> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return null;
  const q = query(
    collection(db, "trainers"),
    where("status", "==", "approved"),
    limit(TRAINER_LIST_CAP)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TrainerProfile, "id">) }));
}

export async function upsertTrainerApplicationRemote(
  app: TrainerApplication
): Promise<boolean> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return false;
  await setDoc(doc(db as Firestore, "trainerApplications", app.id), app);
  return true;
}

export async function fetchPendingApplicationsRemote(): Promise<
  TrainerApplication[] | null
> {
  const { db, useDemoMode } = getFirebase();
  if (useDemoMode || !db) return null;
  const q = query(
    collection(db, "trainerApplications"),
    where("status", "==", "pending"),
    limit(40)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<TrainerApplication, "id">),
  }));
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
