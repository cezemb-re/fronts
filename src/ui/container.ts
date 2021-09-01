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
  MOBILE_S = 375,
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
