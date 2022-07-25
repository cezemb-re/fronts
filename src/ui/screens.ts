import { useState, useEffect, useCallback } from 'react';

export enum BreakPoint {
  _4K = 2560,
  DESKTOP = 1800,
  LAPTOP_L = 1440,
  LAPTOP = 1024,
  TABLET = 768,
  TABLET_S = 596,
  MOBILE_L = 425,
  MOBILE_M = 375,
  MOBILE_S = 320,
}

export type Screen =
  | '4K'
  | 'desktop'
  | 'laptop_L'
  | 'laptop'
  | 'tablet'
  | 'tablet_S'
  | 'mobile_L'
  | 'mobile_M'
  | 'mobile_S';

export function useScreen(): Screen {
  const retrieveScreen = useCallback((): Screen => {
    const { innerWidth } = window;
    if (innerWidth <= BreakPoint.MOBILE_S) {
      return 'mobile_S';
    }
    if (innerWidth <= BreakPoint.MOBILE_M) {
      return 'mobile_M';
    }
    if (innerWidth <= BreakPoint.MOBILE_L) {
      return 'mobile_L';
    }
    if (innerWidth <= BreakPoint.TABLET_S) {
      return 'tablet_S';
    }
    if (innerWidth <= BreakPoint.TABLET) {
      return 'tablet';
    }
    if (innerWidth <= BreakPoint.LAPTOP) {
      return 'laptop';
    }
    if (innerWidth <= BreakPoint.LAPTOP_L) {
      return 'laptop_L';
    }
    if (innerWidth <= BreakPoint.DESKTOP) {
      return 'desktop';
    }
    return '4K';
  }, []);

  const [screen, setScreen] = useState<Screen>(retrieveScreen());

  const defineScreen = useCallback(() => {
    setScreen(retrieveScreen);
  }, [retrieveScreen]);

  useEffect(() => {
    defineScreen();
    window.addEventListener('resize', defineScreen);
    return () => window.removeEventListener('resize', defineScreen);
  }, [defineScreen]);

  return screen;
}

export function useBreakPoint(breakPoint: BreakPoint = BreakPoint.MOBILE_S): boolean {
  const [broke, setBroke] = useState<boolean>(false);

  const calcBreakingPoint = useCallback(() => {
    if (window.innerWidth <= breakPoint && !broke) setBroke(true);
    else if (window.innerWidth > breakPoint && broke) setBroke(false);
  }, [breakPoint, broke]);

  useEffect(() => {
    calcBreakingPoint();
    window.addEventListener('resize', calcBreakingPoint);
    return () => window.removeEventListener('resize', calcBreakingPoint);
  }, [calcBreakingPoint]);

  return broke;
}
