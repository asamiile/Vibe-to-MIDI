# Agent Strategy

## Goal

Prepare the repository so agents can work safely, consistently, and with low context usage.

## Token Usage

Do not read every `.agents/` file by default.

Read:

- `../AGENTS.md` first
- only the task-specific file after that
- source files directly related to the change

Summarize findings instead of pasting long excerpts.

## Useful Agent Capabilities

Future agents should be able to handle:

- product research
- audio synthesis implementation
- MIDI generation
- UI implementation
- visual interaction
- CI and release automation
- security review
- local ML feasibility research
- browser visual QA

## Skills To Expand Later

Potential future skills:

- Web Audio / Tone.js
- MIDI file generation
- shadcn/ui implementation
- GitHub Actions release automation
- audio licensing review
- local ML benchmarking
- browser-based visual QA

## Sub-Agent Policy

Use sub-agents only for parallel, well-scoped tasks.

Good candidates:

- research audio licensing
- research local AI options
- implement audio engine
- implement MIDI export
- implement CI workflow
- review security risks

Avoid:

- overlapping file ownership
- vague product direction tasks
- dependency additions without justification
- multiple agents editing the same module

## Initial Work Order

1. Add agent docs.
2. Research implementation risks.
3. Scaffold web app.
4. Add CI.
5. Build audio engine.
6. Build first vibe mapping.
7. Build temporary UI.
8. Add tests.
9. Add deployment.
10. Add release automation.
