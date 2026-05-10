// Jest mock for react-native-audio-api (native module, not available in Node)
export class AudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 440 },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    };
  }
  createGain() {
    return {
      gain: {
        value: 1,
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
      },
      connect: jest.fn(),
    };
  }
  resume() {}
  close() {}
}
