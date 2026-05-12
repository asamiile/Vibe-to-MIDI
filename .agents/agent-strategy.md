# Agent Strategy

## Context Use

Do not read every `.agents/` file by default.

Read:

1. `../AGENTS.md`
2. the task-specific `.agents/*.md` file
3. source files directly related to the change

Summarize findings instead of pasting long excerpts.

## Installed Skills Policy

- Treat `.agents/skills/**` as vendor-managed content.
- Do not edit installed skill files directly.
- Do not run `npx skills update` or reinstall skills unless the user explicitly asks.
- Keep `skills-lock.json` committed and treat it as the source of truth for installed skill versions.
- If a skill needs local guidance, add repo-specific notes in `.agents/agent-strategy.md` or another `.agents/*.md` file instead of patching the skill.

## Skill Routing

Use installed skills for generic guidance:

- Expo Dev Client / deployment / EAS workflows / Expo upgrades: `.agents/skills/**` from Expo.
- React Native performance and upgrades: installed Callstack skills.

Use local `.agents/*.md` files for Vibe-to-MIDI-specific product, music, licensing, and repo conventions.

## Feature Implementation License Workflow

When a change adds or changes any runtime dependency, generated/bundled audio, MIDI file, image, font, binary asset, sample, preset, loop, stem, or reference media:

1. Verify commercial app distribution and redistribution rights where relevant.
2. Update `app/frontend/src/data/licenseNotices.ts`.
3. For media assets, record source URL, creator, license, attribution requirement, redistribution permission, and date checked.
4. If rights are unclear, do not commit the asset.

If no license-relevant item was added, mention that in the final response.

## Sub-Agent Policy

Use sub-agents only for parallel, well-scoped tasks.

Good candidates:

- research audio licensing
- research local AI options
- implement isolated audio, MIDI, CI, or release work
- review security risks

Avoid:

- overlapping file ownership
- vague product direction tasks
- dependency additions without justification
- multiple agents editing the same module

## Feature Research Command

When the user asks for autonomous research before feature development:

```text
Run feature research for <feature name>.
Use the Vibe-to-MIDI research loop.
Produce a notebook, summary, and MVP recommendation.
```

Expected flow:

1. Read `AGENTS.md`.
2. Read `.agents/market-research-python.md`.
3. Create `research/features/<yyyy-mm-dd>_<feature-slug>/`.
4. Write a concise notebook and recommendation.
