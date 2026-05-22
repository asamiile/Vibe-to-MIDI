import { buildAppRuntimeMetadata } from '../src/lib/app-metadata';

describe('app runtime metadata', () => {
  it('uses Expo config and native constants for support diagnostics', () => {
    expect(buildAppRuntimeMetadata({
      nativeApplicationVersion: '0.1.0-native',
      nativeBuildVersion: '42',
      executionEnvironment: 'standalone',
      expoConfig: {
        version: '0.1.0',
        slug: 'vibe-to-midi',
        android: { package: 'com.asamiile.vibetomidi' },
        extra: { eas: { projectId: 'project-id' } },
      },
    })).toEqual({
      version: '0.1.0',
      nativeVersion: '0.1.0-native',
      nativeBuild: '42',
      slug: 'vibe-to-midi',
      packageName: 'com.asamiile.vibetomidi',
      easProjectId: 'project-id',
      executionEnvironment: 'standalone',
    });
  });

  it('falls back to placeholders when runtime fields are unavailable', () => {
    expect(buildAppRuntimeMetadata({})).toEqual({
      version: '-',
      nativeVersion: '-',
      nativeBuild: '-',
      slug: '-',
      packageName: '-',
      easProjectId: '-',
      executionEnvironment: '-',
    });
  });
});
