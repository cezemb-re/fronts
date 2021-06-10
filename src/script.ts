import { useEffect, useState } from 'react';

const scripts: HTMLScriptElement[] = [];

export type ScriptStatus = [boolean, Error | null, boolean];

export default function useScript(src: string, async = true, defer = true): ScriptStatus {
  const [pending, setPending] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  function onScriptLoad() {
    setPending(false);
    setLoaded(true);
  }

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
    script.async = async;
    script.defer = defer;

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
  }, [async, defer, src]);

  return [loaded, error, pending];
}
