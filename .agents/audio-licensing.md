# Audio Licensing Strategy

## Principle

MVP audio should be copyright-safe by default.

Prefer:

1. generated synthesis
2. self-created samples
3. CC0 assets with recorded source metadata

Avoid commercial samples in the app unless the license explicitly allows redistribution inside an application.

## MVP Audio

Use Tone.js or Web Audio API for:

- sine sub bass
- filtered saw bass
- soft pad
- metallic bell
- noise texture
- simple kick
- closed hat
- open hat
- click percussion
- short stab

Generated synthesis lowers licensing risk and keeps the app lightweight.

## Generated Noise

For richer hiss, vinyl floor, tape noise, or percussion noise, prefer generated noise buffers over bundled samples.

Allowed direction:

- create white / pink / brown noise from random samples at runtime or build time
- play generated buffers through `AudioBufferSourceNode`
- filter generated noise through bandpass / lowpass / highpass nodes

Do not add third-party noise samples unless redistribution rights inside a commercial app are explicit and documented.

## Sample Rules

Do not commit:

- copyrighted tracks
- reference track excerpts
- ripped loops
- commercial sample-pack sounds
- artist stems
- unclear-license audio

If adding an audio file, also add license metadata:

- source URL
- creator
- license
- commercial-use permission
- redistribution permission
- attribution requirement
- date checked

## Bundled Visual Assets

For playback-loop videos and other bundled visual media, keep source files out of
Git and commit only app-ready compressed assets.

Use this naming pattern:

```text
{plan}_{art-work}_{orientation}.mp4
```

Allowed `plan` values:

- `free` for assets available to every user
- `pro` for paid-plan assets gated by entitlement checks

Use lowercase kebab-case for `art-work`. Allowed `orientation` values:

- `portrait` for vertical phone-first videos, usually 720x1280
- `landscape` for horizontal videos, usually 1280x720

Example names:

```text
free_bioluminescent-network_portrait.mp4
free_bioluminescent-network_landscape.mp4
pro_deep-grid_portrait.mp4
pro_deep-grid_landscape.mp4
```

If adding a Pro visual, wire selection through entitlement-aware metadata rather
than hard-coding a paid asset as the default playback visual.

## Paid Assets

Paid tools can be useful for producing original sounds, but their output must be reviewed.

Be careful with:

- sample packs
- presets that include samples
- drum machine sample libraries
- paid loop libraries

Many licenses allow use in music releases but do not allow redistribution of the raw sound inside an app.

## References

Agents should verify current license terms before recommending or adding paid assets.

Use public summaries only in repo docs. Do not copy full license documents unless redistribution is permitted.
