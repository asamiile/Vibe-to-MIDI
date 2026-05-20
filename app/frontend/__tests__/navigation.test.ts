import {
  SETTINGS_RETURN_PARAM,
  backToReturnTarget,
  withSettingsReturn,
} from '../src/lib/navigation';
import type { Router } from 'expo-router';

function createRouterMock(): Pick<Router, 'back' | 'replace'> {
  return {
    back: jest.fn(),
    replace: jest.fn(),
  };
}

describe('navigation return helpers', () => {
  it('adds the settings return target to routes opened from Settings', () => {
    expect(withSettingsReturn('/licenses')).toEqual({
      pathname: '/licenses',
      params: { returnTo: SETTINGS_RETURN_PARAM },
    });
  });

  it('returns to Settings when returnTo is settings', () => {
    const router = createRouterMock();

    backToReturnTarget(router as Router, SETTINGS_RETURN_PARAM);

    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/',
      params: { settings: '1' },
    });
    expect(router.back).not.toHaveBeenCalled();
  });

  it('returns to Settings when returnTo is an array containing settings', () => {
    const router = createRouterMock();

    backToReturnTarget(router as Router, [SETTINGS_RETURN_PARAM]);

    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/',
      params: { settings: '1' },
    });
    expect(router.back).not.toHaveBeenCalled();
  });

  it('falls back to normal back navigation without a settings return target', () => {
    const router = createRouterMock();

    backToReturnTarget(router as Router, undefined);

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });
});
