import Constants from 'expo-constants';

interface ExpoConfigLike {
  version?: string;
  slug?: string;
  android?: {
    package?: string;
  };
  extra?: {
    eas?: {
      projectId?: string;
    };
  };
}

interface ConstantsLike {
  expoConfig?: ExpoConfigLike | null;
  nativeApplicationVersion?: string | null;
  nativeBuildVersion?: string | null;
  executionEnvironment?: string | null;
}

export interface AppRuntimeMetadata {
  version: string;
  nativeVersion: string;
  nativeBuild: string;
  slug: string;
  packageName: string;
  easProjectId: string;
  executionEnvironment: string;
}

const EMPTY_VALUE = '-';

export function buildAppRuntimeMetadata(constants: ConstantsLike): AppRuntimeMetadata {
  const config = constants.expoConfig;
  return {
    version: config?.version ?? constants.nativeApplicationVersion ?? EMPTY_VALUE,
    nativeVersion: constants.nativeApplicationVersion ?? config?.version ?? EMPTY_VALUE,
    nativeBuild: constants.nativeBuildVersion ?? EMPTY_VALUE,
    slug: config?.slug ?? EMPTY_VALUE,
    packageName: config?.android?.package ?? EMPTY_VALUE,
    easProjectId: config?.extra?.eas?.projectId ?? EMPTY_VALUE,
    executionEnvironment: constants.executionEnvironment ?? EMPTY_VALUE,
  };
}

export function getAppRuntimeMetadata(): AppRuntimeMetadata {
  return buildAppRuntimeMetadata(Constants);
}
