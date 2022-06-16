import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { createContext, ReactElement, useCallback, useContext, useMemo, useState } from 'react';
import httpStatus from 'http-status';
import base64 from 'base-64';

export interface Model {
  id: string;
  creation?: string;
  last_update?: string;
  [key: string]: unknown;
}

export type PaginatedList<N extends string, D = unknown> = {
  [key in N]: D[];
} & {
  total: number;
  url?: string;
  limit?: number;
  page?: number;
  next_page?: number;
  previous_page?: number;
};

export interface FormErrors {
  [field: string]: string;
}

export interface ApiErrorData<FE extends FormErrors = FormErrors> {
  status?: number;
  code?: string;
  form_errors?: FE;
  state?: Record<string, unknown>;
  message?: string;
}

export class ApiError<FE extends FormErrors = FormErrors> extends Error implements ApiErrorData {
  readonly __FLAG__ = 'ApiError';

  status?: number;

  code?: string;

  form_errors?: FE;

  state?: Record<string, unknown>;

  constructor(error: Error | ApiErrorData<FE> | string) {
    if (error instanceof Error) {
      super(error.message);
    } else if (typeof error === 'object') {
      super(error.message);

      this.status = error.status;
      this.code = error.code;
      this.form_errors = error.form_errors;
      this.state = error.state;
    } else {
      super(error);

      this.status = httpStatus.BAD_REQUEST;
    }
  }
}

export function isApiError(error: unknown): boolean {
  return !!(
    error &&
    typeof error === 'object' &&
    '__FLAG__' in error &&
    error instanceof ApiError &&
    error.__FLAG__ &&
    error.__FLAG__ === 'ApiError'
  );
}

export type RequestBody = { [key: string]: unknown };

export function buildRequestBody<B extends RequestBody = RequestBody>(body: B): FormData {
  const formData = new FormData();

  Object.entries(body).forEach(([param, value]) => {
    if (value === null) {
      formData.append(param, '');
    } else if (typeof value === 'string') {
      formData.append(param, value);
    } else if (typeof value === 'number') {
      formData.append(param, value.toString(10));
    } else if (typeof value === 'boolean') {
      formData.append(param, value.toString());
    } else if (typeof value === 'object') {
      if (value instanceof Blob) {
        formData.append(param, value);
      } else if ('toString' in value && value.toString && typeof value.toString === 'function') {
        formData.append(param, value.toString());
      } else {
        formData.append(param, JSON.stringify(value));
      }
    }
  });

  return formData;
}

export interface ApiConfig {
  host?: string | null;
  apiKey?: string | null;
  locale?: string | null;
  bearerToken?: string | null;
}

export type RequestParams = { [key: string]: unknown };

export function buildRequestConfig<RP extends RequestParams = RequestParams>(
  apiConfig?: ApiConfig,
  params?: RP,
): AxiosRequestConfig {
  const headers: AxiosRequestHeaders = {};

  if (apiConfig?.apiKey) {
    headers['X-Api-Key'] = apiConfig.apiKey;
  }

  if (apiConfig?.bearerToken) {
    headers.Authorization = `Bearer ${apiConfig.bearerToken}`;
  }

  if (apiConfig?.locale) {
    headers['X-locale'] = apiConfig.locale;
  }

  return {
    headers,
    params,
  };
}

function parseError(error: unknown): ApiError {
  if (!error) {
    return new ApiError('Unknown error');
  }
  if (typeof error === 'object') {
    if ('response' in error && (error as AxiosError).response) {
      const { response } = error as AxiosError<ApiErrorData>;
      if (response?.data) {
        return new ApiError({ ...response.data, status: response.status });
      }
    }
    return new ApiError(error as Error);
  }
  if (typeof error === 'string') {
    return new ApiError(error);
  }
  return new ApiError('Unknown error');
}

export async function apiGet<D = unknown, RP extends RequestParams = RequestParams>(
  url: string,
  apiConfig?: ApiConfig,
  params?: RP,
): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(apiConfig, params);

  try {
    return await axios.get<D>((apiConfig?.host || '') + url, config);
  } catch (error: unknown) {
    throw parseError(error);
  }
}

export async function apiPost<
  D = unknown,
  RB extends RequestBody = RequestBody,
  RP extends RequestParams = RequestParams,
>(url: string, body: RB, apiConfig?: ApiConfig, params?: RP): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(apiConfig, params);

  try {
    return await axios.post<D>((apiConfig?.host || '') + url, buildRequestBody<RB>(body), config);
  } catch (error: unknown) {
    throw parseError(error);
  }
}

export async function apiPut<
  D = unknown,
  RB extends RequestBody = RequestBody,
  RP extends RequestParams = RequestParams,
>(url: string, body: RB, apiConfig?: ApiConfig, params?: RP): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(apiConfig, params);

  try {
    return await axios.put<D>((apiConfig?.host || '') + url, buildRequestBody<RB>(body), config);
  } catch (error: unknown) {
    throw parseError(error);
  }
}

