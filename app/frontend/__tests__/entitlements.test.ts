import {
  PRO_ENTITLEMENT_ID,
  PRO_FEATURES,
  PRO_PRODUCT_ID,
  isProFeatureEnabled,
} from '../src/features/entitlements/pro-features';

describe('Pro entitlement configuration', () => {
  it('uses stable product and entitlement ids', () => {
    expect(PRO_ENTITLEMENT_ID).toBe('pro_access');
    expect(PRO_PRODUCT_ID).toBe('vibetomidi_pro_lifetime_v1');
  });

  it('gates Pro features behind Pro access', () => {
    expect(PRO_FEATURES.map((feature) => feature.id)).toEqual([
      'midi_export',
      'generative_art_playback',
    ]);
    expect(isProFeatureEnabled('midi_export', false)).toBe(false);
    expect(isProFeatureEnabled('midi_export', true)).toBe(true);
    expect(isProFeatureEnabled('generative_art_playback', true)).toBe(true);
  });
});
