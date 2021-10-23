import { RefObject, useEffect, useCallback } from 'react';

type Callback = (event: MouseEvent) => void;

export default function useClickOutside(ref: RefObject<HTMLElement>, callback: Callback): void {
  const onClick = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    },
    [callback, ref],
  );

  useEffect(() => {
    window.addEventListener<'click'>('click', onClick);

    return () => window.removeEventListener<'click'>('click', onClick);
  }, [ref, onClick]);
}
