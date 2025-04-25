import { useState, useEffect, useCallback, useMemo } from 'react';

export enum Screen {
  _4K = 9,
  DESKTOP = 8,
  LAPTOP_L = 7,
  LAPTOP_M = 6,
  LAPTOP = 5,
  TABLET = 4,
  TABLET_S = 3,
  MOBILE_L = 2,
  MOBILE_M = 1,
  MOBILE_S = 0,
}

export enum BreakPoint {
  _4K = 2560,
  DESKTOP = 1800,
  LAPTOP_L = 1440,
  LAPTOP_M = 1240,
  LAPTOP = 1024,
  TABLET = 768,
  TABLET_S = 596,
  MOBILE_L = 425,
  MOBILE_M = 375,
  MOBILE_S = 320,
}

export function useScreen(): Screen | undefined {
  const getScreen = useCallback((): Screen | undefined => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const { innerWidth } = window;

    if (innerWidth <= BreakPoint.MOBILE_S) {
      return Screen.MOBILE_S;
    }
    if (innerWidth <= BreakPoint.MOBILE_M) {
      return Screen.MOBILE_M;
    }
    if (innerWidth <= BreakPoint.MOBILE_L) {
      return Screen.MOBILE_L;
    }
    if (innerWidth <= BreakPoint.TABLET_S) {
      return Screen.TABLET_S;
    }
    if (innerWidth <= BreakPoint.TABLET) {
      return Screen.TABLET;
    }
    if (innerWidth <= BreakPoint.LAPTOP) {
      return Screen.LAPTOP;
    }
    if (innerWidth <= BreakPoint.LAPTOP_L) {
      return Screen.LAPTOP_L;
    }
    if (innerWidth <= BreakPoint.LAPTOP_M) {
      return Screen.LAPTOP_M;
    }
    if (innerWidth <= BreakPoint.DESKTOP) {
      return Screen.DESKTOP;
    }
    return Screen._4K;
  }, []);

  const [screen, setScreen] = useState<Screen | undefined>();

  const defineScreen = useCallback(() => {
    setScreen(getScreen());
  }, [getScreen]);

  useEffect(() => {
    window.addEventListener('resize', defineScreen);
    defineScreen();
    return () => {
      window.removeEventListener('resize', defineScreen);
    };
  }, [defineScreen]);

  return screen;
}

export type ScreenName =
  | '4K'
  | 'desktop'
  | 'laptop_L'
  | 'laptop_M'
  | 'laptop'
  | 'tablet'
  | 'tablet_S'
  | 'mobile_L'
  | 'mobile_M'
  | 'mobile_S';

export function getScreenName(screen: Screen): ScreenName {
  switch (screen) {
    case Screen._4K:
      return '4K';
    case Screen.DESKTOP:
      return 'desktop';
    case Screen.LAPTOP_L:
      return 'laptop_L';
    case Screen.LAPTOP_M:
      return 'laptop_M';
    case Screen.LAPTOP:
      return 'laptop';
    case Screen.TABLET:
      return 'tablet';
    case Screen.TABLET_S:
      return 'tablet_S';
    case Screen.MOBILE_L:
      return 'mobile_L';
    case Screen.MOBILE_M:
      return 'mobile_M';
    case Screen.MOBILE_S:
      return 'mobile_S';
    default:
      return '4K';
  }
}

export function useScreenName(): ScreenName | undefined {
  const screen = useScreen();

  return useMemo<ScreenName | undefined>(() => {
    if (!screen) {
      return undefined;
    }
    return getScreenName(screen);
  }, [screen]);
}

export function useBreakPoint(breakPoint: BreakPoint = BreakPoint.MOBILE_S): boolean {
  const [broke, setBroke] = useState<boolean>(false);

  const calcBreakingPoint = useCallback(() => {
    if (window.innerWidth <= breakPoint && !broke) {
      setBroke(true);
    } else if (window.innerWidth > breakPoint && broke) {
      setBroke(false);
    }
  }, [breakPoint, broke]);

  useEffect(() => {
    window.addEventListener('resize', calcBreakingPoint);
    calcBreakingPoint();
    return () => {
      window.removeEventListener('resize', calcBreakingPoint);
    };
  }, [calcBreakingPoint]);

  return broke;
}
