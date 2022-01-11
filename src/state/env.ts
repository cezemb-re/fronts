export type NativeEnv = {
  [key: string]: string;
};

declare global {
  interface Window {
    env: NativeEnv;
  }
}

export interface Env {
  SERVER_NAME?: string;
  DOMAIN_NAME?: string;
  ENV_NAME?: string;

  RELEASE_VERSION?: string;

  NODE_APP_INSTANCE?: number;
  DEFAULT_TIME_ZONE?: string;
  DEFAULT_LOCALE?: string;
  DEFAULT_REGION_CODE?: string;
  DEFAULT_CURRENCY?: string;

  API_HOST?: string;
  API_KEY?: string;
}

function parseEnv(): Env {
  const processEnv = process.env as NativeEnv;
  const windowEnv: NativeEnv = window.env ? window.env : {};

  const env: Env = {};

  if (windowEnv.SERVER_NAME !== undefined) {
    env.SERVER_NAME = windowEnv.SERVER_NAME;
  } else if (processEnv.REACT_APP_SERVER_NAME !== undefined) {
    env.SERVER_NAME = processEnv.REACT_APP_SERVER_NAME;
  }

  if (windowEnv.DOMAIN_NAME !== undefined) {
    env.DOMAIN_NAME = windowEnv.DOMAIN_NAME;
  } else if (processEnv.REACT_APP_DOMAIN_NAME !== undefined) {
    env.DOMAIN_NAME = processEnv.REACT_APP_DOMAIN_NAME;
  }

  if (windowEnv.ENV_NAME !== undefined) {
    env.ENV_NAME = windowEnv.ENV_NAME;
  } else if (processEnv.ENV_NAME !== undefined) {
    env.ENV_NAME = processEnv.ENV_NAME;
  } else if (processEnv.NODE_ENV !== undefined) {
    env.ENV_NAME = processEnv.NODE_ENV;
  }

  if (windowEnv.RELEASE_VERSION !== undefined) {
    env.RELEASE_VERSION = windowEnv.RELEASE_VERSION;
  } else if (processEnv.REACT_APP_RELEASE_VERSION !== undefined) {
    env.RELEASE_VERSION = processEnv.REACT_APP_RELEASE_VERSION;
  }

  if (windowEnv.NODE_APP_INSTANCE !== undefined) {
    env.NODE_APP_INSTANCE = parseInt(windowEnv.NODE_APP_INSTANCE, 10);
  } else if (processEnv.REACT_APP_NODE_APP_INSTANCE !== undefined) {
    env.NODE_APP_INSTANCE = parseInt(processEnv.REACT_APP_NODE_APP_INSTANCE, 10);
  }

  if (windowEnv.DEFAULT_TIME_ZONE !== undefined) {
    env.DEFAULT_TIME_ZONE = windowEnv.DEFAULT_TIME_ZONE;
  } else if (processEnv.REACT_APP_DEFAULT_TIME_ZONE !== undefined) {
    env.DEFAULT_TIME_ZONE = processEnv.REACT_APP_DEFAULT_TIME_ZONE;
  }

  if (windowEnv.DEFAULT_LOCALE !== undefined) {
    env.DEFAULT_LOCALE = windowEnv.DEFAULT_LOCALE;
  } else if (processEnv.REACT_APP_DEFAULT_LOCALE !== undefined) {
    env.DEFAULT_LOCALE = processEnv.REACT_APP_DEFAULT_LOCALE;
  }

  if (windowEnv.DEFAULT_REGION_CODE !== undefined) {
    env.DEFAULT_REGION_CODE = windowEnv.DEFAULT_REGION_CODE;
  } else if (processEnv.REACT_APP_DEFAULT_REGION_CODE !== undefined) {
    env.DEFAULT_REGION_CODE = processEnv.REACT_APP_DEFAULT_REGION_CODE;
  }

  if (windowEnv.DEFAULT_CURRENCY !== undefined) {
    env.DEFAULT_CURRENCY = windowEnv.DEFAULT_CURRENCY;
  } else if (processEnv.REACT_APP_DEFAULT_CURRENCY !== undefined) {
    env.DEFAULT_CURRENCY = processEnv.REACT_APP_DEFAULT_CURRENCY;
  }

  if (windowEnv.API_HOST !== undefined) {
    env.API_HOST = windowEnv.API_HOST;
  } else if (processEnv.REACT_APP_API_HOST !== undefined) {
    env.API_HOST = processEnv.REACT_APP_API_HOST;
  }

  if (windowEnv.API_KEY !== undefined) {
    env.API_KEY = windowEnv.API_KEY;
  } else if (processEnv.REACT_APP_API_KEY !== undefined) {
    env.API_KEY = processEnv.REACT_APP_API_KEY;
  }

  return env;
}

const env: Env = parseEnv();

export default env;
