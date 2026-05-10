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


## Phase 0: Research First

Before implementing product features, collect lightweight research notes for:

- copyright-safe audio strategy
- synthesis-first audio design
- React Native audio playback and synthesis options
- Android audio latency constraints
- MIDI export
- shadcn/ui setup
- React Native compatibility with shadcn-style component architecture
- CI and release automation
- local AI audio generation feasibility
- compute requirements for local ML

Do not block the MVP on exhaustive research. Keep notes concise and actionable.

## Phase 1: Android MVP

Goal:

Create a single-screen Android prototype that maps vibe tags to playable sound and DAW-ready suggestions.

Suggested stack:

- React Native
- Expo if it does not block required audio/MIDI features
- TypeScript
- shadcn-style component structure where practical
- React Native audio libraries selected after research
- Skia or React Native SVG only if needed for visuals

Early persistence:

- local app storage

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
