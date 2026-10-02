# FitBrother

**See the movement. Master the form.**

FitBrother is a form-first gym app built with Expo and TypeScript. It helps members book classes, learn movement with looping GIF guides, log workouts, and get coaching from Pakistan-based trainers — without turning into another neon “HIIT tracker.”

The brand mark is the mint form-scan silhouette on deep ink (`#0A1018` / `#3DFFC8`). You’ll see it on splash, icons, and in-app headers.

## What’s in the app

- **Classes** — capacity, waitlists, check-in QR, and “how did that feel?” prompts after sessions
- **Academy** — 235+ exercises with GIF form guides, muscle maps, cues, and learning paths
- **Train** — Body Map regions, session builder, rest timer, and workout logger
- **Trainers (Pakistan)** — city/specialty directory, apply + admin approve, chat, voice notes, WhatsApp voice link, JazzCash/EasyPaisa session payments, ratings
- **Gym hub & profile** — hours, equipment prefs, form streak, personal records
- **Admin** — members, bookings, trainer applications, payment confirms

Demo mode is on by default, so you can explore everything without Firebase.

## Stack

Expo SDK 52 · React Native 0.76 · TypeScript · React Navigation 7 · Zustand · Firebase 11 (optional, Spark-friendly) · Reanimated · SVG · Expo AV · Notifications

## Run locally

```bash
npm install --legacy-peer-deps
npx expo start --web
```

Also works with `npx expo start` for iOS / Android.

### Demo accounts

Password for both: `demo1234`

| Role   | Email                 |
|--------|-----------------------|
| Member | member@fitbrother.app |
| Admin  | admin@fitbrother.app  |

## Firebase (optional)

Designed for **Firebase Spark** — no Cloud Functions required.

1. Enable Email/Password Auth, Firestore, and Storage
2. Deploy `firestore.rules`, `firestore.indexes.json`, and `storage.rules`
3. Put your keys in `app.json` → `expo.extra` (see `.env.example` for the field list)
4. Set `useDemoMode` to `false`

Until keys are filled in, trainers, chat, sessions, and admin approval all run from local Zustand state.

Trainer applications open a `mailto:` to `adminNotifyEmail` so you can stay on the free tier.

```bash
npm i -g firebase-tools
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Keep listeners light: chat `onSnapshot` only while a thread is open; trainer lists and messages are capped.

## Project layout

```
App.tsx
src/brand.ts          # name, tagline, logo
src/screens/          # auth, home, academy, train, trainers, gym, admin
src/store/            # app + guidance stores
src/services/         # firebase, trainers, guidance
assets/               # logo, icons, anatomy, exercise GIFs
```

## Credits

Exercise demo GIFs are bundled from [ExerciseGymGifsDB](https://github.com/JahelCuadrado/ExerciseGymGifsDB) for local form teaching. Swap in licensed media before a production launch.

## License / notes

Do not commit real Firebase keys or `.env` files. Empty placeholders in `app.json` and `.env.example` are intentional.
