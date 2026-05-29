jest.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'file:///cache/',
  EncodingType: { Base64: 'base64' },
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { setSharingModuleForTest, shareMidiExport, uint8ArrayToBase64 } from '../src/features/midi-export/share-midi';
import type { MidiExportResult } from '../src/features/midi-export/export-midi';

const writeAsStringAsync = FileSystem.writeAsStringAsync as jest.MockedFunction<typeof FileSystem.writeAsStringAsync>;
const isAvailableAsync = Sharing.isAvailableAsync as jest.MockedFunction<typeof Sharing.isAvailableAsync>;
const shareAsync = Sharing.shareAsync as jest.MockedFunction<typeof Sharing.shareAsync>;

function exportFixture(bytes = new Uint8Array([0x4d, 0x54, 0x68, 0x64])): MidiExportResult {
  return {
    filename: 'vibe-to-midi-test.mid',
    bytes,
    summary: {
      filename: 'vibe-to-midi-test.mid',
      bpm: 120,
      tracks: [],
    },
  };
}

describe('uint8ArrayToBase64', () => {
  it('encodes bytes without relying on runtime btoa support', () => {
    expect(uint8ArrayToBase64(new Uint8Array([0x4d, 0x54, 0x68, 0x64]))).toBe('TVRoZA==');
    expect(uint8ArrayToBase64(new Uint8Array([0x00, 0xff, 0x10]))).toBe('AP8Q');
  });
});

describe('shareMidiExport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setSharingModuleForTest(Sharing);
    isAvailableAsync.mockResolvedValue(true);
    writeAsStringAsync.mockResolvedValue();
    shareAsync.mockResolvedValue();
  });

  afterEach(() => {
    setSharingModuleForTest(null);
  });

  it('writes MIDI bytes as base64 and opens the share sheet', async () => {
    await expect(shareMidiExport(exportFixture())).resolves.toEqual({
      uri: 'file:///cache/vibe-to-midi-test.mid',
      filename: 'vibe-to-midi-test.mid',
    });

    expect(writeAsStringAsync).toHaveBeenCalledWith(
      'file:///cache/vibe-to-midi-test.mid',
      'TVRoZA==',
      { encoding: FileSystem.EncodingType.Base64 }
    );
    expect(shareAsync).toHaveBeenCalledWith('file:///cache/vibe-to-midi-test.mid', {
      mimeType: 'audio/midi',
      UTI: 'public.midi-audio',
      dialogTitle: 'Export MIDI',
    });
  });

  it('fails before writing when sharing is unavailable', async () => {
    isAvailableAsync.mockResolvedValue(false);

    await expect(shareMidiExport(exportFixture())).rejects.toThrow('MIDI sharing is not available');
    expect(writeAsStringAsync).not.toHaveBeenCalled();
    expect(shareAsync).not.toHaveBeenCalled();
  });
});
