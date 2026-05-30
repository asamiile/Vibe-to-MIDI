# Roadmap

Use this file as the progress tracker for remaining implementation work.

Keep entries short and actionable. Move detailed policy, rationale, or setup
notes into the relevant `.agents/*.md` file instead of expanding this roadmap.

Status markers:

- `[x]` done
- `[~]` implemented but needs follow-up
- `[ ]` not started

## Current Status

- [x] Free MVP core playback flow
- [x] MIDI screen with Pattern, Notes, and Sound tabs
- [x] Learn screen with Pulse and Bass explanations
- [x] Bottom player layer controls
- [x] Free playback visual wiring
- [x] Settings, licenses, privacy link, audio debug, and diagnostics
- [x] Pro entitlement constants, Pro screen, and dev-only Pro Preview
- [x] Pro-gated MIDI export — bytes generation and Android file save/share transport
- [x] MIDI File Save / Share — expo-sharing transport, success/failure states, tests — see `.agents/docs/qa/qa-midi-share.md`
- [x] Pro Generative Art — 3 Pro artworks, video thumbnail picker, Pro gate, performance QA — see `.agents/docs/qa/qa-pro-art.md`
- [~] Saved Ideas — save/load/delete generated ideas, duplicate guard, file storage — device QA pending, see `.agents/docs/qa/qa-persistence.md`

## Next Work

### 1. Dub Techno Sound Expansion

See `research/features/2026-05-22_dub-techno-sound-expansion/notebooks/analysis.ipynb` for research details.

- [x] Dub Chord Stabs (Oscillator + Filter + Envelope)
- [x] Filtered Dub Delay (DelayNode + BiquadFilterNode with feedback clamping)
- [x] Generative Noise/Percussion (AudioBufferSourceNode + Filter)
- [ ] Sub Bass & Rumble (Sine sub + Ducking + Filter)
- [ ] Filter Motion (LFO/Automation for cutoff drift)

### 2. Billing

See `.agents/docs/product/entitlements.md` for product ids, policy, and implementation
rules.

- [ ] Re-check current official RevenueCat docs.
- [ ] Re-check current official Expo compatibility docs.
- [ ] Re-check current official Google Play Billing policy.
- [ ] Add RevenueCat dependencies only after compatibility is confirmed.
- [ ] Create `app/frontend/src/features/billing/`.
- [ ] Configure purchases near app startup.
- [ ] Fetch customer info.
- [ ] Sync `pro_access` into Zustand store.
- [ ] Add purchase action.
- [ ] Add restore purchases action.
- [ ] Keep `setDevProAccess` development-only.
- [ ] Create Google Play product `vibetomidi_pro_lifetime_v1`.
- [ ] Create RevenueCat entitlement `pro_access`.
- [ ] Test purchase with Google Play internal testing.
- [ ] Test restore purchases.
- [ ] Add purchase/restore error states.

### 2. Release Operations

See `.agents/docs/engineering/security-ci-release.md` for release guardrails.

- [ ] Add Sentry for React Native / Expo crash reporting.
- [ ] Configure EAS Build source map upload.
- [ ] Decide whether EAS Update is enabled.
- [ ] If EAS Update is enabled, document channels and rollback/fix-forward.
- [ ] Update privacy policy for crash diagnostics.
- [ ] Update privacy policy for purchase provider.
- [ ] Create Android release smoke-test checklist.
- [ ] Verify Pro Preview is unavailable in production.
- [ ] Verify licenses screen.
- [ ] Verify privacy policy link.
- [ ] Monitor Google Play Android vitals after release.

## Design Backlog

Batch these in a dedicated design phase.

- [x] MIDI Export CTA
  - Location: MIDI screen, below `Pattern / Notes / Sound`.
  - Current free state: `Export MIDI · Pro`, routes to Pro screen.
  - Current Pro Preview state: `Export .mid`.
  - Current success state: shared filename.
  - Files:
    - `app/frontend/src/components/ui/DawStepsPanel.tsx`
    - `app/frontend/src/features/midi-export/export-midi.ts`
  - Needs design:
    - final placement
    - free vs Pro state
    - success / ready message
    - failure state
    - full-width command vs compact row vs Pro Pro prompt surface

- [x] ART · PRO Pro prompt button (PlayerBar)
  - Location: PlayerBar, top-right (same position as `ART: <label>` for Pro users).
  - Current free state: `ART · PRO` text button, routes to Pro screen.
  - Current Pro state: `ART: <shortLabel>`, opens artwork picker modal.
  - File: `app/frontend/src/components/ui/PlayerBar.tsx`
  - Needs design:
    - visual weight vs MIDI Export CTA (two Pro Pro prompt surfaces visible at once)
    - whether to show `ART · PRO` only when playing, or always
    - lock icon or text-only Pro prompt

- [x] Pro screen
  - Location: `app/frontend/app/pro.tsx`
  - Current state: placeholder layout — plain title, billing debug block, feature list, dev-only toggle.
  - Billing connect is Phase 3; this design can be built without it.
  - Needs design:
    - hero treatment (visual or motion that communicates Pro value)
    - purchase CTA button placement and copy (disabled until billing is live)
    - price display (one-time unlock)
    - feature list presentation (currently plain `ProRow` items)
    - Generative Art preview — consider showing a Pro video clip as a teaser
    - free vs Pro comparison if needed
    - post-purchase / already-Pro state

## Validation Checklist

Run for implementation work:

```bash
cd app/frontend
npx tsc --noEmit
npx jest --runInBand --no-coverage --watchman=false
```

Manual Android dev-build checks are required for:

- audio playback
- video playback
- file save/share
- billing
- performance-sensitive UI
