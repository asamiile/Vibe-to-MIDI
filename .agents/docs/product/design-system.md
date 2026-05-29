# Design Direction

Use installed Expo UI skills for generic React Native / Expo UI implementation patterns. This file keeps Vibe-to-MIDI-specific UX rules.

## Product Feel

The interface should feel like a playable music tool, not a course or marketing page.

Prioritize:

- listening first
- low explanation
- DAW-ready output
- clear layer controls
- musical feedback over decoration

Avoid:

- lesson-first flows
- long tutorials
- decorative UI that hides the musical output
- visual complexity that makes note, rhythm, or sound choices harder to read

## Core Flow

1. Tap the central TOP play button.
2. Hear a generated dub techno loop built from random sound parts and a random chord.
3. Open MIDI for practical DAW-entry values.
4. Open Learn only when the user wants explanation.

The first response should be sound, not theory. The TOP screen should not show a song list, track catalog, or long selectable vibe grid for the current MVP. Keep the TOP screen focused on a single play action, with MIDI, Learn, and Settings as restrained utility controls.

## MIDI Screen Rule

The MIDI screen should answer:

- what notes to enter
- what MIDI numbers those notes are
- which steps to place them on
- how long notes should last
- which filter, envelope, and echo values shape the sound

Remove copy that does not help the user recreate the heard loop in a DAW.

## Learning Rule

Beginner explanations should be actionable:

```text
Try this:
Keep only steps 1 and 9.
Move C2 to D2 if you want more tension.
```

Use theory labels after practical actions, not before.
