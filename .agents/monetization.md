# Monetization Direction

Use this file when a task touches paid features, purchase flows, Pro gating, billing libraries, store policy, or external payment links.

## Current Recommendation

Start with a narrow paid model:

```text
Free app
-> one-time Pro unlock
-> Google Play Billing, preferably through RevenueCat
```

Do not start with subscriptions, usage credits, or external checkout unless a new research pass explicitly recommends it.

Primary research artifact:

- `research/features/2026-05-20_paid-content-strategy/notebooks/analysis.ipynb`

## Pro MVP Candidates

Prioritize these as the first Pro features:

- MIDI export for the currently displayed track idea.
- Generative Art playback view using project-owned works during music playback.

Good secondary Pro candidates:

- Extra dub techno track recipe packs.
- Extra sound palettes and mix variants.
- Advanced learning modules for chord color, bass movement, stab timing, and dub space.
- Saved favorites or saved ideas.

Keep the free app useful. Free users should still be able to select a vibe, hear previews, read MIDI-entry guidance, and use the basic learning loop.

## Generative Art Policy

Generative Art can be a Pro experience layer, but only use works the project has the right to distribute commercially inside the app.

Before adding artwork assets:

- Confirm ownership or license.
- Confirm commercial app distribution rights.
- Confirm whether attribution is required.
- Update `app/frontend/src/data/licenseNotices.ts` when runtime assets are bundled.
- Check Android performance while audio playback is active.

Prefer a small free preview over hiding all visual value behind Pro:

```text
Free: limited visual preview
Pro: full Generative Art playback view
```

## MIDI Export Policy

MIDI export is the strongest paid feature because it directly serves the product goal:

```text
vibe -> DAW-ready musical choices
```

When implementing MIDI export:

- Export the currently displayed bass, chord, kick, noise, and timing data where possible.
- Keep exported MIDI original and generated from internal data.
- Do not bundle copyrighted MIDI files.
- Make the free MIDI screen useful even when export is Pro-gated.

## Billing Guidance

For Google Play-distributed Android builds, in-app digital goods should use Google Play Billing unless a researched regional/program exception applies.

Preferred implementation path:

```text
RevenueCat + Google Play Billing
```

Reason:

- Expo IAP requires development builds.
- RevenueCat simplifies products, entitlements, offerings, paywalls, receipt validation, restore, and future cross-platform purchase state.

Avoid for MVP:

- Stripe or external checkout for in-app digital features.
- In-app links that lead users to external payment pages.
- Web-only checkout prompts inside the Google Play app.

External payments may be possible in specific regions or programs, but require eligibility checks, enrollment, required UX, transaction reporting, and legal/policy review.

## Agent Rules

- Do not add billing dependencies without checking `.agents/tech-stack.md` and current Expo compatibility.
- Do not implement payment UI before product IDs, entitlement names, restore behavior, refund behavior, and free/Pro boundaries are specified.
- Do not gate core learning so heavily that the free app cannot prove the product value.
- Treat payment policy as time-sensitive. Re-check official Google Play, Expo, and RevenueCat docs before implementation.
