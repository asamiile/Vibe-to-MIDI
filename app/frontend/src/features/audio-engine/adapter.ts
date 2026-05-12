import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// react-native-audio-api uses native Oboe on Android.
// Unavailable in Expo Go (storeClient) and web — skip require entirely to avoid AudioApiError.
let _AudioContext: typeof import('react-native-audio-api').AudioContext | null = null;

function loadAudioContext() {
  if (_AudioContext) return _AudioContext;
  if (Platform.OS === 'web') return null;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _AudioContext = require('react-native-audio-api').AudioContext;
  } catch {
    // native module not available
  }
  return _AudioContext;
}

let _context: InstanceType<typeof import('react-native-audio-api').AudioContext> | null = null;

export async function getAudioContext() {
  const Ctx = loadAudioContext();
  if (!Ctx) return null;
  if (!_context || _context.state === 'closed') {
    _context = new Ctx();
  }
  if (_context.state === 'suspended') {
    await _context.resume();
  }
  return _context;
}

export function closeAudioContext(): void {
  if (_context) {
    _context.close();
    _context = null;
  }
}

export function isAudioAvailable(): boolean {
  return loadAudioContext() !== null;
}
