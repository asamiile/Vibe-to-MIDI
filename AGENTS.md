# Agent Entry Point

This repository is for **Vibe-to-MIDI**, an Android-first app that helps users turn a desired mood, motion, or emotion into DAW-ready musical choices.

Keep this file short. Read only the `.agents/` files needed for your task.

## Core Goal

Solve this first user problem:

> I have an image, vibe, movement, or emotion in my head, but I do not know which notes, scales, chords, rhythms, or sounds to choose in my DAW.

The first product should convert vibe inputs into:

- scale candidates
- chord candidates
- bass notes
- rhythm patterns
- sound design hints
- MIDI-ready note suggestions

Target context:

- dub techno
- ambient / minimal electronic music
- DAW-ready learning loops

Target languages, in priority order:

1. English
2. Japanese

Reference context includes underground club, live electronic performance, and scenic electronic music culture, but do not copy copyrighted works, artist styles, tracks, loops, or brand assets.

## Agent Docs

Use `.agents/README.md` as the index for agent-facing docs.

Read only the files relevant to the task:

- Next work / remaining scope: `.agents/roadmap.md`
- Product or music decisions: `.agents/product.md`, `.agents/music-direction.md`
- Implementation, stack, and Android commands: `.agents/implementation-plan.md`, `.agents/tech-stack.md`, `.agents/android-dev-guide.md`
- Code, design, entitlement, release, or licensing rules: `.agents/coding-standards.md`, `.agents/design-system.md`, `.agents/entitlements.md`, `.agents/security-ci-release.md`, `.agents/audio-licensing.md`
- Research or feature delivery workflow: `.agents/research-plan.md`, `.agents/feature-delivery-flow.md`
- Agent workflow and installed skills policy: `.agents/agent-strategy.md`

Do not treat `.agents/skills/**` as project-authored roadmap docs. Those files
come from installed skills managed by `skills-lock.json`; use them only when a
matching skill is triggered.

## Non-Negotiables

- Do not commit secrets.
- Do not add copyrighted audio, loops, stems, or sample-pack sounds unless redistribution inside this app is explicitly allowed and documented.
- Prefer generated synthesis over bundled samples.
- Build the first app for Android.
- Use React Native as much as practical.
- Keep AI optional and modular.
- Keep temporary UI replaceable.
- Avoid large context reads. Open only the `.agents/` file relevant to the current task.
