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
  options: UseScriptOptions | undefined = undefined,
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
      options.callback(undefined);
    }
  }, [options]);

  const onScriptError = useCallback(
    (event: ErrorEvent) => {
      const err = new Error(`${event.type}: ${event.message}`);
      setError(err);
      setPending(false);
      setLoaded(true);
      if (options?.callback) {
        options.callback(err);
      }
    },
    [options],
  );

  useEffect(() => {
    setPending(true);

    const scriptIndex = scripts.findIndex((script: HTMLScriptElement) => script.src === src);

    if (scriptIndex !== -1) {
      const script = scripts[scriptIndex];

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

    const onError = (event: ErrorEvent) => {
      const index = scripts.findIndex((s) => s.src === src);

      if (index !== -1) {
        scripts.splice(index, 1);
      }

      script.remove();
      onScriptError(event);
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onError);
    };
  }, [src, options, onScriptLoad, onScriptError]);

  return [loaded, error, pending];
}
