import React, { useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export interface Measure {
  x: number;
  y: number;
  left: number;
  top: number;
  right: number;
  width: number;
  height: number;
}

export default function useMeasure<T extends Element>(
  ref: React.RefObject<T>,
): Measure | undefined {
  const [measure, setMeasure] = useState<Measure | undefined>(undefined);
  const [resizeObserver] = useState(
    () =>
      new ResizeObserver(([entry]: ResizeObserverEntry[]): void => {
        setMeasure(entry.contentRect);
      }),
  );

  useEffect(() => {
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => resizeObserver.disconnect();
  }, [ref, resizeObserver]);

  return measure;
}
