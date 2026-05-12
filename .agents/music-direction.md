# Music Direction

## Genre Focus

Vibe-to-MIDI targets **dub techno** as the primary v1 genre.

Use genre-level production traits only. Do not copy copyrighted works, artist-specific styles, track structures, loops, samples, stems, presets, brand assets, or named-artist signatures.

## Sonic Characteristics

| Element | Direction |
|---|---|
| BPM | 120-138 source ranges; preview clamps to 80-120 |
| Key / scale | minor, dorian, phrygian, occasional whole tone |
| Chords | minor, minor7, minor9, dominant7; sparse stabs |
| Bass | Sub-focused, monophonic, lowpass filtered, minimal motion |
| Kick | Sine pitch drop, lowpass filtered, long decay |
| Hat / noise | Sparse 8th or offbeat patterns, bandpass filtered |
| Chord stab | Saw chord, short envelope, lowpass, dub echo repeats |
| Space | Delay and reverb are core composition parameters, not decoration |

## Current Track Types

Each `VibeId` in `app/frontend/src/features/vibe-map/data.ts` is a Dub Techno track type with DAW-entry values for scale, chord, bass notes, kick pattern, hat/noise pattern, chord stab pattern, filters, and delay.

| VibeId | Archetype |
|---|---|
| dark | Slow, heavy, low-filtered dub |
| floating | Soft, airy, ambient-leaning dub |
| cinematic | Sparse breakdown or intro loop |
| nostalgic | Warm, detuned, tape-colored dub |
| repetitive | Four-on-floor loop chassis |
| hypnotic | Static deep loop with minimal resolution |
| wide | Spacious stereo chord field |
| warm | Rounded low end and soft stabs |
| deep | Submerged lowpass dub with minor9 color |
| rolling | Forward-moving sub phrase and tight stabs |
| groovy | Syncopated bass and offbeat chord movement |
| cavernous | Very dark room-scale dub pressure |
| dry | Shorter decay, tighter room, low reverb amount |
| underground | Hard minimal edge with darker filters |
| tense | Phrygian tension and sharper hat pattern |
| metallic | Brighter resonant edge and industrial color |
| gritty | Dirty lowpass, clipping, rough texture |
| euphoric | Brighter peak-time dub interpretation |
| unstable | Displaced rhythm and unresolved harmonic color |
| retrowave | Vintage dub echo with darker synth color |

## Learning Layer Types

Keep learning content layer-based and MIDI-actionable:

1. Kick only: kick steps and kick synth settings.
2. Kick + sub bass: bass notes, bar positions, length, and bass filter.
3. Chord stab: chord notes, stab steps, filter, envelope, and echo.
4. Hat/noise: noise steps, bandpass center, Q, and decay.
5. Full loop: all layers together.

## Audio Engine Conventions

The source of truth for playable defaults is `app/frontend/src/features/audio-engine/player.ts` under `AUDIO_PARAMS`.

Current preview layers:

- `kick`: sine pitch drop, lowpass, decay envelope.
- `bass`: sawtooth sub plus triangle octave blend.
- `noise`: inharmonic square oscillator noise through bandpass.
- `melody`: chord stab layer; named `melody` in code for compatibility, shown as `STAB` in UI.

When changing music data, keep the MIDI screen useful enough for a user to enter what they hear into a DAW: note names, MIDI numbers, step numbers, note lengths, filter cutoff/Q, envelope, and echo settings.
