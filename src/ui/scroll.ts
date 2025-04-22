import { useState, useRef, useEffect, useCallback, RefObject, useMemo, RefCallback } from 'react';
import { debounce } from 'lodash';

export interface Scroll {
  progress?: number;
  distance?: number;
  remains?: number;
}

export function useWindowElementScroll<E extends Element = HTMLElement>(
  element?: E,
): { ref: RefObject<E | undefined> } & Scroll {
  const ref = useRef<E>(element);

  const [progress, setProgress] = useState<number | undefined>();
  const [distance, setDistance] = useState<number | undefined>();
  // TODO : Remains
  const [remains, setRemains] = useState<number | undefined>();

  const calcProgress = useCallback(() => {
    if (ref.current && window) {
      const { top, bottom, height } = ref.current.getBoundingClientRect();

      if (window.innerHeight > top && bottom > 0) {
        setProgress((window.innerHeight - top) / (height + window.innerHeight));
        setDistance(window.innerHeight - top);
        setRemains(bottom - window.innerHeight);
      } else if (bottom < 0) setProgress(1);
    }
  }, []);

  useEffect(() => {
    calcProgress();
    window.addEventListener('scroll', calcProgress);
    window.addEventListener('touchmove', calcProgress);
    window.addEventListener('resize', calcProgress);
    return () => {
      window.removeEventListener('scroll', calcProgress);
      window.removeEventListener('touchmove', calcProgress);
      window.removeEventListener('resize', calcProgress);
    };
  });

  return { ref, progress, distance, remains };
}

export function useWindowElementScrollProgressThreshold<E extends Element = HTMLElement>(
  threshold = 0.2,
  element?: E,
): { ref: RefObject<E | undefined>; active: boolean } & Scroll {
  const [active, setActive] = useState(false);

  const { ref, progress, distance, remains } = useWindowElementScroll<E>(element);

  useEffect(() => {
    if (progress !== undefined) {
      if (progress >= threshold && !active) {
        setActive(true);
      } else if (progress <= threshold && active) {
        setActive(false);
      }
    }
  }, [progress, threshold, active]);

  return { ref, active, progress, distance, remains };
}

export function useWindowElementScrollProgressThresholds<E extends Element = HTMLElement>(
  thresholds = [0.25],
  element?: E,
): { ref: RefObject<E | undefined>; actives: boolean[] } & Scroll {
  const [actives, setActives] = useState(Array<boolean>(thresholds.length).fill(false));

  const { ref, progress, distance, remains } = useWindowElementScroll<E>(element);

  useEffect(() => {
    let match = false;

    if (progress !== undefined) {
      thresholds.forEach((threshold, key) => {
        if (progress >= threshold && !actives[key]) {
          match = true;
          actives[key] = true;
        } else if (progress <= threshold && actives[key]) {
          match = true;
          actives[key] = false;
        }
      });
    }

    if (match) {
      setActives([...actives]);
    }
  }, [progress, thresholds, actives, setActives]);

  return { ref, actives, progress, distance, remains };
}

export function useWindowElementScrollRemainsThreshold<E extends Element = HTMLElement>(
  element?: E,
  threshold = 100,
  trigger?: () => unknown,
): { ref: RefObject<E | undefined>; active: boolean } & Scroll {
  const [active, setActive] = useState(false);
  const [pending, setPending] = useState(false);

  const { ref, progress, distance, remains } = useWindowElementScroll<E>(element);

  const debouncedTrigger = useMemo<_.DebouncedFuncLeading<() => unknown> | undefined>(() => {
    return trigger
      ? debounce<() => unknown>(trigger, 500, {
          leading: true,
          trailing: false,
        })
      : undefined;
  }, [trigger]);

  useEffect(() => {
    if (remains !== undefined) {
      if (remains <= threshold && !active) {
        if (debouncedTrigger && !pending) {
          const res = debouncedTrigger();
          if (
            res &&
            typeof res === 'object' &&
            'finally' in res &&
            res.finally &&
            typeof res.finally === 'function'
          ) {
            setPending(true);
            res.finally(() => setPending(false));
          }
        }
        setActive(true);
      } else if (remains > threshold && active) {
        setActive(false);
      }
    }
  }, [distance, threshold, active, setActive, remains, debouncedTrigger, pending]);

  return { ref, active, progress, distance, remains };
}

export function useWindowScroll(): Scroll {
  const [progress, setProgress] = useState<number | undefined>();
  const [distance, setDistance] = useState<number | undefined>();
  const [remains, setRemains] = useState<number | undefined>();

  const calcProgress = useCallback(() => {
    if (window) {
      setDistance(window.scrollY);
      const scrollableDistance = document.body.offsetHeight - window.innerHeight;
      if (scrollableDistance) {
        setProgress(window.scrollY / scrollableDistance);
      }
      setRemains(scrollableDistance - window.scrollY);
    }
  }, []);

  useEffect(() => {
    calcProgress();
    window.addEventListener('scroll', calcProgress);
    window.addEventListener('touchmove', calcProgress);
    window.addEventListener('resize', calcProgress);
    return () => {
      window.removeEventListener('scroll', calcProgress);
      window.removeEventListener('touchmove', calcProgress);
      window.removeEventListener('resize', calcProgress);
    };
  });

  return { progress, distance, remains };
}

