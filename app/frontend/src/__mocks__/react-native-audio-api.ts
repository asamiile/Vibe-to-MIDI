// Jest mock for react-native-audio-api (native module, not available in Node)
export class AudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      type: 'sine' as OscillatorType,
      frequency: { value: 440 },
      connect: jest.fn(),
      disconnect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      setPeriodicWave: jest.fn(),
    };
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 440 },
      Q: { value: 1 },
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  createGain() {
    return {
      gain: {
        value: 1,
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
        cancelScheduledValues: jest.fn(),
      },
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  createPeriodicWave(_real: Float32Array, _imag: Float32Array) {
    return {};
  }
  createDelay(_maxDelay?: number) {
    return {
      delayTime: { value: 0 },
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  createWaveShaper() {
    return {
      curve: null as Float32Array | null,
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  createStereoPanner() {
    return {
      pan: { value: 0 },
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  resume() {}
  close() {}
}
