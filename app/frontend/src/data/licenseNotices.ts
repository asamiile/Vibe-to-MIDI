export interface LicenseNotice {
  packageName: string;
  license: string;
  repository: string;
  copyright?: string;
  licenseText?: string;
}

export interface AssetLicenseNotice {
  name: string;
  kind: 'audio' | 'midi' | 'image' | 'video' | 'font' | 'other';
  source: string;
  creator: string;
  license: string;
  attributionRequired: boolean;
  redistributionAllowed: boolean;
  dateChecked: string;
}

export const AUDIO_NOTICE =
  'Preview audio is generated at runtime with oscillator synthesis. No third-party audio files, loops, stems, samples, or MIDI files are bundled in the current app.';

export const BUNDLED_ASSET_LICENSE_NOTICES: readonly AssetLicenseNotice[] = [
  {
    name: 'free_bioluminescent-network_landscape.mp4',
    kind: 'video',
    source: 'app/frontend/assets/visuals/free_bioluminescent-network_landscape.mp4',
    creator: 'Project owner',
    license: 'Original app asset',
    attributionRequired: false,
    redistributionAllowed: true,
    dateChecked: '2026-05-22',
  },
  {
    name: 'free_bioluminescent-network_portrait.mp4',
    kind: 'video',
    source: 'app/frontend/assets/visuals/free_bioluminescent-network_portrait.mp4',
    creator: 'Project owner',
    license: 'Original app asset',
    attributionRequired: false,
    redistributionAllowed: true,
    dateChecked: '2026-05-22',
  },
  {
    name: 'pro_cybernetic-flora-corruption_landscape.mp4',
    kind: 'video',
    source: 'app/frontend/assets/visuals/pro_cybernetic-flora-corruption_landscape.mp4',
    creator: 'Project owner',
    license: 'Original app asset',
    attributionRequired: false,
    redistributionAllowed: true,
    dateChecked: '2026-05-29',
  },
  {
    name: 'pro_cybernetic-flora-corruption_portrait.mp4',
    kind: 'video',
    source: 'app/frontend/assets/visuals/pro_cybernetic-flora-corruption_portrait.mp4',
    creator: 'Project owner',
    license: 'Original app asset',
    attributionRequired: false,
    redistributionAllowed: true,
    dateChecked: '2026-05-29',
  },
  {
    name: 'pro_quantum-interference-glitch_landscape.mp4',
    kind: 'video',
    source: 'app/frontend/assets/visuals/pro_quantum-interference-glitch_landscape.mp4',
    creator: 'Project owner',
    license: 'Original app asset',
    attributionRequired: false,
    redistributionAllowed: true,
    dateChecked: '2026-05-29',
  },
  {
    name: 'pro_quantum-interference-glitch_portrait.mp4',
    kind: 'video',
    source: 'app/frontend/assets/visuals/pro_quantum-interference-glitch_portrait.mp4',
    creator: 'Project owner',
    license: 'Original app asset',
    attributionRequired: false,
    redistributionAllowed: true,
    dateChecked: '2026-05-29',
  },
  {
    name: 'pro_quantum-orbital-electron-cloud_landscape.mp4',
    kind: 'video',
    source: 'app/frontend/assets/visuals/pro_quantum-orbital-electron-cloud_landscape.mp4',
    creator: 'Project owner',
    license: 'Original app asset',
    attributionRequired: false,
    redistributionAllowed: true,
    dateChecked: '2026-05-29',
  },
  {
    name: 'pro_quantum-orbital-electron-cloud_portrait.mp4',
    kind: 'video',
    source: 'app/frontend/assets/visuals/pro_quantum-orbital-electron-cloud_portrait.mp4',
    creator: 'Project owner',
    license: 'Original app asset',
    attributionRequired: false,
    redistributionAllowed: true,
    dateChecked: '2026-05-29',
  },
];

export const RUNTIME_LICENSE_NOTICES: readonly LicenseNotice[] = [
  { packageName: '@tonejs/midi', license: 'MIT', repository: 'https://github.com/Tonejs/Midi' },
  { packageName: 'expo', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'expo-constants', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'expo-dev-client', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'expo-file-system', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'expo-linking', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'expo-router', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'expo-sharing', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'expo-status-bar', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'expo-video', license: 'MIT', repository: 'https://github.com/expo/expo' },
  { packageName: 'nativewind', license: 'MIT', repository: 'https://github.com/marklawlor/nativewind' },
  { packageName: 'react', license: 'MIT', repository: 'https://github.com/facebook/react' },
  { packageName: 'react-native', license: 'MIT', repository: 'https://github.com/facebook/react-native' },
  { packageName: 'react-native-audio-api', license: 'MIT', repository: 'https://github.com/software-mansion/react-native-audio-api' },
  { packageName: 'react-native-reanimated', license: 'MIT', repository: 'https://github.com/software-mansion/react-native-reanimated' },
  { packageName: 'react-native-safe-area-context', license: 'MIT', repository: 'https://github.com/AppAndFlow/react-native-safe-area-context' },
  { packageName: 'react-native-screens', license: 'MIT', repository: 'https://github.com/software-mansion/react-native-screens' },
  { packageName: 'react-native-worklets', license: 'MIT', repository: 'https://github.com/software-mansion/react-native-reanimated' },
  { packageName: 'react-native-worklets-core', license: 'MIT', repository: 'https://github.com/margelo/react-native-worklets-core' },
  { packageName: 'tailwindcss', license: 'MIT', repository: 'https://github.com/tailwindlabs/tailwindcss' },
  { packageName: 'zustand', license: 'MIT', repository: 'https://github.com/pmndrs/zustand' },
];
