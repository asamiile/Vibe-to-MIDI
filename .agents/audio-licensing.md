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
