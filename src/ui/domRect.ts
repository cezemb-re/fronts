import { useState, useEffect, RefObject, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export function useDOMRect<T extends Element>(ref: RefObject<T | undefined>): DOMRect | undefined {
  const [DOMRect, setDOMRect] = useState<DOMRect | undefined>();

  const resizeObserver = useRef<ResizeObserver | undefined>(undefined);

  useEffect(() => {
    if (!resizeObserver.current) {
      resizeObserver.current = new ResizeObserver(([entry]: ResizeObserverEntry[]): void => {
        setDOMRect(entry.contentRect);
      });
    }

    return () => {
      resizeObserver.current?.disconnect();
      resizeObserver.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      setDOMRect(ref.current.getBoundingClientRect());
      resizeObserver.current?.observe(ref.current);
    }
  }, [ref]);

  return DOMRect;
}
