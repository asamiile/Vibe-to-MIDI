import {
  DEFAULT_PLAYBACK_ARTWORK_ID,
  PLAYBACK_ARTWORKS,
  getPlaybackArtwork,
  getSelectablePlaybackArtworks,
} from '../src/features/playback-visuals/artworks';

describe('playback artworks', () => {
  it('ships a free default artwork with portrait and landscape sources', () => {
    const defaultArtwork = getPlaybackArtwork(DEFAULT_PLAYBACK_ARTWORK_ID);

    expect(defaultArtwork).toMatchObject({
      id: 'bioluminescent-network',
      label: 'Bioluminescent Network',
      shortLabel: 'BIOLUMINESCENT',
      plan: 'free',
    });
    expect(defaultArtwork.sources.landscape).toBeDefined();
    expect(defaultArtwork.sources.portrait).toBeDefined();
  });

  it('falls back to the default artwork for unknown ids', () => {
    expect(getPlaybackArtwork('missing-artwork').id).toBe(DEFAULT_PLAYBACK_ARTWORK_ID);
  });

  it('does not expose pro-only artworks to free users', () => {
    const freeArtworks = getSelectablePlaybackArtworks(false);

    expect(freeArtworks.length).toBeGreaterThan(0);
    expect(freeArtworks.every((artwork) => artwork.plan === 'free')).toBe(true);
    expect(getSelectablePlaybackArtworks(true)).toEqual(PLAYBACK_ARTWORKS);
  });
});
