export type NativeEnv = Record<keyof any, string>;

declare global {
  interface Window {
    env: NativeEnv;
  }
}

export interface Env {
  RELEASE_VERSION?: string;

  NODE_APP_INSTANCE?: number;
  SERVER_NAME?: string;
  DEFAULT_TIME_ZONE?: string;
  DEFAULT_LOCALE?: string;
  DEFAULT_REGION_CODE?: string;
  DEFAULT_CURRENCY?: string;

  ENV_NAME?: string;
  API_HOST?: string;
  API_KEY?: string;
}

function parseEnv(): Env {
  const processEnv = process.env as NativeEnv;
  const windowEnv: NativeEnv = 'env' in window && window.env ? (window.env as NativeEnv) : {};

  const env: Env = {};

  if ('RELEASE_VERSION' in windowEnv && windowEnv.RELEASE_VERSION !== undefined) {
    env.RELEASE_VERSION = windowEnv.RELEASE_VERSION;
  } else if (
    'REACT_APP_RELEASE_VERSION' in processEnv &&
    processEnv.REACT_APP_RELEASE_VERSION !== undefined
  ) {
    env.RELEASE_VERSION = processEnv.REACT_APP_RELEASE_VERSION;
  }

  if ('NODE_APP_INSTANCE' in windowEnv && windowEnv.NODE_APP_INSTANCE !== undefined) {
    env.NODE_APP_INSTANCE = parseInt(windowEnv.NODE_APP_INSTANCE, 10);
  } else if (
    'REACT_APP_NODE_APP_INSTANCE' in processEnv &&
    processEnv.REACT_APP_NODE_APP_INSTANCE !== undefined
  ) {
    env.NODE_APP_INSTANCE = parseInt(processEnv.REACT_APP_NODE_APP_INSTANCE, 10);
  }

  if ('SERVER_NAME' in windowEnv && windowEnv.SERVER_NAME !== undefined) {
    env.SERVER_NAME = windowEnv.SERVER_NAME;
  } else if (
    'REACT_APP_SERVER_NAME' in processEnv &&
    processEnv.REACT_APP_SERVER_NAME !== undefined
  ) {
    env.SERVER_NAME = processEnv.REACT_APP_SERVER_NAME;
  }

  if ('DEFAULT_TIME_ZONE' in windowEnv && windowEnv.DEFAULT_TIME_ZONE !== undefined) {
    env.DEFAULT_TIME_ZONE = windowEnv.DEFAULT_TIME_ZONE;
  } else if (
    'REACT_APP_DEFAULT_TIME_ZONE' in processEnv &&
    processEnv.REACT_APP_DEFAULT_TIME_ZONE !== undefined
  ) {
    env.DEFAULT_TIME_ZONE = processEnv.REACT_APP_DEFAULT_TIME_ZONE;
  }

  if ('DEFAULT_LOCALE' in windowEnv && windowEnv.DEFAULT_LOCALE !== undefined) {
    env.DEFAULT_LOCALE = windowEnv.DEFAULT_LOCALE;
  } else if (
    'REACT_APP_DEFAULT_LOCALE' in processEnv &&
    processEnv.REACT_APP_DEFAULT_LOCALE !== undefined
  ) {
    env.DEFAULT_LOCALE = processEnv.REACT_APP_DEFAULT_LOCALE;
  }

  if ('DEFAULT_REGION_CODE' in windowEnv && windowEnv.DEFAULT_REGION_CODE !== undefined) {
    env.DEFAULT_REGION_CODE = windowEnv.DEFAULT_REGION_CODE;
  } else if (
    'REACT_APP_DEFAULT_REGION_CODE' in processEnv &&
    processEnv.REACT_APP_DEFAULT_REGION_CODE !== undefined
  ) {
    env.DEFAULT_REGION_CODE = processEnv.REACT_APP_DEFAULT_REGION_CODE;
  }

  if ('DEFAULT_CURRENCY' in windowEnv && windowEnv.DEFAULT_CURRENCY !== undefined) {
    env.DEFAULT_CURRENCY = windowEnv.DEFAULT_CURRENCY;
  } else if (
    'REACT_APP_DEFAULT_CURRENCY' in processEnv &&
    processEnv.REACT_APP_DEFAULT_CURRENCY !== undefined
  ) {
    env.DEFAULT_CURRENCY = processEnv.REACT_APP_DEFAULT_CURRENCY;
  }

  if ('ENV_NAME' in windowEnv && windowEnv.ENV_NAME !== undefined) {
    env.ENV_NAME = windowEnv.ENV_NAME;
  } else if ('ENV_NAME' in processEnv && processEnv.ENV_NAME !== undefined) {
    env.ENV_NAME = processEnv.ENV_NAME;
  } else if ('NODE_ENV' in processEnv && processEnv.NODE_ENV !== undefined) {
    env.ENV_NAME = processEnv.NODE_ENV;
  }

  if ('API_HOST' in windowEnv && windowEnv.API_HOST !== undefined) {
    env.API_HOST = windowEnv.API_HOST;
  } else if ('REACT_APP_API_HOST' in processEnv && processEnv.REACT_APP_API_HOST !== undefined) {
    env.API_HOST = processEnv.REACT_APP_API_HOST;
  }

  if ('API_KEY' in windowEnv && windowEnv.API_KEY !== undefined) {
    env.API_KEY = windowEnv.API_KEY;
  } else if ('REACT_APP_API_KEY' in processEnv && processEnv.REACT_APP_API_KEY !== undefined) {
    env.API_KEY = processEnv.REACT_APP_API_KEY;
  }

  return env;
}

const env: Env = parseEnv();

export default env;
