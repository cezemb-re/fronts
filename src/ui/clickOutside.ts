import { RefObject, useEffect, useCallback } from 'react';

type Callback = (event: Event) => void;

export default function useClickOutside(ref: RefObject<HTMLElement>, callback: Callback): void {
  const onClick = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    },
    [callback, ref],
  );

  useEffect(() => {
    window.addEventListener('click', onClick);

    return () => window.removeEventListener('click', onClick);
  }, [ref, onClick]);
}
