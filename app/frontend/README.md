# Vibe-to-MIDI — Frontend

React Native / Expo Android app.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Language | TypeScript (strict) |
| Navigation | Expo Router |
| Audio | react-native-audio-api (Oboe, <15ms Android latency) |
| Styling | NativeWind v4 (Tailwind CSS) |
| State | Zustand |
| Build | EAS Build |

See [../../.agents/tech-stack.md](../../.agents/tech-stack.md) for full library decisions and rationale.

---

## Setup

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required: expo-router has a react-dom peer dep conflict with react@19.

---

## Run (Metro bundler only)

```bash
npx expo start
```

Audio will not work without a Dev Build. Use this for UI-only iteration.

---

## Dev Build (required for audio)

`react-native-audio-api` uses native Oboe code and cannot run in Expo Go.

### Option A — EAS cloud build

```bash
eas build --profile development --platform android
```

Downloads a pre-built APK. Fastest if Android SDK is not installed locally.

### Option B — local build

Requires Android Studio + Android SDK (API 26+).

```bash
npx expo run:android
```

After the first native build, JS-only changes reload instantly.

---

## Tests

```bash
npx jest --no-coverage      # run all tests
npx tsc --noEmit            # type check
```

Test files in `__tests__/`:

| File | Coverage |
|------|---------|
| `vibe-map.test.ts` | All 10 vibes → valid MusicalSuggestion |
| `notes.test.ts` | MIDI ↔ note name, frequency |
| `scales.test.ts` | Scale generation by mode |

Audio engine (`react-native-audio-api`) is tested manually on device — it requires native Oboe and cannot run in Node/Jest.

---

## Source structure

```
app/
  _layout.tsx         root layout (SafeAreaProvider)
  index.tsx           main vibe screen
src/
  features/
    vibe-map/
      types.ts        VibeId, MusicalSuggestion, RhythmPattern
      data.ts         10 vibes × scale/chord/bass/rhythm tables
      engine.ts       getMusicalSuggestion() — pure function
    audio-engine/
      adapter.ts      AudioContext singleton
      player.ts       playPreview() — OscillatorNode synth loop
  components/
    ui/
      VibeTag.tsx     pressable vibe chip
      SuggestionPanel.tsx  scale/chord/bass/rhythm display
  data/
    store.ts          Zustand store
  lib/
    notes.ts          MIDI ↔ note name, frequency
    scales.ts         getScaleNotes(root, mode)
    chords.ts         getChordNotes(root, quality)
  __mocks__/
    react-native-audio-api.ts  Jest mock for native module
```

---

## EAS profiles

Defined in `eas.json`:

| Profile | Use |
|---------|-----|
| `development` | Dev build with dev client (daily use) |
| `preview` | Internal APK for QA |
| `production` | Play Store upload |

---

## Deferred

| Feature | Notes |
|---------|-------|
| Firebase Crashlytics/Analytics | Add before first user test. Needs `google-services.json` (not committed). |
| MIDI export | `@tonejs/midi` installed. Wire to UI in Phase 3. |
| Phase 2 pattern editor | 16-step sequencer, after MVP validation. |
