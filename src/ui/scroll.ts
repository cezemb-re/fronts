import { useState, useRef, useEffect, useCallback, RefObject } from 'react';

export interface Scroll {
  progress: number;
  distance: number;
}

export function useElementScroll<E extends Element = HTMLElement>(
  currentRef?: RefObject<E>,
): { ref: RefObject<E> } & Scroll {
  const ref = useRef<E>(currentRef?.current || null);

  const [progress, setProgress] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  const calcProgress = useCallback(() => {
    if (ref.current) {
      const { top, bottom, height } = ref.current.getBoundingClientRect();

      if (window.innerHeight > top && bottom > 0) {
        setProgress((window.innerHeight - top) / (height + window.innerHeight));
        setDistance(window.innerHeight - top);
      } else if (bottom < 0) setProgress(1);
    }
  }, []);

  useEffect(() => {
    calcProgress();
    window.addEventListener('scroll', calcProgress);
    window.addEventListener('resize', calcProgress);
    return () => {
      window.removeEventListener('scroll', calcProgress);
      window.removeEventListener('resize', calcProgress);
    };
  });

  return { ref, progress, distance };
}

export function useElementScrollProgressThreshold<E extends Element = HTMLElement>(
  threshold = 0.2,
  currentRef?: RefObject<E>,
): { ref: RefObject<E>; active: boolean } & Scroll {
  const [active, setActive] = useState(false);

  const { ref, progress, distance } = useElementScroll<E>(currentRef);

  useEffect(() => {
    if (progress >= threshold && !active) {
      setActive(true);
    } else if (progress <= threshold && active) {
      setActive(false);
    }
  }, [progress, threshold, active]);

  return { ref, active, progress, distance };
}

export function useElementScrollProgressThresholds<E extends Element = HTMLElement>(
  thresholds = [0.25],
  currentRef?: RefObject<E>,
): { ref: RefObject<E>; actives: boolean[] } & Scroll {
  const [actives, setActives] = useState(Array<boolean>(thresholds.length).fill(false));

  const { ref, progress, distance } = useElementScroll<E>(currentRef);

  useEffect(() => {
    let match = false;

    thresholds.forEach((threshold, key) => {
      if (progress >= threshold && !actives[key]) {
        match = true;
        actives[key] = true;
      } else if (progress <= threshold && actives[key]) {
        match = true;
        actives[key] = false;
      }
    });

    if (match) {
      setActives([...actives]);
    }
  }, [progress, thresholds, actives, setActives]);

  return { ref, actives, progress, distance };
}

export function useScroll(): Scroll {
  const [progress, setProgress] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  const calcProgress = useCallback(() => {
    setProgress(window.scrollY / window.innerHeight);
    setDistance(window.scrollY);
  }, []);

  useEffect(() => {
    calcProgress();
    window.addEventListener('scroll', calcProgress);
    window.addEventListener('resize', calcProgress);
    return () => {
      window.removeEventListener('scroll', calcProgress);
      window.removeEventListener('resize', calcProgress);
    };
  });

  return { progress, distance };
}

export function useScrollProgressThreshold(threshold = 0.2): { active?: boolean } & Scroll {
  const [active, setActive] = useState(false);

  const { progress, distance } = useScroll();

  useEffect(() => {
    if (progress >= threshold && !active) {
      setActive(true);
    } else if (progress <= threshold && active) {
      setActive(false);
    }
  }, [progress, threshold, active, setActive]);

  return { active, progress, distance };
}

export function useScrollDistanceThreshold(threshold: number): { active?: boolean } & Scroll {
  const [active, setActive] = useState(false);

  const { progress, distance } = useScroll();

  useEffect(() => {
    if (distance >= threshold && !active) {
      setActive(true);
    } else if (distance <= threshold && active) {
      setActive(false);
    }
  }, [distance, threshold, active, setActive]);

  return { active, progress, distance };
}

export function disableBodyScroll() {
  //
}
