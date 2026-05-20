import { useEffect, useRef } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import type { Href, Router } from 'expo-router';

export const SETTINGS_RETURN_PARAM = 'settings';

export function withSettingsReturn(pathname: string): Href {
  return {
    pathname,
    params: { returnTo: SETTINGS_RETURN_PARAM },
  } as Href;
}

export function backToReturnTarget(router: Router, returnTo?: string | string[]): void {
  if (isSettingsReturnTarget(returnTo)) {
    router.replace({ pathname: '/', params: { settings: '1' } });
    return;
  }
  router.back();
}

export function useSettingsReturnOnStackBack(returnTo?: string | string[]): void {
  const navigation = useNavigation();
  const router = useRouter();
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (!isSettingsReturnTarget(returnTo)) return undefined;
    return navigation.addListener('beforeRemove', (event) => {
      if (redirectingRef.current) return;
      redirectingRef.current = true;
      event.preventDefault();
      requestAnimationFrame(() => {
        router.replace({ pathname: '/', params: { settings: '1' } });
      });
    });
  }, [navigation, returnTo, router]);
}

function isSettingsReturnTarget(returnTo?: string | string[]): boolean {
  const target = Array.isArray(returnTo) ? returnTo[0] : returnTo;
  return target === SETTINGS_RETURN_PARAM;
}
