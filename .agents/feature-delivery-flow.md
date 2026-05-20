# Feature Delivery Flow

Use this file when a task should move from product/technical research into implementation and verification.

This flow sits above `commands/research-feature.md`. The research command creates a decision artifact. This flow explains how to choose the artifact, implement from it, test the change, and report the result.

## When To Use

Use this flow for work that affects:

- product direction
- paid features or entitlements
- audio / MIDI behavior
- Generative Art or bundled media
- AI / ML scope
- platform support
- core user workflow

Skip this flow for:

- small bug fixes
- copy edits
- styling-only changes
- internal refactors with no product decision
- test-only changes

## High-Level Flow

```text
idea
-> research basis
-> implementation scope
-> implementation branch
-> develop
-> test
-> final summary
```

## 1. Establish Research Basis

Before implementation, identify the research artifact that justifies the work.

Required fields:

```text
Research directory:
Notebook:
Recommendation:
Decision date:
Relevant finding:
Implementation scope:
```

Example:

```text
Research directory: research/features/2026-05-20_paid-content-strategy/
Notebook: research/features/2026-05-20_paid-content-strategy/notebooks/analysis.ipynb
Recommendation: Narrow
Decision date: 2026-05-20
Relevant finding: Start with one-time Pro unlock; defer external checkout.
Implementation scope: Pro entitlement scaffold, Pro screen, MIDI export gate.
```

If no research artifact exists and the change affects a research-required area, run `research-feature` first.

If multiple research artifacts conflict, summarize the conflict and ask which one to follow before implementing.

If the user explicitly asks to proceed without new research, state the assumption and keep the implementation reversible.

## 2. Create Implementation Branch

Do not implement directly on the research branch.

Use a branch name that reflects delivery work:

```text
feature/<short-slug>
fix/<short-slug>
docs/<short-slug>
```

For research-backed feature work, prefer:

```text
feature/<research-slug-without-date>
```

Example:

```text
research/2026-05-20_paid-content-strategy
-> feature/paid-content-prep
```

If the user explicitly asks to create a branch before implementation, do it before file edits.

## 3. Define Scope Before Editing

Write down the narrow implementation scope in the working notes or final summary.

Include:

- what will change
- what will not change
- whether new dependencies are allowed
- whether assets, audio, MIDI, fonts, or generated media are being added
- which `.agents/*.md` files apply

For paid features, read `.agents/entitlements.md`.

For media or audio assets, read `.agents/audio-licensing.md`.

For Expo / React Native dependencies, read `.agents/tech-stack.md`.

## 4. Develop

Use existing app patterns before adding new abstractions.

Prefer:

- small feature modules under `app/frontend/src/features/**`
- UI components under `app/frontend/src/components/ui/**`
- state changes in `app/frontend/src/data/store.ts` only when app-wide state is needed
- tests next to existing `app/frontend/__tests__/**`

Avoid:

- broad refactors during feature delivery
- dependency additions without research and compatibility checks
- editing installed skills under `.agents/skills/**`
- adding copyrighted or unclear media assets

## 5. Test

For `app/frontend` changes, run:

```bash
cd app/frontend
npx tsc --noEmit
npx jest --runInBand --no-coverage --watchman=false
```

If tests cannot run, state exactly why.

If the feature affects native audio, Android navigation, in-app purchases, or media performance, add a manual Android dev-build test note.

## 6. Final Summary

Final responses for feature delivery should include:

- branch name
- research basis, if used
- implementation summary
- files changed
- validation commands and results
- intentionally deferred work
- license / asset note when relevant

Use this compact format:

```text
Branch:
Research basis:
Changed:
Verified:
Deferred:
License/assets:
```

## Sub-Agent Guidance

Do not use sub-agents by default.

Use sub-agents only when work can be split safely:

- separate research questions
- isolated modules with disjoint write sets
- independent verification

Do not use sub-agents for small agent-doc changes or tightly coupled UI/state work.
