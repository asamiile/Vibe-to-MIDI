# Coding Standards

## General

- Use TypeScript.
- Prefer React Native for the first implementation.
- Prefer small modules with clear ownership.
- Keep UI, music mapping, audio playback, and visual rendering separate.
- Avoid adding dependencies without a reason.
- Keep files named by responsibility, not by implementation novelty.
- Use ASCII unless the existing file clearly uses another character set.

## Suggested Source Structure

```text
src/
  app/
  components/
  features/
    vibe-map/
    audio-engine/
    pattern-editor/
    midi-export/
    visuals/
  lib/
  data/
  styles/
```

## Separation Rules

Music mapping data should not live inside UI components.

Audio playback should not depend on React component state directly. Use a small adapter layer.

Visual rendering should consume normalized musical state rather than derive theory rules itself.

## Testing

Add tests for:

- vibe-to-music mapping
- note and scale utilities
- MIDI generation
- deterministic pattern generation

UI tests can come later, after the MVP interaction stabilizes.

## Dependencies

Prefer:

- stable, maintained packages
- packages with compatible licenses
- libraries that work well in Android React Native environments

Avoid:

- large audio asset packages
- unclear-license packages
- dependencies that require server infrastructure for MVP

## Documentation

When behavior is non-obvious, add concise docs near the code or update `.agents/`.

Do not paste long research excerpts into source files.
