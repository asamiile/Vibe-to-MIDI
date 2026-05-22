# Vibe-to-MIDI — Frontend

React Native / Expo Android app.

For commands (setup, run, tests, build), see the [root README](../../README.md).

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Language | TypeScript (strict) |
| Navigation | Expo Router |
| Audio | react-native-audio-api (Oboe, <15ms Android latency) |
| Styling | NativeWind v4 (Tailwind CSS v3) |
| State | Zustand |
| Build | EAS Build |

See [../../.agents/tech-stack.md](../../.agents/tech-stack.md) for library decisions and rationale.

---

## Dev Build — why it's required

`react-native-audio-api` uses native Oboe code compiled into the APK. Expo Go is a pre-built sandbox that doesn't include custom native modules, so audio is silently disabled there. A Dev Build is a custom Expo client that includes the native module.

Once installed, JS/TS code changes hot-reload without rebuilding. Rebuild is only needed when adding/removing native modules or changing `app.json` native config.

### Local dev build commands

From `app/frontend`:

```bash
# Android emulator / connected Android device
npx expo run:android

# iOS simulator / connected iOS device
npx expo run:ios
```

Then start Metro for the installed dev build:

```bash
npx expo start --dev-client
```

---

## Tests

| File | Coverage |
|------|---------|
| `vibe-map.test.ts` | All 10 vibes → valid MusicalSuggestion |
| `notes.test.ts` | MIDI ↔ note name, frequency |
| `scales.test.ts` | Scale generation by mode |

Audio engine is not unit-tested — it requires native Oboe and cannot run in Node/Jest.

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
