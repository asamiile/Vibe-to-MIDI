# feature-delivery command spec

## Purpose

Run a research-backed feature from decision artifact to implementation and verification.

Use this command when the user asks to proceed from research into implementation, asks for a full feature workflow, or wants `research -> develop -> test` handled consistently.

## Relationship To research-feature

- `research-feature` produces a research notebook and recommendation.
- `feature-delivery` consumes that recommendation and implements a scoped change.

Do not replace `research-feature` with this command. Use both when the feature requires research.

## Required Inputs

Before implementation, identify:

- feature idea or implementation goal
- research directory, if available
- notebook path, if available
- recommendation used: Build / Narrow / Defer / Reject
- exact implementation scope

If the user did not provide a research artifact, search `research/features/` for the most relevant one.

If no relevant research exists and the change affects product direction, paid features, audio/MIDI behavior, Generative Art, AI/ML, or platform support, run `research-feature` first or ask the user whether to proceed without research.

## Steps

1. Read `AGENTS.md`.
2. Read `.agents/feature-delivery-flow.md`.
3. Read only task-specific files such as:
   - `.agents/product.md`
   - `.agents/music-direction.md`
   - `.agents/entitlements.md`
   - `.agents/audio-licensing.md`
   - `.agents/tech-stack.md`
4. Establish the research basis:
   ```text
   Research directory:
   Notebook:
   Recommendation:
   Decision date:
   Relevant finding:
   Implementation scope:
   ```
5. Create a delivery branch before editing:
   ```bash
   git checkout -b feature/<short-slug>
   ```
6. Implement the scoped change.
7. Add or update focused tests.
8. Run validation:
   ```bash
   cd app/frontend
   npx tsc --noEmit
   npx jest --runInBand --no-coverage --watchman=false
   ```
9. Summarize deferred work and risks.

## Output Requirements

The final response must include:

```text
Branch:
Research basis:
Changed:
Verified:
Deferred:
License/assets:
```

If no research basis was used, say that clearly and state why.

If validation was skipped or failed, include the command and exact reason.
