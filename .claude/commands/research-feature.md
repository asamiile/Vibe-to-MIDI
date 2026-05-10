---
description: Run pre-implementation feature research and produce a notebook-based MVP recommendation.
argument-hint: [feature idea or research goal]
allowed-tools: [Read, Glob, Grep, Bash, Write, Edit, WebFetch]
---

# /research-feature

Run feature research before implementation for: $ARGUMENTS

Follow the shared Vibe-to-MIDI command spec in:

@.agents/commands/research-feature.md

Treat `$ARGUMENTS` as the feature idea or research goal. If `$ARGUMENTS` is empty, ask for the feature idea before proceeding.
