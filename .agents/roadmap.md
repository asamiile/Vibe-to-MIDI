# Roadmap

Use this file when planning the remaining implementation work. It summarizes
the current repository state and the recommended order of work. For deeper
rules, open the linked task-specific `.agents/*.md` file instead of reading the
whole repository.

## Current Product State

The free MVP is largely implemented.

Implemented:

- Android-first Expo / React Native app in `app/frontend`.
- Central PLAY flow that generates and plays a dub-techno loop.
- Random sound-layer combinations: kick, bass, noise, and stab.
- Random chord candidate selection and BPM selection.
- Generated synthesis through `react-native-audio-api`.
- MIDI screen with Pattern, Notes, and Sound tabs.
- Learn screen with Pulse and Bass explanations.
- Layer toggles in the bottom player bar.
- Free playback visual metadata and video wiring.
- Settings, licenses, privacy link, audio debug, and runtime diagnostics.
- Pro preparation: entitlement constants, Pro screen, dev-only Pro Preview,
  and feature gates.

Still intentionally incomplete:

- Real `.mid` export.
- Real purchase / restore flow.
- RevenueCat / Google Play Billing integration.
- Pro-only generative art assets.
- Sentry and release observability.
- Pattern editor.
- Persistent saved ideas or favorites.
- Local AI features.

## Product Priorities

Keep this product shape:

```text
hear something first
-> inspect MIDI-ready choices
-> learn why it works
-> optionally export or unlock deeper playback
```

Do not turn the MVP into:

- a DAW
- a streaming player
- a course-first theory app
- a full AI music generator
- a reference-track or artist-style copier

Free users must still be able to hear previews, inspect note/rhythm/sound
guidance, and use the basic Learn loop.

## Recommended Implementation Order

### 1. Stabilize Free MVP

Goal: make the free experience ready for real Android testing before adding
billing complexity.

Work:

- Finish visual polish against the current Claude Design references.
- Keep MIDI and Learn screens focused on DAW action, not theory exposition.
- Verify top PLAY, MIDI, Learn, Settings, Licenses, Privacy, and Audio Debug.
- Keep audio generation sample-free and copyright-safe.

Primary files:

- `app/frontend/app/index.tsx`
- `app/frontend/src/components/ui/DawStepsPanel.tsx`
- `app/frontend/src/components/ui/IntuitiveLearningPanel.tsx`
- `app/frontend/src/components/ui/PlayerBar.tsx`
- `app/frontend/src/components/ui/PlaybackVisual.tsx`
- `app/frontend/src/styles/theme.ts`

Validation:

```bash
cd app/frontend
npx tsc --noEmit
npx jest --runInBand --no-coverage --watchman=false
```

### 2. Implement Pro-Gated MIDI Export

Goal: make the strongest Pro feature work before adding the billing SDK.

Reason: MIDI export directly serves the product promise: vibe to DAW-ready
choices.

Work:

- Create `app/frontend/src/features/midi-export/`.
- Generate `.mid` data from the currently displayed `MusicalSuggestion`.
- Include tempo, chord notes, bass notes, kick timing, and stab timing where
  practical.
- Use `@tonejs/midi`; it is already installed.
- Keep MIDI generation in pure feature code, not UI components.
- Add a Pro-gated export entry point in the MIDI screen.
- Free users should see the value and be routed to the Pro screen.
- Pro Preview should allow local testing before real billing is connected.

Primary files:

- `app/frontend/src/features/entitlements/pro-features.ts`
- `app/frontend/src/features/vibe-map/daw-view.ts`
- `app/frontend/src/components/ui/DawStepsPanel.tsx`
- `app/frontend/app/pro.tsx`
- new `app/frontend/src/features/midi-export/**`

Tests to add:

- MIDI file creation from a deterministic suggestion.
- Tempo metadata.
- Expected tracks or events for bass, chord/stab, and kick.
- Pro gate behavior for free vs Pro access.

Do not add:

- Bundled MIDI files.
- Copyrighted loops.
- DAW-specific export formats before generic `.mid` works.

### 3. Wire Real Billing

Goal: replace local Pro Preview as the real source of Pro access in production.

Current policy:

```text
Free app -> one-time Pro unlock -> RevenueCat + Google Play Billing
```

Work:

- Re-check current official RevenueCat, Expo, and Google Play Billing docs before
  adding dependencies.
- Add RevenueCat packages only after compatibility is confirmed.
- Create `app/frontend/src/features/billing/`.
- Configure RevenueCat once near app startup.
- Fetch customer info and sync `pro_access` into the Zustand store.
- Add purchase and restore actions.
- Keep billing-provider code separate from UI components.
- Keep `setDevProAccess` development-only.

Primary files:

- `app/frontend/src/data/store.ts`
- `app/frontend/app/pro.tsx`
- `app/frontend/app/_layout.tsx`
- new `app/frontend/src/features/billing/**`
- `app/frontend/app.json`
- `app/frontend/package.json`

External setup:

