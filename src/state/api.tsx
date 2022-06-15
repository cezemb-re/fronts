import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { createContext, ReactElement, useContext, useMemo, useState } from 'react';
import httpStatus from 'http-status';

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

export type RequestParams = { [key: string]: unknown };

export interface ApiRequestOptions<RP extends RequestParams = RequestParams> {
  apiKey?: string | null;
  bearerToken?: string | null;
  locale?: string | null;
  params?: RP;
  crossDomain?: boolean;
}

export function buildRequestConfig<RP extends RequestParams = RequestParams>(
  opts?: ApiRequestOptions<RP>,
): AxiosRequestConfig {
  const headers: AxiosRequestHeaders = {};

  if (opts?.apiKey) {
    headers['X-Api-Key'] = opts.apiKey;
  }

  if (opts?.bearerToken) {
    headers.Authorization = `Bearer ${opts.bearerToken}`;
  }

  if (opts?.locale) {
    headers['X-locale'] = opts.locale;
  }

  return {
    headers,
    params: opts?.params,
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
  opts?: ApiRequestOptions<RP>,
): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(opts);

  try {
    return await axios.get<D>(url, config);
  } catch (error: unknown) {
    throw parseError(error);
  }
}

export async function apiPost<
  D = unknown,
  RB extends RequestBody = RequestBody,
  RP extends RequestParams = RequestParams,
>(url: string, body: RB, opts?: ApiRequestOptions<RP>): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(opts);

  try {
    return await axios.post<D>(url, buildRequestBody<RB>(body), config);
  } catch (error: unknown) {
    throw parseError(error);
  }
}

export async function apiPut<
  D = unknown,
  RB extends RequestBody = RequestBody,
  RP extends RequestParams = RequestParams,
>(url: string, body: RB, opts?: ApiRequestOptions<RP>): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(opts);

  try {
    return await axios.put<D>(url, buildRequestBody<RB>(body), config);
  } catch (error: unknown) {
    throw parseError(error);
  }
}

export async function apiDelete<D = unknown, RP extends RequestParams = RequestParams>(
  url: string,
  opts?: ApiRequestOptions<RP>,
): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(opts);

  try {
    return await axios.get<D>(url, config);
  } catch (error: unknown) {
    throw parseError(error);
  }
}

export interface ApiConfig {
  host?: string | null;
  apiKey?: string | null;
  locale?: string | null;
  bearerToken?: string | null;
}

export interface ApiContext extends ApiConfig {
  setHost(host?: string | null): void;
  setApiKey(apiKey?: string | null): void;
  setLocale(locale?: string | null): void;
  setBearerToken(bearerToken?: string | null): void;

  init(params: ApiConfig): void;
  init(
    host: string | null,
    key?: string | null,
    locale?: string | null,
    bearerToken?: string | null,
  ): void;

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

export interface Props extends ApiConfig {
  children?: ReactElement;
}

export function ApiProvider({
  children,
  host: _host,
  apiKey: _apiKey,
  locale: _locale,
  bearerToken: _bearerToken,
}: Props): ReactElement {
  const [host, setHost] = useState<string | null | undefined>(_host);
  const [apiKey, setApiKey] = useState<string | null | undefined>(_apiKey);
  const [locale, setLocale] = useState<string | null | undefined>(_locale);
  const [bearerToken, setBearerToken] = useState<string | null | undefined>(_bearerToken);

  const value = useMemo<ApiContext>(
    () => ({
      host,
      apiKey,
      locale,
      bearerToken,
      setHost,
      setApiKey,
      setLocale,
      setBearerToken,
      init: (
        configOrHost: ApiConfig | string | null,
        __apiKey?: string | null,
        __locale?: string | null,
        __bearerToken?: string | null,
      ) => {
        if (configOrHost && typeof configOrHost === 'object') {
          if (configOrHost.host !== undefined) {
            setHost(configOrHost.host);
          }
          if (configOrHost.apiKey !== undefined) {
            setApiKey(configOrHost.apiKey);
          }
          if (configOrHost.locale !== undefined) {
            setLocale(configOrHost.locale);
          }
          if (configOrHost.bearerToken !== undefined) {
            setBearerToken(configOrHost.bearerToken);
          }
        } else if (configOrHost !== undefined) {
          setHost(configOrHost);
        }
        if (__apiKey !== undefined) {
          setApiKey(__apiKey);
        }
        if (__locale !== undefined) {
          setLocale(__locale);
        }
        if (__bearerToken !== undefined) {
          setBearerToken(__bearerToken);
        }
      },
      get: (route: string, params?: RequestParams) =>
        apiGet(host + route, { apiKey, locale, bearerToken, params }),
      post: (route: string, body: RequestBody, params?: RequestParams) =>
        apiPost(host + route, body, { apiKey, locale, bearerToken, params }),
      put: (route: string, body: RequestBody, params?: RequestParams) =>
        apiPut(host + route, body, { apiKey, locale, bearerToken, params }),
      delete: (route: string, params?: RequestParams) =>
        apiDelete(host + route, { apiKey, locale, bearerToken, params }),
    }),
    [bearerToken, host, apiKey, locale],
  );

  return <apiContext.Provider value={value}>{children}</apiContext.Provider>;
}
