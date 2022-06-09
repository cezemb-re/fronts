import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import {
  createContext,
  ReactElement,
  useContext,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
} from 'react';

export interface Model {
  id: string;
  creation?: string;
  last_update?: string;
  [key: string]: unknown;
}

export type DataList<N extends string, D = unknown> = {
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
  bearer_token?: string | null;
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

  if (opts?.bearer_token) {
    headers.Authorization = `Bearer ${opts.bearer_token}`;
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
  bearer_token?: string | null;
}

export interface ApiContext extends ApiParams {
  setHost?(host: string): void;
  setKey?(key: string): void;
  setLocale?(locale: string): void;
  setBearerToken?(bearerToken: string): void;

  init?(params: ApiParams): void;
  init?(
    host: string | null,
    key?: string | null,
    locale?: string | null,
    bearerToken?: string | null,
  ): void;

  get?<D = unknown, RP extends RequestParams = RequestParams>(
    route: string,
    params?: RP,
  ): Promise<AxiosResponse<D>>;
  post?<
    D = unknown,
    RB extends RequestBody = RequestBody,
    RP extends RequestParams = RequestParams,
  >(
    route: string,
    body: RB,
    params?: RP,
  ): Promise<AxiosResponse<D>>;
  put?<D = unknown, RB extends RequestBody = RequestBody, RP extends RequestParams = RequestParams>(
    route: string,
    body: RB,
    params?: RP,
  ): Promise<AxiosResponse<D>>;
  delete?<D = unknown, RP extends RequestParams = RequestParams>(
    route: string,
    params?: RP,
  ): Promise<AxiosResponse<D>>;
}

const context = createContext<ApiContext>({});

export function useApi(): ApiContext {
  return useContext<ApiContext>(context);
}

export interface Props {
  children?: ReactElement;
}

// forwardRef(Form) as <F extends FormFields = FormFields, V = unknown>(
//   props: FormProps<F> & {
//     ref?: Ref<FormContext<F, V>>;
//   },
// ) => ReactElement;

export const ApiProvider = forwardRef(function ApiProvider(
  { children }: Props,
  ref: Ref<ApiContext>,
): ReactElement {
  const [host, setHost] = useState<string | null>();
  const [key, setKey] = useState<string | null>();
  const [locale, setLocale] = useState<string | null>();
  const [bearerToken, setBearerToken] = useState<string | null>();

  const value = useMemo<ApiContext>(
    () => ({
      host,
      key,
      locale,
      bearer_token: bearerToken,
      setHost,
      setKey,
      setLocale,
      setBearerToken,
      init: (
        paramsOrHost: ApiParams | string | null,
        _key?: string | null,
        _locale?: string | null,
        _bearerToken?: string | null,
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
          if (paramsOrHost.bearer_token !== undefined) {
            setBearerToken(paramsOrHost.bearer_token);
          }
        } else if (paramsOrHost !== undefined) {
          setHost(paramsOrHost);
        }
        if (_key !== undefined) {
          setKey(_key);
        }
        if (_locale !== undefined) {
          setLocale(_locale);
        }
        if (_bearerToken !== undefined) {
          setBearerToken(_bearerToken);
        }
      },
      get: (route: string, params?: RequestParams) =>
        apiGet(host + route, { key, locale, bearer_token: bearerToken, params }),
      post: (route: string, body: RequestBody, params?: RequestParams) =>
        apiPost(host + route, body, { key, locale, bearer_token: bearerToken, params }),
      put: (route: string, body: RequestBody, params?: RequestParams) =>
        apiPut(host + route, body, { key, locale, bearer_token: bearerToken, params }),
      delete: (route: string, params?: RequestParams) =>
        apiDelete(host + route, { key, locale, bearer_token: bearerToken, params }),
    }),
    [bearerToken, host, key, locale],
  );

  useImperativeHandle<ApiContext, ApiContext>(ref, () => value, [value]);

  return <context.Provider value={value}>{children}</context.Provider>;
});
