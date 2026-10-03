# Firebase setup — FitBrother

Project: **`fitbrother`** (Spark free tier)  
Android package: **`com.fitbrother.app`**

Secrets live in a gitignored `.env`. `app.config.js` maps them into `expo.extra`. Do not put real keys in `app.json` or commit `.env`.

## What we set up via Firebase CLI

```bash
firebase login
firebase use fitbrother
```

1. Enabled APIs — Firestore, Firebase, Identity Toolkit, Secure Token, Storage
2. Created apps
   - **Android** — `FitBrother Android` → `com.fitbrother.app`
   - **Web** — `FitBrother Expo` (needed for the Expo JS SDK config shape; not a public website)
3. Created Firestore — `(default)` in **`asia-south1`** (Mumbai)
4. Deployed rules and indexes
5. Wrote Web SDK config into local `.env` with `EXPO_PUBLIC_USE_DEMO_MODE=false`

Commands used:

```bash
firebase apps:create ANDROID "FitBrother Android" --package-name com.fitbrother.app
firebase apps:create WEB "FitBrother Expo"
firebase apps:sdkconfig WEB <web-app-id>
firebase firestore:databases:create "(default)" --location asia-south1
firebase deploy --only firestore:rules,firestore:indexes --project fitbrother
```

## Console steps (CLI cannot do these on Spark)

1. [Authentication](https://console.firebase.google.com/project/fitbrother/authentication) → Get started → enable **Email/Password**
2. [Storage](https://console.firebase.google.com/project/fitbrother/storage) → Get started → region **asia-south1**, then:

```bash
firebase deploy --only storage --project fitbrother
```

Restart the app after that. Use a real signup email when demo mode is off.

## Local `.env`

Copy from `.env.example`:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_USE_DEMO_MODE=false
EXPO_PUBLIC_ADMIN_NOTIFY_EMAIL=you@email.com
```

`adminNotifyEmail` receives trainer-apply mailto links (no Cloud Functions on Spark).

## Skipped on purpose

- Cloud Functions / Blaze billing
- Committing secrets
