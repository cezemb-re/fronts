import { RefObject, useEffect, useCallback } from 'react';

export type Elements =
  | Element
  | RefObject<Element>
  | null
  | undefined
  | (Element | RefObject<Element> | null | undefined)[];

export function doesEventTargetContainsElements(event: MouseEvent, elements: Elements): boolean {
  if (!elements) {
    return false;
  }
  if (Array.isArray(elements)) {
    let match = false;
    elements.forEach((element: Element | RefObject<Element> | null | undefined) => {
      if (element) {
        const e = 'current' in element ? element.current : (element as Element);
        if (e?.contains(event.target as Node)) {
          match = true;
        }
      }
    });
    return match;
  }
  const e = 'current' in elements ? elements.current : (elements as Element);
  return e?.contains(event.target as Node) || false;
}

export function useClickOutside(elements: Elements, callback: (event: MouseEvent) => void): void {
  const onClick = useCallback(
    (event: MouseEvent) => {
      if (!doesEventTargetContainsElements(event, elements)) {
        callback(event);
      }
    },
    [callback, elements],
  );

  useEffect(() => {
    window.addEventListener<'click'>('click', onClick);

    return () => window.removeEventListener<'click'>('click', onClick);
  }, [onClick]);
}