export async function apiDelete<D = unknown, RP extends RequestParams = RequestParams>(
  url: string,
  apiConfig?: ApiConfig,
  params?: RP,
): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(apiConfig, params);

  try {
    return await axios.get<D>((apiConfig?.host || '') + url, config);
  } catch (error: unknown) {
    throw parseError(error);
  }
}

export interface ApiContext {
  config?: ApiConfig;

  setConfig(config: ApiConfig): void;

  setHost(host?: string | null): void;
  setApiKey(apiKey?: string | null): void;
  setLocale(locale?: string | null): void;
  setBearerToken(bearerToken?: string | null): void;

  get<D = unknown, RP extends RequestParams = RequestParams>(
    route: string,
    params?: RP,
  ): Promise<AxiosResponse<D>>;
  post<D = unknown, RB extends RequestBody = RequestBody, RP extends RequestParams = RequestParams>(
    route: string,
    body: RB,
    params?: RP,
  ): Promise<AxiosResponse<D>>;
  put<D = unknown, RB extends RequestBody = RequestBody, RP extends RequestParams = RequestParams>(
    route: string,
    body: RB,
    params?: RP,
  ): Promise<AxiosResponse<D>>;
  delete<D = unknown, RP extends RequestParams = RequestParams>(
    route: string,
    params?: RP,
  ): Promise<AxiosResponse<D>>;
}

const apiContext = createContext<ApiContext | undefined>(undefined);

export function useApi(): ApiContext {
  const context = useContext<ApiContext | undefined>(apiContext);
  if (!context) {
    throw new Error('Missing api context');
  }
  return context;
}

const API_CONFIG_STORAGE_KEY = Buffer.from('cezembre_fronts_api_config').toString('base64');

function storeConfig(config?: ApiConfig): void {
  if (window) {
    window.localStorage.setItem(API_CONFIG_STORAGE_KEY, base64.encode(JSON.stringify(config)));
  }
}

function hydrateConfig(config?: ApiConfig): ApiConfig | undefined {
  let storedConfig: ApiConfig | undefined;
  if (window) {
    const raw = window.localStorage.getItem(API_CONFIG_STORAGE_KEY);
    if (raw) {
      storedConfig = JSON.parse(base64.decode(raw)) as ApiConfig;
    }
  }

  if (storedConfig) {
    return storedConfig;
  }

  storeConfig(config);

  return config;
}

export interface Props {
  children?: ReactElement;
  config?: ApiConfig;
  persistConfig?: boolean;
}

export function ApiProvider({ children, config, persistConfig = true }: Props): ReactElement {
  const [apiConfig, setApiConfig] = useState<ApiConfig | undefined>(
    persistConfig ? hydrateConfig(config) : config,
  );

  const setConfig = useCallback(
    (_config: ApiConfig) => {
      setApiConfig(_config);
      if (persistConfig) {
        storeConfig(_config);
      }
    },
    [persistConfig],
  );

  const setHost = useCallback(
    (host: string | null) => {
      setApiConfig((oldConfig) => {
        const newConfig: ApiConfig = { ...oldConfig, host };
        if (persistConfig) {
          storeConfig(newConfig);
        }
        return newConfig;
      });
    },
    [persistConfig],
  );

  const setApiKey = useCallback(
    (apiKey: string | null) => {
      setApiConfig((oldConfig) => {
        const newConfig: ApiConfig = { ...oldConfig, apiKey };
        if (persistConfig) {
          storeConfig(newConfig);
        }
        return newConfig;
      });
    },
    [persistConfig],
  );

  const setLocale = useCallback(
    (locale: string | null) => {
      setApiConfig((oldConfig) => {
        const newConfig: ApiConfig = { ...oldConfig, locale };
        if (persistConfig) {
          storeConfig(newConfig);
        }
        return newConfig;
      });
    },
    [persistConfig],
  );

  const setBearerToken = useCallback(
    (bearerToken: string | null) => {
      setApiConfig((oldConfig) => {
        const newConfig: ApiConfig = { ...oldConfig, bearerToken };
        if (persistConfig) {
          storeConfig(newConfig);
        }
        return newConfig;
      });
    },
    [persistConfig],
  );

  const value = useMemo<ApiContext>(
    () => ({
      config: apiConfig,
      setConfig,
      setHost,
      setApiKey,
      setLocale,
      setBearerToken,
      get: (route: string, params?: RequestParams) => apiGet(route, apiConfig, params),
      post: (route: string, body: RequestBody, params?: RequestParams) =>
        apiPost(route, body, apiConfig, params),
      put: (route: string, body: RequestBody, params?: RequestParams) =>
        apiPut(route, body, apiConfig, params),
      delete: (route: string, params?: RequestParams) => apiDelete(route, apiConfig, params),
    }),
    [apiConfig, setApiKey, setBearerToken, setConfig, setHost, setLocale],
  );

  return <apiContext.Provider value={value}>{children}</apiContext.Provider>;
}
