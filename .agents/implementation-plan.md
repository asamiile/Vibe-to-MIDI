# Implementation Plan

## Repository Layout

Planned top-level structure:

```text
research/
app/
  frontend/
  backend/
```

Research artifacts live under `research/`. Product implementation should live under `app/frontend` and `app/backend` when those directories are created.


## Phase 0: Research — COMPLETE

Research completed on 2026-05-10:
- Android audio latency: `research/features/2026-05-10_rn-android-audio-latency/` → not a blocker
- Market analysis: `research/features/2026-05-10_android-mvp-market/` → Android has largest gap

See `.agents/tech-stack.md` for the decided library choices.

## Phase 1: Android MVP — IN PROGRESS

Goal:

Create a single-screen Android prototype that maps vibe tags to playable sound and DAW-ready suggestions.

Actual stack (decided):

- React Native 0.81 + Expo SDK 54 + TypeScript
- Expo Router for navigation
- `react-native-audio-api` (Oboe backend, <15ms Android latency)
- NativeWind v4 (Tailwind CSS for RN)
- Zustand for state

App root: `app/frontend/`

Source structure: `app/frontend/src/` (see `.agents/coding-standards.md`)

Early persistence:

- Zustand in-memory store (no AsyncStorage yet)

Initial feature set:

- vibe tag selection
- generated synth playback
- generated rhythm playback
- visual response
- suggested scale/chords/bass/rhythm/sound hints

Learning Flow Requirements:

1. Let the user create or hear something first.
2. Show DAW-ready musical choices immediately after playback.
3. Reveal theory only as an optional explanation of the generated result.
4. Avoid blocking creation behind lessons, quizzes, or terminology.

## Phase 2: Pattern Editor

Add a compact pattern interface:

- 16-step bass lane
- chord/stab lane
- hat/percussion lane
- velocity or probability variation
- BPM control

This should validate whether the app helps users decide what to place in a DAW.

## Phase 3: MIDI Export

Add:

- `.mid` export
- BPM metadata
- key / scale metadata
- generated bass and melody notes

Keep generated MIDI simple and reliable before adding advanced arrangement features.

## Phase 4: Mac App Strategy

Only after the Android MVP proves useful:

- evaluate whether a Mac app is needed
- consider React Native macOS if React Native reuse is practical
- consider Electron only if web-based reuse becomes more valuable than native reuse
- add local file access
- add MIDI output
- explore OSC output
- investigate Ableton Link
- prepare TouchDesigner workflows

## Phase 5: Local AI

Local AI should come after deterministic generation works.

Candidate features:

- MIDI variation generation
- rhythm variation generation
- synth parameter suggestions
- short texture generation
- percussion variation generation

The core app must remain usable without AI.
