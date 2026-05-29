import { Midi } from '@tonejs/midi';
import { getChordNotes } from '../../lib/chords';
import { buildDawStepsView } from '../vibe-map/daw-view';
import type { MusicalSuggestion, RhythmPattern } from '../vibe-map/types';

const STEPS_PER_BAR = 16;
const BASS_STEPS = [0, 4, 8, 12] as const;
const KICK_MIDI = 36;
const NOISE_MIDI = 42;

export interface MidiExportSummary {
  filename: string;
  bpm: number;
  tracks: readonly {
    name: string;
    noteCount: number;
  }[];
}

export interface MidiExportResult {
  filename: string;
  bytes: Uint8Array;
  summary: MidiExportSummary;
}

export function buildMidiExport(suggestion: MusicalSuggestion): MidiExportResult {
  const view = buildDawStepsView(suggestion);
  const midi = new Midi();
  midi.name = 'Vibe-to-MIDI';
  midi.header.setTempo(view.bpm);
  midi.header.timeSignatures = [{ ticks: 0, timeSignature: [4, 4] }];
  midi.header.update();

  const ticksPerStep = midi.header.ppq / 4;
  const chordNotes = getChordNotes(suggestion.chord.root, suggestion.chord.quality, 3);

  const bass = midi.addTrack();
  bass.name = 'Bass';
  bass.channel = 1;
  BASS_STEPS.forEach((step, index) => {
    bass.addNote({
      midi: suggestion.bassNotes[index % suggestion.bassNotes.length],
      ticks: step * ticksPerStep,
      durationTicks: Math.round(ticksPerStep * 3.5),
      velocity: 0.82,
    });
  });

  const chord = midi.addTrack();
  chord.name = 'Chord stab';
  chord.channel = 2;
  addChordPatternNotes(chord, suggestion.chordStabPattern, chordNotes, ticksPerStep);

  const kick = midi.addTrack();
  kick.name = 'Kick';
  kick.channel = 9;
  addPatternNotes(kick, suggestion.rhythmPattern, KICK_MIDI, ticksPerStep, 0.95, 1);

  const noise = midi.addTrack();
  noise.name = 'Noise';
  noise.channel = 9;
  addPatternNotes(noise, suggestion.noisePattern, NOISE_MIDI, ticksPerStep, 0.45, 0.5);

  const bytes = midi.toArray();
  const filename = buildMidiFilename(suggestion);
  const tracks = midi.tracks.map((track) => ({
    name: track.name,
    noteCount: track.notes.length,
  }));

  return {
    filename,
    bytes,
    summary: {
      filename,
      bpm: view.bpm,
      tracks,
    },
  };
}

function addChordPatternNotes(
  track: ReturnType<Midi['addTrack']>,
  pattern: RhythmPattern | undefined,
  chordNotes: readonly number[],
  ticksPerStep: number
): void {
  if (!pattern) return;
  pattern.slice(0, STEPS_PER_BAR).forEach((hit, step) => {
    if (!hit) return;
    chordNotes.forEach((midi) => {
      track.addNote({
        midi,
        ticks: step * ticksPerStep,
        durationTicks: ticksPerStep,
        velocity: 0.68,
      });
    });
  });
}

function addPatternNotes(
  track: ReturnType<Midi['addTrack']>,
  pattern: RhythmPattern | undefined,
  midi: number,
  ticksPerStep: number,
  velocity: number,
  durationSteps: number
): void {
  if (!pattern) return;
  pattern.slice(0, STEPS_PER_BAR).forEach((hit, step) => {
    if (!hit) return;
    track.addNote({
      midi,
      ticks: step * ticksPerStep,
      durationTicks: Math.max(1, Math.round(ticksPerStep * durationSteps)),
      velocity,
    });
  });
}

function buildMidiFilename(suggestion: MusicalSuggestion): string {
  const chord = `${suggestion.chord.root}-${suggestion.chord.quality}`;
  const slug = `${suggestion.vibeId}-${suggestion.scale.root}-${suggestion.scale.mode}-${chord}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `vibe-to-midi-${slug}.mid`;
}
