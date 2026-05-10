# Android Dev Guide

## Prerequisites

- Node.js 20+
- Android Studio with Android SDK (API 26+)
- ADB (Android Debug Bridge)
- EAS CLI: `npm install -g eas-cli`
- Expo CLI: included via `expo` package

---

## First-time setup

```bash
cd app/frontend
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is needed because expo-router's react-dom peer dep conflicts with react@19.1.0.

---

## Local development (Metro bundler)

```bash
cd app/frontend
npx expo start
```

This starts the Metro bundler. However, `react-native-audio-api` requires a **Dev Build** — Expo Go will not work.

---

## Dev Build (required for audio)

Build once, then iterate with JS-only changes:

```bash
# Build APK (internal testing)
eas build --profile development --platform android

# OR: build locally (requires Android SDK)
npx expo run:android
```

After the first native build, JS changes apply instantly without rebuilding.

---

## Testing on device

```bash
# Install APK to connected device
adb install <path-to-apk>

# OR start Metro and connect device
npx expo start --dev-client
```

---

## Audio latency check

The audio engine uses `react-native-audio-api` backed by Oboe/AAudio.

Expected output latency on modern Android (API 26+, Oboe ExclusiveMode):
- Pixel-class devices: 7–15ms
- Mid-range Android 8+: 15–30ms
- Budget / old Android: up to 45ms (Android CDD max)

Subjective check: tap a vibe tag → Play → hear bass note. Should feel instant (no audible lag on mid-range device).

---

## Running tests (no device needed)

```bash
cd app/frontend
npx jest --no-coverage
npx tsc --noEmit
```

---

## Known setup friction

| Issue | Fix |
|-------|-----|
| `babel-preset-expo` not found in Jest | Installed as top-level dev dep (see tech-stack.md) |
| `react-native-worklets/plugin` not found | Install `react-native-worklets` package |
| jest@30 conflicts with jest-expo@55 | Use jest@29 only |
| `--legacy-peer-deps` needed | expo-router@6 has react-dom peer dep conflict with react@19.1.0 |

---

## CI

GitHub Actions at `.github/workflows/ci.yml` runs on every PR and push:
- `npm ci --legacy-peer-deps`
- `npx tsc --noEmit`
- `npx jest --ci --no-coverage`

No Android cloud build in CI. EAS Build handles APK generation.

---

## EAS Build profiles

Defined in `app/frontend/eas.json`:

| Profile | Distribution | Use case |
|---------|-------------|----------|
| `development` | internal | Dev build with dev client |
| `preview` | internal | Pre-release QA APK |
| `production` | store | Play Store upload |

---

## Phase 3: MIDI export (deferred)

`@tonejs/midi` is already installed. When Phase 3 begins:
1. Generate `.mid` buffer in `src/features/midi-export/`
2. Save via `expo-file-system`
3. Share via `expo-sharing`
4. No `expo-file-system` or `expo-sharing` installed yet — add when needed.

---

## Firebase (deferred)

Add before first real user device test:
```bash
npm install @react-native-firebase/app @react-native-firebase/crashlytics @react-native-firebase/analytics --legacy-peer-deps
```
Requires: `google-services.json` placed in `android/app/` (not committed to git).
