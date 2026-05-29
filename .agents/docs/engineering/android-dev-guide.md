# Android Dev Guide

Use installed Expo skills for generic Dev Client, EAS Build, deployment, and upgrade guidance. This file keeps only Vibe-to-MIDI-specific Android notes.

## App Root

```bash
cd app/frontend
```

## Setup

```bash
npm install --legacy-peer-deps
```

`--legacy-peer-deps` is currently needed because Expo Router's React DOM peer dependency conflicts with the installed React version.

## Audio Requires Dev Build

The app uses `react-native-audio-api`, so Expo Go is not enough for audio preview work.

Use one of:

```bash
npx expo run:android
eas build --profile development --platform android
```

Then start Metro for the dev client:

```bash
npx expo start --dev-client
```

## Verification

No device:

```bash
npx tsc --noEmit
npx jest --runInBand --no-coverage --watchman=false
```

Device smoke test:

1. Open the dev build.
2. Select a vibe.
3. Confirm kick, bass, noise, and STAB layer toggles produce sound.
4. Open MIDI and confirm note names, MIDI numbers, step numbers, filters, and echo settings match the selected vibe.

## Deferred Native Additions

MIDI export can add `expo-file-system` and `expo-sharing` when implementation starts.

Do not add Firebase or analytics until real-user testing requires them and privacy/release docs are updated.
