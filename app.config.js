const fs = require("fs");
const path = require("path");

/** Parse local .env without adding a dependency. */
function loadEnvFile() {
  const file = path.join(__dirname, ".env");
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = loadEnvFile();
const demoFlag = (env.EXPO_PUBLIC_USE_DEMO_MODE ?? "true").toLowerCase();

/**
 * Expo reads app.config.js over app.json.
 * Secrets stay in gitignored .env; committed app.json keeps empty placeholders.
 */
module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    firebaseApiKey:
      env.EXPO_PUBLIC_FIREBASE_API_KEY || config.extra?.firebaseApiKey || "",
    firebaseAuthDomain:
      env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      config.extra?.firebaseAuthDomain ||
      "",
    firebaseProjectId:
      env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
      config.extra?.firebaseProjectId ||
      "",
    firebaseStorageBucket:
      env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      config.extra?.firebaseStorageBucket ||
      "",
    firebaseMessagingSenderId:
      env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      config.extra?.firebaseMessagingSenderId ||
      "",
    firebaseAppId:
      env.EXPO_PUBLIC_FIREBASE_APP_ID || config.extra?.firebaseAppId || "",
    useDemoMode: demoFlag !== "false",
    adminNotifyEmail:
      env.EXPO_PUBLIC_ADMIN_NOTIFY_EMAIL ||
      config.extra?.adminNotifyEmail ||
      "admin@fitbrother.app",
  },
});
