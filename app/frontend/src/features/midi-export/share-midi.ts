import * as FileSystem from 'expo-file-system/legacy';
import type { MidiExportResult } from './export-midi';

const MIDI_MIME_TYPE = 'audio/midi';
const MIDI_UTI = 'public.midi-audio';
let sharingModuleOverride: typeof import('expo-sharing') | null = null;

export interface ShareMidiResult {
  uri: string;
  filename: string;
}

export async function shareMidiExport(exported: MidiExportResult): Promise<ShareMidiResult> {
  const Sharing = await importSharingModule();
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new Error('MIDI sharing is not available on this device.');
  }

  const directory = FileSystem.cacheDirectory;
  if (!directory) {
    throw new Error('No writable cache directory is available for MIDI export.');
  }

  const uri = `${directory}${exported.filename}`;
  await FileSystem.writeAsStringAsync(uri, uint8ArrayToBase64(exported.bytes), {
    encoding: FileSystem.EncodingType.Base64,
  });
  await Sharing.shareAsync(uri, {
    mimeType: MIDI_MIME_TYPE,
    UTI: MIDI_UTI,
    dialogTitle: 'Export MIDI',
  });

  return {
    uri,
    filename: exported.filename,
  };
}

async function importSharingModule(): Promise<typeof import('expo-sharing')> {
  if (sharingModuleOverride) {
    return sharingModuleOverride;
  }

  try {
    return await import('expo-sharing');
  } catch (error) {
    throw new Error(
      'MIDI sharing is not available in this app build. Rebuild the Android development client after installing expo-sharing.',
      { cause: error }
    );
  }
}

export function setSharingModuleForTest(module: typeof import('expo-sharing') | null): void {
  sharingModuleOverride = module;
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = bytes[index + 1] ?? 0;
    const third = bytes[index + 2] ?? 0;
    const triplet = (first << 16) | (second << 8) | third;

    output += alphabet[(triplet >> 18) & 63];
    output += alphabet[(triplet >> 12) & 63];
    output += index + 1 < bytes.length ? alphabet[(triplet >> 6) & 63] : '=';
    output += index + 2 < bytes.length ? alphabet[triplet & 63] : '=';
  }
  return output;
}
