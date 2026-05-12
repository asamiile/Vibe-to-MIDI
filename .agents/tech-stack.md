# Tech Stack

Core decisions are based on research in:
- `research/features/2026-05-10_rn-android-audio-latency/`
- `research/features/2026-05-10_android-mvp-market/`

## App location

```
app/frontend/   ← React Native / Expo project root
```

## Core framework

| Layer | Choice | Version | Notes |
|-------|--------|---------|-------|
| Language | TypeScript | ~5.9 | strict mode |
| Framework | React Native | 0.81.x | New Architecture enabled |
| Build base | Expo SDK | ~54 | Managed workflow + Dev Build |
| Navigation | Expo Router | ~6 | File-based routing |
| Build / distribution | EAS Build | CLI ≥7 | dev / preview / production profiles |

## Audio

| Package | Version | Notes |
|---------|---------|-------|
| `react-native-audio-api` | ^0.12.1 | Web Audio API compatible. Uses Oboe 1.9.3 on Android → <15ms output latency. Requires Expo Dev Build (not Expo Go). |
| `react-native-worklets` | latest | Required peer dep for react-native-reanimated v4 babel plugin |

The audio engine implements an `AudioContext` singleton and a step-scheduled dub techno loop with kick, bass, noise/hat, and chord stab layers. The preview clamps BPM to 80-120 even when source vibe BPM ranges are faster.

## Styling

| Package | Version | Notes |
|---------|---------|-------|
| `nativewind` | ^4.2 | Tailwind CSS for React Native |
| `tailwindcss` | ^3.4 | **Must be v3** — NativeWind v4 does not support Tailwind v4 |

Content paths in `tailwind.config.js`: `./app/**/*.{ts,tsx}` and `./src/**/*.{ts,tsx}`.

## State management

| Package | Version | Notes |
|---------|---------|-------|
| `zustand` | ^5.0 | App-level store at `src/data/store.ts`. Holds active vibe, current suggestion, playback state, and active audio layers. |

## MIDI

| Package | Version | Notes |
|---------|---------|-------|
| `@tonejs/midi` | ^2.0.28 | Scaffolded for MIDI export. Current MIDI screen shows DAW-entry note, step, and sound-setting guidance. |

## Testing

| Package | Version | Notes |
|---------|---------|-------|
| `jest` | ^29.7 | Must stay at v29 — jest-expo@55 requires jest@29, not v30 |
| `jest-expo` | ^55 | Preset handles RN/Expo transforms |
| `babel-preset-expo` | ^55 | Must be installed as top-level dev dep (hoisting from expo's nested node_modules) |
| `react-native-worklets` | latest | Required for babel-preset-expo to resolve reanimated plugin in Jest |
| `@types/jest` | latest | Required for TS type resolution of `describe/it/expect` |

### Running tests

```bash
cd app/frontend
npx tsc --noEmit
npx jest --runInBand --no-coverage --watchman=false
```

Use `--watchman=false` locally if Watchman cannot write to its state directory.

### Test files

```
__tests__/vibe-map.test.ts    # all 20 vibes → valid MusicalSuggestion
__tests__/notes.test.ts       # MIDI ↔ note name, frequency
__tests__/scales.test.ts      # scale generation by mode
__tests__/learning.test.ts    # learning cue helpers
```

Audio engine is not unit-tested (requires native Oboe). Covered by manual device test.

## Config files

| File | Purpose |
|------|---------|
| `app.json` | name: "Vibe-to-MIDI", scheme: "vibe-to-midi", plugins: [expo-router, react-native-audio-api] |
| `babel.config.js` | `babel-preset-expo` with `jsxImportSource: nativewind` + `nativewind/babel` |
| `metro.config.js` | `withNativeWind(config, { input: './global.css' })` |
| `tailwind.config.js` | NativeWind preset, content: app/** + src/** |
| `global.css` | Tailwind directives |
| `tsconfig.json` | strict, types: ["jest"], paths: {"@/*": ["./src/*"]} |
| `eas.json` | development (dev build) / preview / production profiles |

## What is NOT used (and why)

| Rejected | Reason |
|----------|--------|
| `expo-audio` | ExoPlayer backend, 100–300ms latency, no synthesis capability |
| `react-native-sound` | Unmaintained since 2021 |
| `Tone.js via WebView` | No sound on iOS WebView, distorted on Android emulator |
| Firebase | Deferred — requires google-services.json. Add before first real device test. |
| SQLite | Not needed for MVP. AsyncStorage sufficient for local state. |
| Server/deploy | Android app — no deploy environment needed at any phase. |
