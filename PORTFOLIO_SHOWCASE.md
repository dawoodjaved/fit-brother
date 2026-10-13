# FitBrother — Portfolio & ATS Showcase Copy

**Product:** FitBrother · v2.0  
**Tagline:** See the movement. Master the form.  
**One-liner:** Form-first Android gym app — GIF form scans, class booking, Body Map training, and Pakistan trainer coaching in one product.  
**Stack:** Expo 52 · React Native · TypeScript · Zustand · Firebase · Reanimated · React Navigation  

Use the sections below as drop-in copy for Toptal, LinkedIn, resumes, and client pitches. Numbers and features match the current codebase.

---

## 1. Toptal format (project narrative)

Created FitBrother, a production-ready form-first gym platform so members can learn correct movement, book classes, and get coached — instead of logging empty sets in a generic fitness tracker. It includes Expo 52 and React Native with TypeScript, role-based access for members, trainers, and admins, class booking with capacity limits, waitlists, and automatic waitlist promotion, QR check-in, an Exercise Academy with 220+ GIF form guides and synced phase callouts, an interactive Body Map for region-based training, a workout logger with personal records and offline queue sync, and a Pakistan trainer marketplace with chat, voice notes, WhatsApp voice sessions, and JazzCash / EasyPaisa payment confirmation. I designed the multi-role domain model, the waitlist and booking state machine, the form-engagement loop (streaks, “I understand this form,” post-class form feel), and a demo mode so the full product can be shown without Firebase. This is the project I point to when a client needs a serious mobile fitness product for emerging markets — not a calorie-counter clone.

---

## 2. LinkedIn format (highlights + skills)

A form-first gym training platform that teaches movement before load. Think “form scan + class booking + local coaching” in one Android-first app. Built with Expo 52, React Native, and TypeScript, featuring GIF form guides, interactive Body Map training, class waitlists, and a Pakistan trainer marketplace.

🔹 Key Highlights:
• Exercise Academy — 220+ GIF form guides with synced phase callouts, muscle roles (primary / synergist / stabilizer), cues, common mistakes, and learning paths for beginner → advanced.
• Body Map Training — Interactive front/back anatomy hotspots that open region-based mini workouts with form GIFs and a logger.
• Class Booking System — Capacity-aware booking, waitlists with position hints, cancel-window rules, auto-promotion when a spot opens, and QR check-in.
• Workout Logger — Sets, reps, weight, rest timer, personal records, session builder, and offline queue so lifts are never lost.
• Pakistan Trainer Marketplace — Verified coaches across major cities, specialties and languages (English / Urdu), in-app chat, voice notes, WhatsApp voice packages, and JazzCash / EasyPaisa mark-paid → confirm flow.
• Multi-Role Product Surface — Member, trainer, and admin experiences: trainer applications, admin approval, class CRUD, and payment confirmation without Cloud Functions (Firebase Spark-safe design).
• Demo Mode Architecture — Full product walkthrough with seeded data so recruiters and clients can evaluate the app before backend credentials are wired.

This project demonstrates expertise in Expo / React Native, TypeScript, Zustand state architecture, React Navigation, Firebase (Auth / Firestore / Storage-ready), Reanimated motion UI, SVG anatomy interactions, mobile UX for fitness products, and building localized marketplace flows for South Asian payment and coaching habits.

---

## 3. Unique format — “Impact brief” (resume / case-study hybrid)

### FitBrother | Form-First Gym Platform
**Role:** Full-stack mobile product engineer (solo / lead)  
**Platform:** Android-first (Expo) · iOS & web-capable  
**Outcome:** Shipped a multi-role fitness product that unifies education, booking, logging, and paid coaching — localized for Pakistan.

**Problem**  
Most gym apps track calories or sets. Beginners still lift with bad form, classes fill up with no waitlist logic, and coaches live in WhatsApp threads with no product surface. FitBrother closes that gap with form-first learning plus real gym operations.

**What I built**
| Pillar | What shipped |
| --- | --- |
| Learn | 220+ exercise catalog, GIF form scans, learning paths, jargon glossary, form streaks |
| Book | Classes, capacity, waitlists, promotion, QR check-in, post-class form feel |
| Train | Body Map, region mini-paths, session builder, logger, PRs, offline queue |
| Coach | Trainer apply → admin approve, chat + voice, paid packages, JazzCash / EasyPaisa |
| Operate | Admin dashboard, role gates, demo mode + Firebase Spark path (`asia-south1`) |

**Why it stands out**
1. **Product differentiation** — Form before load, not another step counter.  
2. **Market realism** — Cities, Urdu/English coaches, WhatsApp voice, local wallets — not a US-only Stripe demo.  
3. **Engineering judgment** — Dual demo/Firebase mode, offline workout queue, Spark-tier constraints (no Cloud Functions) without killing admin workflows.  
4. **UX craft** — Custom brand system (Syne + DM Sans), Reanimated motion, haptic feedback, SVG Body Map, GIF-synced coaching callouts.

**Skills signal (ATS keywords)**  
React Native · Expo · TypeScript · Zustand · React Navigation · Firebase · Firestore · AsyncStorage · Offline-first · Reanimated · SVG · Expo AV · Push Notifications · QR Codes · RBAC · Marketplace UX · Mobile Product Design · Domain Modeling · Waitlist Systems · Fitness Tech · Localization (Pakistan)

---

## 4. Short variants (pick by length limit)

### 50-word blurb
FitBrother is a form-first React Native gym app with 220+ GIF form guides, Body Map training, class booking with waitlists and QR check-in, workout logging with offline sync, and a Pakistan trainer marketplace using chat, voice notes, and JazzCash / EasyPaisa payments — built with Expo, TypeScript, Zustand, and Firebase.

