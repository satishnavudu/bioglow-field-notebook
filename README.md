# BioGlow Field Notebook — Native iOS & Android App

A real cross-platform mobile app built with **Expo + React Native + TypeScript** —
one codebase that runs on both iPhone and Android. This is the native version of
the BioGlow Field Notebook web prototype.

## What it is

An **offline field notebook for ecologists working in the rainforest**, created for
the FLL BioGlow challenge. Ecologists told the team they discover new findings
unexpectedly — a new plant, a reptile, an animal, something about the carbon cycle —
but carrying a laptop is a burden, a paper notebook is ruined by rain, and their
backpacks are already heavy. This app runs on the phone they already carry:

- **6 guided templates** — New Plant Species, Animal / Reptile Sighting, BioGlow
  Finding (glow colour picker + brightness), Carbon Cycle Observation, Quick Photo +
  Voice Capture, General Field Note
- **4 notebooks** — Species, BioGlow, Carbon, Daily Field Journal — with live counts,
  search and filters
- **Auto date/time**, **GPS location button** (with permission fallback to typing the
  place), **photo attach** (camera or library), **real voice-note recording** and
  playback (expo-av — it records audio; it does *not* fake speech-to-text)
- **100% offline saving** on the device with AsyncStorage — no account, no signal needed
- Star entries, entry detail view, delete, and **CSV export** (share sheet)
- **Rain / Glove Mode** — bigger buttons and text for wet hands
- **Ideas tab** — V1 → V2 → V3 roadmap and the alternate ideas considered
  (voice pendant, e-ink tablet, QR tags, smartwatch)
- Modern glossy design: deep-green gradients, glass cards, glowing lime/teal accents

## Project structure

```
App.tsx                     Navigation (bottom tabs + form/detail routes) and app state
src/types.ts                Entry, template and notebook types
src/templates.ts            All 6 templates (guided fields) and 4 notebook definitions
src/storage.ts              AsyncStorage load/save + CSV builder
src/components/ui.tsx       GlossyCard, BigButton, Chip, shared colours
src/screens/HomeScreen.tsx        Template + notebook picker, Rain/Glove toggle
src/screens/EntryFormScreen.tsx   Guided form: GPS, photo, voice recording
src/screens/NotebookScreen.tsx    Search, filters, star, export
src/screens/EntryDetailScreen.tsx Full entry view, star, delete
src/screens/IdeasScreen.tsx       Roadmap and alternate ideas
app.json                    App identity, bundle IDs, permission usage strings
eas.json                    EAS Build + Submit profiles (preview APK, production store)
STORE_SUBMISSION.md         Step-by-step App Store / Play Store submission checklist
```

## Run it on a real phone (fastest — no store, no developer account)

You need Node.js 20+ on a computer on the same Wi-Fi as the phone.

```bash
cd bioglow-field-notebook
npm install
npx expo start
```

1. Install **Expo Go** on the phone (free, from the App Store / Play Store).
2. Scan the QR code shown in the terminal with the phone camera (iPhone) or in the
   Expo Go app (Android).
3. The app opens on the phone. Shake the phone / tap the Expo Go menu for dev options.

Type-check at any time:

```bash
npm run typecheck   # tsc --noEmit
```

## Build installable apps with EAS Build

EAS (Expo Application Services) builds the native binaries in the cloud — no Xcode or
Android Studio needed on your computer.

```bash
npm install -g eas-cli
eas login                 # your own free Expo account
eas build:configure       # links the project to your Expo account (writes projectId)
```

| Purpose | Command | Output |
| --- | --- | --- |
| Android test APK (install directly) | `eas build -p android --profile preview` | `.apk` |
| Android store build | `eas build -p android --profile production` | `.aab` (required by Google Play) |
| iOS store build | `eas build -p ios --profile production` | `.ipa` (requires Apple Developer account) |
| iOS simulator build (dev only) | `eas build -p ios --profile preview` with simulator enabled | simulator app |

Signing is handled by EAS: for iOS it creates/manages the distribution certificate and
provisioning profile using **your Apple Developer account**; for Android it generates
and stores the upload keystore for **your Google Play app**. Never share those
accounts' passwords — log in yourself when EAS prompts.

## Publishing to the stores — honest notes

**Yes, this codebase is structured to become a real App Store / Play Store app**
(single Expo project, production EAS profiles, bundle IDs and permission strings set).
Publishing itself can only be done by the account owner:

- **Apple App Store:** Apple Developer Program — **$99/year**. Submit via
  `eas submit -p ios --profile production` or upload the `.ipa` in Transporter to
  App Store Connect, then complete the listing and pass Apple review.
- **Google Play:** Play Console developer account — **$25 one-time**. Submit via
  `eas submit -p android --profile production` or upload the `.aab` manually in Play
  Console. **New personal accounts created after Nov 2023 must first run a closed
  test with at least 12 testers opted in for 14 continuous days** before Google
  grants production access.
- Both stores need a listing (screenshots, description, content rating / privacy
  questionnaires) and a **public privacy policy URL**. This app collects nothing and
  sends nothing off the device — say exactly that in the policy and the store
  privacy forms, and keep it true.

Full step-by-step: see **STORE_SUBMISSION.md**.

## Known V1 choices / limits

- Voice notes are real audio recordings stored on the phone (expo-av). There is no
  speech-to-text in V1 — that is deliberately listed as a V2 item, not faked.
- Brightness uses a 1–5 selector instead of a continuous slider, to keep the app
  dependency-light and easy to tap with gloves.
- Entries live in AsyncStorage on one device. There is no cloud sync in V1 (that is
  the point — offline first); CSV export is the way to move data off the phone.
- The placeholder app icon/splash in `assets/` should be replaced with final artwork
  before a store submission.
