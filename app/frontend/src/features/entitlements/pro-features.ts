export const PRO_ENTITLEMENT_ID = 'pro_access';
export const PRO_PRODUCT_ID = 'vibetomidi_pro_lifetime_v1';

export type ProFeatureId = 'midi_export' | 'generative_art_playback';

export interface ProFeature {
  id: ProFeatureId;
  label: string;
  summary: string;
  status: 'planned' | 'ready_for_billing';
}

export const PRO_FEATURES: readonly ProFeature[] = [
  {
    id: 'midi_export',
    label: 'MIDI export',
    summary: 'Export the current bass, chord, kick, noise, and timing idea for DAW editing.',
    status: 'ready_for_billing',
  },
  {
    id: 'generative_art_playback',
    label: 'Generative Art playback',
    summary: 'Show project-owned Generative Art while the selected vibe is playing.',
    status: 'ready_for_billing',
  },
];

export function isProFeatureEnabled(featureId: ProFeatureId, hasProAccess: boolean): boolean {
  if (!hasProAccess) return false;
  return PRO_FEATURES.some((feature) => feature.id === featureId);
}
