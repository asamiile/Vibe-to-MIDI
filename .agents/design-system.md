# Design System Policy

## Status

The first design is temporary.

The app may later be redesigned, potentially with Claude Design. Build the MVP so the UI can be replaced without rewriting the product logic.

## Component Direction

Use shadcn/ui-compatible ideas where useful, but adapt them to React Native.

Reasons:

- easy replacement
- predictable structure
- accessible primitives
- lower custom UI overhead

Do not over-invest in final branding during MVP.

If direct shadcn/ui usage is not practical in React Native, keep the same spirit:

- composable primitives
- clear variants
- design tokens
- replaceable component wrappers
- minimal coupling between UI and product logic

## Experience Direction

The interface should feel like a playable visual instrument, not a text-heavy course.

## Learning UX Rule

Do not introduce theory before the user creates or hears something.

Preferred interaction order:

1. User selects or manipulates a vibe.
2. App generates sound and visual response.
3. App shows DAW-ready choices.
4. App optionally reveals the theory behind the result.

Avoid lesson-first UI. The user should feel like they are making music first, then learning from the result.

Prioritize:

- low explanation
- strong sound feedback
- clear interaction
- artful visual response
- DAW-useful output

Avoid:

- long tutorials
- marketing landing pages
- decorative UI that hides the tool
- visual complexity that makes the musical output unclear

## Try This Rule

For beginner-facing learning UI, prefer actionable "Try this" guidance over abstract explanation.

Every learning explanation should answer:

- what to place in the DAW
- where to place it in the clip or grid
- what to change next to hear a difference

Good pattern:

```text
Try this:
Keep only steps 1 and 9. This creates space.
Change C2 back to A1 if you want it more hypnotic.
Move C2 to D2 if you want more tension.
```

Use theory labels such as scale, mode, and chord after the practical action, not before it. The user should be able to follow the instruction in Ableton or another DAW without understanding the theory term first.

## Layout Direction

Initial screen:

- left: vibe tags
- center: playable visual surface
- right: DAW-ready suggestions

The right panel should expose practical output:

- scale
- chord
- bass
- rhythm
- sound design
- MIDI notes

## Future Replacement

Keep design tokens, component wrappers, and feature logic separate so a later design pass can replace presentation without changing musical behavior.
