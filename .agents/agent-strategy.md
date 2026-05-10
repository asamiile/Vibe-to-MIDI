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

- market research
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
2. Research market and competitor signals.
3. Research implementation risks.
4. Scaffold Android app.
5. Add CI.
6. Build audio engine.
7. Build first vibe mapping.
8. Build temporary UI.
9. Add tests.
10. Add deployment.
11. Add release automation.


## Feature Research Command

When the user asks for autonomous research before feature development, use this command pattern:

```text
Run feature research for <feature name>.
Use the Vibe-to-MIDI research loop.
Produce a notebook, summary, and MVP recommendation.
```

Expected agent flow:

1. Read `AGENTS.md`.
2. Read `.agents/market-research-python.md`.
3. Create `research/features/<yyyy-mm-dd>_<feature-slug>/`.
4. Write the hypothesis inside `notebooks/analysis.ipynb`.
5. Gather allowed public sources.
6. Create or update CSV data.
7. Analyze with Python or Jupyter.
8. Export useful charts.
9. Write the decision summary inside `notebooks/analysis.ipynb`.
10. Recommend build, defer, narrow, or reject.

Keep notebook decision sections concise so future agents can read the result without scanning every analysis cell.
