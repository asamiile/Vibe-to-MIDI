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
