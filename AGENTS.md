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

## Read By Task

- Product direction: `.agents/product.md`
- Music direction: `.agents/music-direction.md`
- Implementation plan: `.agents/implementation-plan.md`
- **Tech stack (libraries, versions, config)**: `.agents/tech-stack.md`
- **Android dev setup and build commands**: `.agents/android-dev-guide.md`
- Coding standards: `.agents/coding-standards.md`
- Design policy: `.agents/design-system.md`
- Monetization and Pro feature policy: `.agents/monetization.md`
- Security, CI, release: `.agents/security-ci-release.md`
- Audio licensing: `.agents/audio-licensing.md`
- Research policy: `.agents/research-plan.md`
- Local AI strategy: `.agents/local-ai-strategy.md`
- Agent workflow, installed skills policy: `.agents/agent-strategy.md`

## Non-Negotiables

- Do not commit secrets.
- Do not add copyrighted audio, loops, stems, or sample-pack sounds unless redistribution inside this app is explicitly allowed and documented.
- Prefer generated synthesis over bundled samples.
- Build the first app for Android.
- Use React Native as much as practical.
- Keep AI optional and modular.
- Keep temporary UI replaceable.
- Avoid large context reads. Open only the `.agents/` file relevant to the current task.
