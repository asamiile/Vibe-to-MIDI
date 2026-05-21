import { Linking } from 'react-native';

const ALLOWED_EXTERNAL_ORIGINS = new Set([
  'https://asamiile.github.io',
]);

export const PRIVACY_POLICY_URL = 'https://asamiile.github.io/Vibe-to-MIDI/privacy-policy.html';

export async function openAllowedExternalUrl(url: string): Promise<boolean> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:' || !ALLOWED_EXTERNAL_ORIGINS.has(parsed.origin)) {
    return false;
  }

  const canOpen = await Linking.canOpenURL(parsed.href);
  if (!canOpen) return false;
  await Linking.openURL(parsed.href);
  return true;
}
