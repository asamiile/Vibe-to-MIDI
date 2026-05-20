# Agent Docs

These files split agent-facing instructions to reduce token usage.

Start from `../AGENTS.md`, then open only the file relevant to your task.

## Files

- `product.md`: product goal, audience, MVP behavior
- `music-direction.md`: dub techno track types, sound direction, MIDI-entry requirements
- `implementation-plan.md`: phased execution plan
- `tech-stack.md`: current Expo / React Native stack, commands, config
- `android-dev-guide.md`: Vibe-to-MIDI Android Dev Build and smoke-test notes
- `coding-standards.md`: code organization and quality rules
- `design-system.md`: app-specific UI direction
- `monetization.md`: Pro features, paid content, billing, and external payment policy
- `security-ci-release.md`: repo-specific security, license, and release guardrails
- `audio-licensing.md`: copyright-safe audio strategy
- `research-plan.md`: research policy and public repository rules
- `market-research-python.md`: Python-based market research workflow before app implementation
- `local-ai-strategy.md`: future AI without external AI APIs
- `agent-strategy.md`: installed skills policy, sub-agent usage, task splitting

## Installed Skills

Installed skills live under `skills-lock.json` and `.agents/skills/**`.
Treat `.agents/skills/**` as vendor-managed content. Do not edit or update installed skills unless the user explicitly asks.

Use installed skills for generic Expo UI, Dev Client, EAS workflow/deployment, Expo upgrade, and React Native performance/upgrade guidance. Use the local `.agents/*.md` files for Vibe-to-MIDI-specific product, music, licensing, and repo conventions.

## Common Commands

Feature research command:

```text
Run feature research for <feature name>. Use the Vibe-to-MIDI research loop. Produce a notebook, summary, and MVP recommendation.
```

## Commands

- `commands/research-feature.md`: cross-agent command for feature research before implementation