export function useWindowScrollProgressThreshold(threshold = 0.2): { active?: boolean } & Scroll {
  const [active, setActive] = useState(false);

  const { progress, distance, remains } = useWindowScroll();

  useEffect(() => {
    if (progress !== undefined) {
      if (progress >= threshold && !active) {
        setActive(true);
      } else if (progress < threshold && active) {
        setActive(false);
      }
    }
  }, [progress, threshold, active, setActive]);

  return { active, progress, distance, remains };
}

export function useWindowScrollDistanceThreshold(threshold: number): { active?: boolean } & Scroll {
  const [active, setActive] = useState(false);

  const { progress, distance, remains } = useWindowScroll();

  useEffect(() => {
    if (distance !== undefined) {
      if (distance >= threshold && !active) {
        setActive(true);
      } else if (distance < threshold && active) {
        setActive(false);
      }
    }
  }, [distance, threshold, active, setActive]);

  return { active, progress, distance, remains };
}

export function disableBodyScroll() {
  //
}

export function useElementScroll<E extends Element = HTMLElement>(
  element?: E,
): { ref: RefCallback<E> } & Scroll {
  const [internalElement, setInternalElement] = useState<E | null>(element || null);

  const [progress, setProgress] = useState<number | undefined>();
  const [distance, setDistance] = useState<number | undefined>();
  const [remains, setRemains] = useState<number | undefined>();

  const calcProgress = useCallback(() => {
    if (internalElement) {
      setDistance(internalElement.scrollTop);
      const scrollableDistance = internalElement.scrollHeight - internalElement.clientHeight;
      if (scrollableDistance) {
        setProgress(internalElement.scrollTop / scrollableDistance);
      }
      setRemains(scrollableDistance - internalElement.scrollTop);
    }
  }, [internalElement]);

  useEffect(() => {
    calcProgress();
    internalElement?.addEventListener('scroll', calcProgress);
    internalElement?.addEventListener('touchmove', calcProgress);
    return () => {
      internalElement?.removeEventListener('scroll', calcProgress);
      internalElement?.removeEventListener('touchmove', calcProgress);
    };
  }, [internalElement, calcProgress]);

  const ref = useCallback((_element: E) => {
    setInternalElement(_element);
  }, []);

  return { ref, progress, distance, remains };
}

export function useElementScrollRemainsThreshold<E extends Element = HTMLElement>(
  element?: E,
  threshold = 100,
  trigger?: () => unknown,
): { ref: RefCallback<E>; active?: boolean } & Scroll {
  const [active, setActive] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  const { ref, distance, progress, remains } = useElementScroll<E>(element);

  const debouncedTrigger = useMemo<_.DebouncedFuncLeading<() => unknown> | undefined>(() => {
    return trigger
      ? debounce<() => unknown>(trigger, 500, {
          leading: true,
          trailing: false,
        })
      : undefined;
  }, [trigger]);

  useEffect(() => {
    if (remains !== undefined) {
      if (remains <= threshold && !active) {
        if (debouncedTrigger && !pending) {
          const res = debouncedTrigger();
          if (
            res &&
            typeof res === 'object' &&
            'finally' in res &&
            res.finally &&
            typeof res.finally === 'function'
          ) {
            setPending(true);
            res.finally(() => setPending(false));
          }
        }
        setActive(true);
      } else if (remains > threshold && active) {
        setActive(false);
      }
    }
  }, [distance, threshold, active, setActive, remains, debouncedTrigger, pending]);

  return { ref, active, progress, distance, remains };
}

export interface InfiniteScrollParams<E extends Element = HTMLElement> {
  element?: E;
  loadNextPage?: () => unknown;
  threshold?: number;
}

export function useElementInfiniteScroll<E extends Element = HTMLElement>(
  params?: InfiniteScrollParams<E>,
): {
  ref: RefCallback<E>;
  active?: boolean;
} & Scroll {
  return useElementScrollRemainsThreshold<E>(
    params?.element,
    params?.threshold,
    params?.loadNextPage,
  );
}

export function useWindowInfiniteScroll<E extends Element = HTMLElement>(
  params?: InfiniteScrollParams<E>,
): {
  ref: RefObject<E | undefined>;
  active?: boolean;
} & Scroll {
  return useWindowElementScrollRemainsThreshold<E>(
    params?.element,
    params?.threshold,
    params?.loadNextPage,
  );
}
