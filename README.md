# FitBrother

**See the movement. Master the form.**

Android-first gym app — book classes, learn form with GIF guides, log workouts, and get coaching from Pakistan trainers.

## Features

- Class booking with waitlists and QR check-in
- Exercise Academy with 495+ GIF form guides
- Train hub, Body Map, and workout logger
- Pakistan trainers — chat, voice notes, paid sessions
- Admin tools for bookings and trainer approval
- Demo mode so you can try everything without Firebase

## Tech stack

- Expo 52 · React Native · TypeScript
- React Navigation · Zustand
- Firebase (optional — Auth / Firestore / Storage)
- Reanimated · SVG · Expo AV · Notifications

## Start the app

```bash
npm install --legacy-peer-deps
npx expo start --android
```

### Demo logins (local / `__DEV__` only)

Password for both: `demo1234`

| Role   | Email                 |
|--------|-----------------------|
| Member | member@fitbrother.app |
| Admin  | admin@fitbrother.app  |

Firebase setup (optional): see [FIREBASE.md](./FIREBASE.md).

## Security (secrets)

- `.env` is gitignored. `EXPO_PUBLIC_FIREBASE_*` is **public client config**, not a server secret.
- If any key was ever hardcoded in git history, **rotate it** in Google Cloud and lock down API key restrictions / App Check.
- Deploy rules: `firebase deploy --only firestore:rules,storage --project fitbrother`
