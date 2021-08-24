import { useCallback, useEffect, useState } from 'react';

const scripts: HTMLScriptElement[] = [];

export type ScriptStatus = [boolean, Error | null, boolean];

export interface UseScriptOptions {
  async?: boolean;
  defer?: boolean;
  callback?: (error: Error | undefined) => void;
  key?: string;
}

export default function useScript(
  src: string,
  options: UseScriptOptions | undefined,
): ScriptStatus {
  const [pending, setPending] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const onScriptLoad = useCallback(() => {
    setPending(false);
    setLoaded(true);
    const event = new CustomEvent('script-loaded', { detail: options });
    document.dispatchEvent(event);
    if (options?.callback) {
      options?.callback(undefined);
    }
  }, [options]);

  useEffect(() => {
    setPending(true);

    const scriptIndex = scripts.findIndex((script: HTMLScriptElement) => script.src === src);

    if (scriptIndex !== -1) {
      const script = scripts[scriptIndex];

      const onScriptError = (event: ErrorEvent) => {
        setPending(false);
        setLoaded(true);
        setError(new Error(`${event.type}: ${event.message}`));
      };

      script.addEventListener('load', onScriptLoad);
      script.addEventListener('error', onScriptError);

      return () => {
        script.removeEventListener('load', onScriptLoad);
        script.removeEventListener('error', onScriptError);
      };
    }
    const script = document.createElement('script');

    script.src = src;
    script.async = options?.async !== undefined ? options?.async : true;
    script.defer = options?.defer !== undefined ? options?.defer : true;

    scripts.push(script);

    const onScriptError = (event: ErrorEvent) => {
      const index = scripts.findIndex((s) => s.src === src);

      if (index !== -1) {
        scripts.splice(index, 1);
      }

      script.remove();

      setPending(false);
      setLoaded(true);
      setError(new Error(`${event.type}: ${event.message}`));
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    };
  }, [src, options, onScriptLoad]);

  return [loaded, error, pending];
}
