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

- TOP central play button with MIDI / Learn / Settings utility navigation
- random sound-layer construction from store-held sound configurations
- random chord selection from a chord pool
- generated synth playback
- generated rhythm playback
- visual response
- suggested scale/chords/bass/rhythm/sound hints

Current generation model:

- Keep sound-part definitions in store state as `soundConfigurations`.
- Keep reusable chord candidates in a data module, then expose them through store as `chordPool`.
- Store only the active generated state in `activeSoundCombination`, `activeChord`, `activeLayers`, and `suggestion`.
- Do not model generated playback as a "song" or "track". Avoid song lists, track titles, and saved music catalogs until a separate product decision introduces them.
- The audio engine should continue using generated synthesis. Do not add bundled audio files for this flow.

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

## Phase 3.5: Release Operations Prep

Goal:

Prepare the first public Android release so crashes, bad updates, support
reports, and app-version issues can be diagnosed without adding unnecessary
analytics.

Research:

- `research/features/2026-05-23_release-operations-observability/`

Current implementation status:

- Settings exposes selectable runtime diagnostics for support reports.
- Release operations plan lives in `.agents/security-ci-release.md`.

Before release:

- Add Sentry and source map upload for EAS Build.
- If EAS Update is enabled, add source map upload and rollback/fix-forward
  runbook.
- Update privacy policy for crash diagnostics.
- Keep Google Play Android vitals as the store-quality source of truth.
- Create a manual release smoke-test checklist for Android audio/video.

After release:

- Monitor Sentry and Google Play Android vitals.
- Triage launch crashes, foreground crashes, ANRs, audio/video failures, then
  lower-priority UI defects.
- Add Remote Config, Firebase, EAS Observe, or RevenueCat webhooks only when the
  specific operational need exists.

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
