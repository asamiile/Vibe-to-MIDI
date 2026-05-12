# Music Direction — Dub Techno

## Genre Focus

Vibe-to-MIDI targets **dub techno** as its primary genre for v1 content.

Dub techno sits at the intersection of techno's mechanical precision and dub's spacious, reverb-saturated atmosphere. It is minimal, hypnotic, and deep.

Key reference artists: Basic Channel, Chain Reaction, Deepchord, Echospace, Maurizio.

---

## Sonic Characteristics

| Element | Dub Techno Convention |
|---|---|
| BPM | 120–138 typical; app clamps preview to 80–120 |
| Key / Scale | minor, dorian, phrygian — rarely major |
| Chord quality | minor7, dominant7 — sustained, drone-like |
| Bass | Sub bass, long decay, monophonic, syncopated |
| Kick | Deep, muffled — lowpass filtered, slow pitch drop |
| Hi-hat | Sparse, often 8th-note offbeat; minimal |
| Pad / Chord | Heavily reverbed, long attack, slow filter sweep |
| Space | Reverb and delay are not effects — they are part of the composition |

---

## Learning Track Types

These are the canonical track types used for learning content in the app.
Each type isolates a dub techno production concept.

### 1. Kick Only
- Goal: learn the dub techno kick character
- Sound: sine pitch-drop, lowpass filtered, long decay
- Pattern: four-on-floor or sparse (beat 1 + beat 3)
- No melodic content

### 2. Kick + Sub Bass
- Goal: learn how kick and bass coexist in the low end
- Kick: as above
- Bass: sawtooth, lowpass, root note loop with occasional movement
- No chords or melody

### 3. Chord Stab (Kick + Bass + Pad)
- Goal: introduce harmonic texture
- Pad: minor7 or dominant7 chord, heavily reverbed, long attack
- Rhythm: chord hits on off-beats (beat 2, beat 4) or syncopated 16th positions
- Teaches: how dub techno creates tension through sparse harmonic events

### 4. Melodic Dub (Kick + Bass + Pad + Lead)
- Goal: introduce the dub techno lead voice
- Lead: minor pentatonic phrase, sawtooth, lowpass filter, short notes
- Pattern: sparse, leaves space — dub techno never fills the grid
- Teaches: melodic restraint, how silence is a production choice

### 5. Full Dub Loop (All Layers)
- Goal: hear all elements together
- This is what the top-level vibe preview represents

---

## Vibe-to-Track Mapping

Vibes that map naturally to dub techno contexts:

| VibeId | Dub Techno Archetype |
|---|---|
| dark | Slow, heavy dub; Basic Channel style |
| hypnotic | Deep loop, no resolution |
| underground | Hard minimal, industrial edge |
| repetitive | Four-on-floor chassis, loop-based |
| floating | Ambient dub, Deepchord style |
| groovy | Syncopated bass, funkier dub |
| cinematic | Sparse, dramatic — intro or breakdown |

---

## Audio Engine Conventions

All values are in `player.ts` under `AUDIO_PARAMS`.

- **BPM clamp**: 80–120 (preview stays musical even for faster vibes)
- **Kick**: sine, 150 Hz → 35 Hz over 120 ms, lowpass 200 Hz Q=1.5, decay 400 ms
- **Bass**: sawtooth root + triangle octave above at 28% blend
- **Melody**: sawtooth, attack 15 ms, decay 80 ms, sustain 55%, gain 50% of base

---

## Future Layers (Planned)

| Layer | Sound Design Target |
|---|---|
| Hi-hat | White noise, bandpass 8–12 kHz, short decay |
| Pad | Multiple detuned saws, lowpass sweep, long reverb |
| Chord stab | Minor7 voicing, short envelope, heavy reverb tail |
| Delay echo | Single-repeat delay (dub echo), quarter-note timing |
