import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { createContext, ReactElement, useContext, useMemo, useState } from 'react';

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

export interface ApiErrorPrototype<F extends FormErrors = FormErrors> {
  status?: number;
  code?: string;
  form_errors?: F;
  state?: Record<string, unknown>;
  message?: string;
}

export class ApiError<F extends FormErrors = FormErrors>
  extends Error
  implements ApiErrorPrototype
{
  status?: number;

  code?: string;

  form_errors?: F;

  state?: Record<string, unknown>;

  constructor(error: ApiErrorPrototype<F>) {
    super(error.message);

    this.status = error.status;
    this.code = error.code;
    this.form_errors = error.form_errors;
    this.state = error.state;
  }
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
  key?: string | null;
  bearerToken?: string | null;
  locale?: string | null;
  params?: RP;
}

export function buildRequestConfig<RP extends RequestParams = RequestParams>(
  opts?: ApiRequestOptions<RP>,
): AxiosRequestConfig {
  const headers: AxiosRequestHeaders = {};

  if (opts?.key) {
    headers['X-Api-Key'] = opts.key;
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

export async function apiGet<D = unknown, RP extends RequestParams = RequestParams>(
  url: string,
  opts?: ApiRequestOptions<RP>,
): Promise<AxiosResponse<D>> {
  const config = buildRequestConfig<RP>(opts);

  try {
    return await axios.get<D>(url, config);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const e = error as AxiosError<ApiErrorPrototype>;
      if (e.response?.data) {
        throw new ApiError(e.response.data);
      } else {
        throw new Error('Unknown error');
      }
    } else {
      throw error;
    }
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
    if (error && typeof error === 'object' && 'response' in error) {
      const e = error as AxiosError<ApiErrorPrototype>;
      if (e.response?.data) {
        throw new ApiError(e.response.data);
      } else {
        throw new Error('Unknown error');
      }
    } else {
      throw error;
    }
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
    if (error && typeof error === 'object' && 'response' in error) {
      const e = error as AxiosError<ApiErrorPrototype>;
      if (e.response?.data) {
        throw new ApiError(e.response.data);
      } else {
        throw new Error('Unknown error');
      }
    } else {
      throw error;
    }
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
    if (error && typeof error === 'object' && 'response' in error) {
      const e = error as AxiosError<ApiErrorPrototype>;
      if (e.response?.data) {
        throw new ApiError(e.response.data);
      } else {
        throw new Error('Unknown error');
      }
    } else {
      throw error;
    }
  }
}

export interface ApiParams {
  host?: string | null;
  key?: string | null;
  locale?: string | null;
  bearerToken?: string | null;
}

export interface ApiContext extends ApiParams {
  setHost(host?: string | null): void;
  setKey(key?: string | null): void;
  setLocale(locale?: string | null): void;
  setBearerToken(bearerToken?: string | null): void;

  init(params: ApiParams): void;
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

export interface Props extends ApiParams {
  children?: ReactElement;
}

export function ApiProvider({
  children,
  host: _host,
  key: _key,
  locale: _locale,
  bearerToken: _bearerToken,
}: Props): ReactElement {
  const [host, setHost] = useState<string | null | undefined>(_host);
  const [key, setKey] = useState<string | null | undefined>(_key);
  const [locale, setLocale] = useState<string | null | undefined>(_locale);
  const [bearerToken, setBearerToken] = useState<string | null | undefined>(_bearerToken);

  const value = useMemo<ApiContext>(
    () => ({
      host,
      key,
      locale,
      bearerToken,
      setHost,
      setKey,
      setLocale,
      setBearerToken,
      init: (
        paramsOrHost: ApiParams | string | null,
        __key?: string | null,
        __locale?: string | null,
        __bearerToken?: string | null,
      ) => {
        if (paramsOrHost && typeof paramsOrHost === 'object') {
          if (paramsOrHost.host !== undefined) {
            setHost(paramsOrHost.host);
          }
          if (paramsOrHost.key !== undefined) {
            setKey(paramsOrHost.key);
          }
          if (paramsOrHost.locale !== undefined) {
            setLocale(paramsOrHost.locale);
          }
          if (paramsOrHost.bearerToken !== undefined) {
            setBearerToken(paramsOrHost.bearerToken);
          }
        } else if (paramsOrHost !== undefined) {
          setHost(paramsOrHost);
        }
        if (__key !== undefined) {
          setKey(__key);
        }
        if (__locale !== undefined) {
          setLocale(__locale);
        }
        if (__bearerToken !== undefined) {
          setBearerToken(__bearerToken);
        }
      },
      get: (route: string, params?: RequestParams) =>
        apiGet(host + route, { key, locale, bearerToken, params }),
      post: (route: string, body: RequestBody, params?: RequestParams) =>
        apiPost(host + route, body, { key, locale, bearerToken, params }),
      put: (route: string, body: RequestBody, params?: RequestParams) =>
        apiPut(host + route, body, { key, locale, bearerToken, params }),
      delete: (route: string, params?: RequestParams) =>
        apiDelete(host + route, { key, locale, bearerToken, params }),
    }),
    [bearerToken, host, key, locale],
  );

  return <apiContext.Provider value={value}>{children}</apiContext.Provider>;
}
