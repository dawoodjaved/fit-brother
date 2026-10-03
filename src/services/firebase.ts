import Constants from "expo-constants";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

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

const useDemoMode =
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
let db: Firestore | null = null;

/** Spark-safe: Firestore only for now (Auth/Storage not wired in app code yet). */
export function getFirebase() {
  if (useDemoMode) {
    return {
      app: null,
      db: null,
      useDemoMode: true as const,
    };
  }
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]!;
  }
  db = getFirestore(app);
  return { app, db, useDemoMode: false as const };
}
