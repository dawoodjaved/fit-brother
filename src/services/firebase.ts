import Constants from "expo-constants";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

type Extra = {
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseStorageBucket?: string;
  firebaseMessagingSenderId?: string;
  firebaseAppId?: string;
  useDemoMode?: boolean;
  adminNotifyEmail?: string;
};

const extra = (Constants.expoConfig?.extra || {}) as Extra;

export const useDemoMode =
  extra.useDemoMode !== false ||
  !extra.firebaseApiKey ||
  extra.firebaseApiKey.length < 10;

export const adminNotifyEmail =
  extra.adminNotifyEmail || "admin@fitbrother.app";

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || "demo",
  authDomain: extra.firebaseAuthDomain || "demo.firebaseapp.com",
  projectId: extra.firebaseProjectId || "demo",
  storageBucket: extra.firebaseStorageBucket || "demo.appspot.com",
  messagingSenderId: extra.firebaseMessagingSenderId || "0",
  appId: extra.firebaseAppId || "demo",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

/** Spark-safe: Auth + Firestore + Storage only. No Cloud Functions. */
export function getFirebase() {
  if (useDemoMode) {
    return {
      app: null,
      auth: null,
      db: null,
      storage: null,
      useDemoMode: true as const,
    };
  }
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]!;
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  return { app, auth, db, storage, useDemoMode: false as const };
}
