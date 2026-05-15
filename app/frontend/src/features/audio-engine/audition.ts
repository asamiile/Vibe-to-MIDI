import { getAudioContext } from './adapter';
import { noteFreq } from '../../lib/notes';
import type { MusicalSuggestion } from '../vibe-map/types';
import { AUDIO_PARAMS } from './constants';

type AudioCtx = NonNullable<Awaited<ReturnType<typeof getAudioContext>>>;
type Oscillator = ReturnType<AudioCtx['createOscillator']>;
type Gain = ReturnType<AudioCtx['createGain']>;

interface AuditionNode {
  oscillator: Oscillator;
  gain: Gain;
}

export interface AuditionHandle {
  stop: () => void;
}

interface AuditionOptions {
  gain?: number;
  duration?: number;
  filter?: { cutoff: number; q: number };
}

interface NoteAuditionOptions extends AuditionOptions {
  tone?: 'stab' | 'bass';
}

const NO_OP_HANDLE: AuditionHandle = { stop: () => {} };

function scheduleFilteredOscillator(
  ctx: AudioCtx,
  midi: number,
  startTime: number,
  duration: number,
  gainValue: number,
  oscillatorType: OscillatorType,
  filter: { cutoff: number; q: number },
  nodes: AuditionNode[]
): void {
  const osc = ctx.createOscillator();
  const biquad = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = oscillatorType;
  osc.frequency.value = noteFreq(midi);

  biquad.type = 'lowpass';
  biquad.frequency.value = filter.cutoff;
  biquad.Q.value = filter.q;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.006);
  gain.gain.linearRampToValueAtTime(gainValue * 0.35, startTime + Math.min(0.18, duration * 0.6));
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(biquad);
  biquad.connect(gain);
  gain.connect(ctx.destination);
  nodes.push({ oscillator: osc, gain });

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

function stopNodes(ctx: AudioCtx, nodes: AuditionNode[]): void {
  const t = ctx.currentTime;
  nodes.splice(0).forEach(({ oscillator, gain }) => {
    gain.gain.cancelScheduledValues?.(t);
    gain.gain.setValueAtTime(0, t);
    try { oscillator.stop(t); } catch {}
    oscillator.disconnect?.();
    gain.disconnect?.();
  });
}

export async function playAuditionNote(
  midi: number,
  suggestion: MusicalSuggestion,
  options: NoteAuditionOptions = {}
): Promise<AuditionHandle> {
  const ctxOrNull = await getAudioContext();
  if (!ctxOrNull) return NO_OP_HANDLE;
  const ctx: AudioCtx = ctxOrNull;

  const tone = options.tone ?? 'stab';
  const filter = options.filter ?? (
    tone === 'bass'
      ? suggestion.bassFilter ?? { cutoff: AUDIO_PARAMS.bass.filterFreq, q: AUDIO_PARAMS.bass.filterQ }
      : suggestion.chordStabFilter ?? { cutoff: AUDIO_PARAMS.melody.filterFreq, q: AUDIO_PARAMS.melody.filterQ }
  );
  const duration = options.duration ?? (tone === 'bass' ? 0.55 : 0.42);
  const gainValue = options.gain ?? (tone === 'bass' ? 0.22 : 0.18);
  const nodes: AuditionNode[] = [];
  const now = ctx.currentTime + 0.02;

  scheduleFilteredOscillator(ctx, midi, now, duration, gainValue, tone === 'bass' ? 'sawtooth' : 'sawtooth', filter, nodes);
  if (tone === 'bass') {
    scheduleFilteredOscillator(ctx, midi + 12, now, duration, gainValue * AUDIO_PARAMS.bass.octaveBlend, 'triangle', filter, nodes);
  }

  return { stop: () => stopNodes(ctx, nodes) };
}

export async function playAuditionChord(
  midiNotes: readonly number[],
  suggestion: MusicalSuggestion,
  options: AuditionOptions = {}
): Promise<AuditionHandle> {
  const ctxOrNull = await getAudioContext();
  if (!ctxOrNull) return NO_OP_HANDLE;
  const ctx: AudioCtx = ctxOrNull;

  const filter = options.filter ?? suggestion.chordStabFilter ?? {
    cutoff: AUDIO_PARAMS.melody.filterFreq,
    q: AUDIO_PARAMS.melody.filterQ,
  };
  const duration = options.duration ?? 0.48;
  const gainValue = options.gain ?? 0.26;
  const nodes: AuditionNode[] = [];
  const now = ctx.currentTime + 0.02;
  const perNoteGain = gainValue / Math.max(midiNotes.length, 1);

  midiNotes.forEach((midi, index) => {
    scheduleFilteredOscillator(ctx, midi, now, duration, perNoteGain, 'sawtooth', filter, nodes);
    if (index === 0) {
      scheduleFilteredOscillator(ctx, midi - 12, now, duration, gainValue * 0.18, 'sawtooth', filter, nodes);
    }
  });

  return { stop: () => stopNodes(ctx, nodes) };
}