### 25-word headline
Form-first Expo gym app: GIF form academy, Body Map workouts, class waitlists, and Pakistan trainer coaching with local payment flows.

### Resume bullet (single line)
Built FitBrother, an Expo/React Native gym platform with 220+ GIF form guides, waitlist booking, Body Map training, offline workout logs, and a Pakistan trainer marketplace (chat, voice, JazzCash/EasyPaisa).

### Resume bullets (3–5, achievement style)
- Designed and shipped FitBrother, a multi-role Android-first fitness product (member / trainer / admin) covering form education, class ops, training logs, and paid coaching.
- Implemented capacity-aware class booking with waitlists, position hints, cancellation windows, and automatic waitlist promotion — modeled after real gym desk workflows.
- Built an Exercise Academy with 220+ GIF form guides, GIF-synced phase callouts, learning paths, and engagement loops (form streaks, form-understood, post-class feel).
- Created an interactive Body Map (front/back anatomy hotspots) that routes users into region-based mini workouts and the logger.
- Localized a trainer marketplace for Pakistan: city filters, Urdu/English coaching, voice notes, WhatsApp voice packages, and JazzCash / EasyPaisa payment confirmation without Cloud Functions.

---

## 5. Features inventory (source of truth for interviews)

### Member experience
- Auth / onboarding / fitness assessment (level, goals, equipment, limitations)
- Home dashboard with search, streaks, and next actions
- Class browse → book / waitlist → My Bookings → QR check-in
- Exercise Academy: catalog, favorites, learning paths, exercise detail with GIF form guide
- Train hub: Body Map regions, session builder, workout logger, rest timer, personal records
- Profile: membership status, form progress, check-in QR
- Trainer discovery → profile → book guidance package → chat / voice

### Trainer experience
- Apply as trainer (city, specialties, fee PKR, WhatsApp voice opt-in)
- Guidance inbox and chat (text + voice notes)
- Session packages: 15-min form check, 30-min deep dive, 5 voice replies, WhatsApp voice
- Payment status: unpaid → member marks paid → trainer/admin confirms

### Admin experience
- Today’s classes and active bookings overview
- Create / delete classes
- Approve or reject trainer applications
- Confirm marked-paid coaching sessions

### Platform / engineering
- Demo mode with seeded member + admin accounts (full walkthrough without Firebase)
- Firebase project ready (Firestore region `asia-south1`, Spark-safe; Auth/Storage path documented)
- Persisted Zustand stores + offline workout queue flush
- Push notification permission boot path, haptics, Reanimated motion system
- Typed domain model for bookings, exercises, trainers, guidance, payments

---

## 6. Tech stack (ATS keyword block)

**Mobile:** React Native, Expo 52, TypeScript, React Navigation (native stack + bottom tabs)  
**State:** Zustand (persist + AsyncStorage), domain stores for app + guidance  
**Backend / data:** Firebase (Firestore), demo seed architecture, offline queue  
**UI / UX:** React Native Reanimated, SVG (Body Map), Expo Linear Gradient, custom fonts (Syne, DM Sans), Expo Haptics  
**Media:** Expo AV (voice notes), GIF form assets + CDN fallback, QR code generation  
**Product systems:** RBAC, waitlists, learning paths, marketplace packages, local payments  
**Tooling:** Expo CLI, TypeScript `tsc`, Firebase CLI (rules / indexes deploy)

Copy-paste keyword line for resumes:

`Expo · React Native · TypeScript · Zustand · React Navigation · Firebase · Firestore · Reanimated · SVG · Offline-first · RBAC · Mobile Marketplace · Fitness Tech`

---

## 7. Impact & “big achievement” framing (honest, interview-ready)

Use these as talking points — they are true to the product without inventing user metrics.

1. **Category positioning** — Recentered a gym app around form mastery (“See the movement. Master the form.”) instead of vanity metrics.
2. **Full product surface** — One codebase covers education, operations, training, and monetized coaching — rare for a portfolio mobile app.
3. **Localization as product strategy** — Pakistan cities, JazzCash/EasyPaisa, WhatsApp voice, Urdu/English coaches: designed for how people actually hire trainers in the market.
4. **Operational correctness** — Waitlist promotion, cancel windows, QR check-in, and admin payment confirmation show systems thinking beyond UI screens.
5. **Demo-ready architecture** — Dual demo/Firebase mode lets the product be evaluated in minutes — critical for Toptal screens and client pitches.
6. **Constraint-aware engineering** — Built admin + marketplace flows that work on Firebase Spark without Cloud Functions — shipping under real cost constraints.
7. **Craft signal** — Interactive Body Map + GIF-synced form phases show you can own both interaction design and implementation.

**If asked for metrics you do not have yet:** speak to product completeness, architecture tradeoffs, and localization — not fabricated DAU/revenue numbers.

---

## 8. Suggested titles for profiles

- FitBrother — Form-First Gym Platform (Expo / React Native)
- FitBrother: GIF Form Academy + Class Booking + Pakistan Trainer Marketplace
- FitBrother — Multi-Role Fitness Product for Emerging Markets

---

## 9. How to use this file

| Channel | Use |
| --- | --- |
| Toptal project entry | Section 1 (paste as-is; trim last sentence if character-capped) |
| LinkedIn Featured / About / Experience | Section 2 |
| Resume project block | Section 3 + Section 4 bullets |
| Recruiter screen / cold outreach | Section 4 short variants |
| Interview prep | Sections 5–7 |

**Demo credentials (from README):**  
Member `member@fitbrother.app` · Admin `admin@fitbrother.app` · Password `demo1234`

---

*Generated from the FitBrother codebase for portfolio / ATS use. Update counts if the catalog or feature set grows.*