- Google Play product id: `vibetomidi_pro_lifetime_v1`.
- RevenueCat entitlement id: `pro_access`.
- RevenueCat offering/package for a lifetime unlock.
- Google Play internal testing account.

Do not add:

- External checkout links for in-app digital features.
- Stripe checkout for the Google Play app.
- Subscriptions, credits, or usage metering for the first paid release.
- RevenueCat webhooks until there is a secure backend need.

### 4. Add Pro Generative Art Playback

Goal: add a second paid value layer after MIDI export and billing are stable.

Work:

- Add only project-owned or clearly licensed visual assets.
- Keep source media outside Git; commit only compressed app-ready assets.
- Use the naming pattern from `.agents/audio-licensing.md`.
- Add Pro artwork metadata with `plan: 'pro'`.
- Gate selection through `getSelectablePlaybackArtworks(hasProAccess)`.
- Update `app/frontend/src/data/licenseNotices.ts`.
- Test Android playback performance while audio is running.

Primary files:

- `app/frontend/src/features/playback-visuals/artworks.ts`
- `app/frontend/src/components/ui/PlaybackVisual.tsx`
- `app/frontend/src/components/ui/PlayerBar.tsx`
- `app/frontend/src/data/licenseNotices.ts`
- `app/frontend/assets/visuals/**`

Do not add:

- Unlicensed videos, generated assets without redistribution rights, or
  copyrighted reference material.
- A Pro asset as the default free playback visual.

### 5. Release Operations Prep

Goal: prepare the first public Android release after core free and Pro flows are
usable in internal testing.

Work:

- Add Sentry for React Native / Expo crash and JS error reporting.
- Configure EAS Build source map upload.
- Add privacy policy language for crash diagnostics and purchase provider.
- Create an Android release smoke-test checklist.
- Validate Pro Preview is unavailable in production builds.
- Monitor Google Play Android vitals after release.

Primary files:

- `.agents/security-ci-release.md`
- `app/frontend/app.json`
- `app/frontend/eas.json`
- `app/frontend/src/lib/app-metadata.ts`
- `docs/privacy-policy.html`

Do not commit:

- Sentry auth tokens.
- Play signing material.
- `google-services.json`.
- private support exports.

### 6. Pattern Editor

Goal: validate whether users can move from suggested choices into editable
DAW-like patterns.

Work:

- Add compact pattern controls after MIDI export is proven.
- Start with 16-step lanes for kick, bass, and stab.
- Keep the editor minimal and Android-first.
- Generate updated MIDI guidance and export data from edited state.

Primary future location:

- `app/frontend/src/features/pattern-editor/`

Do not build a full DAW. The editor should remain a decision aid and export
preparation surface.

### 7. Local AI and Advanced Variations

Goal: add optional intelligence after deterministic generation is useful.

Candidate work:

- MIDI variation suggestions.
- Rhythm variation suggestions.
- Synth parameter suggestions.
- Percussion variation suggestions.

Rules:

- The core app must remain usable without AI.
- Keep AI optional and modular.
- Do not add external AI APIs unless a new strategy decision allows it.

## Cross-Cutting Guardrails

### Licensing

Prefer generated synthesis. Do not commit copyrighted audio, loops, stems,
samples, presets, MIDI files, or unclear-license visual media.

When adding runtime assets or dependencies, update:

```text
app/frontend/src/data/licenseNotices.ts
```

### Architecture

Keep ownership boundaries clear:

- UI: `app/frontend/src/components/ui/`
- app routes: `app/frontend/app/`
- music mapping: `app/frontend/src/features/vibe-map/`
- audio playback: `app/frontend/src/features/audio-engine/`
- entitlements: `app/frontend/src/features/entitlements/`
- future billing: `app/frontend/src/features/billing/`
- future MIDI export: `app/frontend/src/features/midi-export/`
- future pattern editor: `app/frontend/src/features/pattern-editor/`

Do not put music generation, billing, or MIDI serialization logic directly in
React components.

### Tests

Minimum validation for implementation work:

```bash
cd app/frontend
npx tsc --noEmit
npx jest --runInBand --no-coverage --watchman=false
```

Use Android dev builds for audio, video, billing, and performance-sensitive
checks. Expo Go is not enough for native audio or billing work.

### Dependency Changes

Before adding a dependency:

1. Confirm Expo SDK compatibility.
2. Confirm license compatibility.
3. Confirm whether a native rebuild is required.
4. Update docs if setup or build behavior changes.

Billing SDKs, Firebase, Sentry, and other native modules require development or
release builds and cannot be validated only through Metro reload.

## Useful Source Docs

- Product: `.agents/product.md`
- Music direction: `.agents/music-direction.md`
- Implementation phases: `.agents/implementation-plan.md`
- Tech stack and commands: `.agents/tech-stack.md`
- Android dev build: `.agents/android-dev-guide.md`
- Design direction: `.agents/design-system.md`
- Entitlements and billing: `.agents/entitlements.md`
- Security and release: `.agents/security-ci-release.md`
- Audio and visual licensing: `.agents/audio-licensing.md`
- Feature delivery workflow: `.agents/feature-delivery-flow.md`
