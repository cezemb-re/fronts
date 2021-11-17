import { useRef, useEffect } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { Action as ReduxAction, Dispatch, Reducer } from 'redux';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import env from './env';
import { Adapter } from './state';

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

export interface ApiRequestState<D = unknown, F extends FormErrors = FormErrors> {
  pending?: boolean;
  data?: D;
  error?: ApiError<F> | Error;
}

export type ApiReducerState = {
  [key: string]: ApiRequestState;
};

export type ApiModuleState = {
  [key: string]: ApiReducerState;
};

export type DefaultApiState = {
  [key: string]: ApiModuleState;
};

export interface ApiAction<
  S extends ApiReducerState = ApiReducerState,
  D = unknown,
  F extends FormErrors = FormErrors,
  P = D,
> extends ApiRequestState<D | P | null, F>,
    ReduxAction<keyof S> {
  reducer: string;
  adapter?: Adapter<D, P | null>;
}

export function createApiReducer<S extends ApiReducerState = ApiReducerState>(
  name: string,
  initialState: S,
): Reducer<S, ApiAction<S>> {
  return (state: S = initialState, action?: ApiAction<S>) => {
    if (!action || name !== action.reducer) {
      return state;
    }

    const nextState = {
      ...state,
      [action.type]: {
        ...state[action.type],
        pending: action.pending,
        error: action.error,
      },
    };

    if (action.data !== undefined) {
      nextState[action.type].data = action.adapter
        ? action.adapter(state[action.type].data, action.data)
        : action.data;
    }

    return nextState;
  };
}

export type RequestBody = { [key: string]: unknown };

export function createRequestBody<B extends RequestBody = RequestBody>(body: B): FormData {
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
      } else {
        formData.append(param, JSON.stringify(value));
      }
    }
  });

  return formData;
}

export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type RequestParams = { [key: string]: unknown };

export interface ApiRequestParams {
  route: string;
  method?: HTTPMethod;
  params?: RequestParams;
  bearer_token?: string;
  locale?: string;
  body?: RequestBody;
}

export async function apiRequest<P = unknown, F extends FormErrors = FormErrors>(
  params: ApiRequestParams,
): Promise<AxiosResponse<P>> {
  if (!env.API_HOST) {
    throw new Error('Missing API host.');
  }

  const headers: AxiosRequestHeaders = {};

  if (env.API_KEY) {
    headers['X-Api-Key'] = env.API_KEY;
  }

  if (params.locale) {
    headers['X-locale'] = params.locale;
  }

  if (params.bearer_token) {
    headers.Authorization = `Bearer ${params.bearer_token}`;
  }

  const config: AxiosRequestConfig = {
    headers,
  };

  if (params.params) {
    config.params = params.params;
  }

  try {
    switch (params.method) {
      case 'get':
        return await axios.get<P>(`${env.API_HOST}${params.route}`, config);

      case 'post':
        return await axios.post<P>(
          `${env.API_HOST}${params.route}`,
          params.body ? createRequestBody(params.body) : undefined,
          config,
        );

      case 'put':
        return await axios.put<P>(
          `${env.API_HOST}${params.route}`,
          params.body ? createRequestBody(params.body) : undefined,
          config,
        );

      case 'delete':
        return await axios.delete<P>(`${env.API_HOST}${params.route}`, config);

      default:
        return await axios.get<P>(`${env.API_HOST}${params.route}`, config);
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const e = error as AxiosError<ApiErrorPrototype<F>>;
      if (e.response?.data) {
        throw new ApiError<F>(e.response.data);
      } else {
        throw new Error('Unknown error');
      }
    } else {
      throw error;
    }
  }
}

export interface FetchApiParams<D = unknown, P = D> {
  reducer: string;
  type: string;
  route?: string;
  params?: RequestParams;
  bearer_token?: string;
  adapter?: Adapter<D, P | null>;
  block?: boolean;
  clear_data_on_error?: boolean;
}

export async function fetchApi<
  D = unknown,
  F extends FormErrors = FormErrors,
  S extends ApiReducerState = ApiReducerState,
  P = D,
>(dispatch: Dispatch<ApiAction<S, D, F, P>>, params: FetchApiParams<D, P>): Promise<P> {
  dispatch({ reducer: params.reducer, type: params.type, pending: true });

  try {
    const response = await apiRequest<P, F>({
      route: params.route || `/${params.type}`,
      bearer_token: params.bearer_token,
      params: params.params,
    });

    const data = response?.data;

    dispatch({
      reducer: params.reducer,
      type: params.type,
      data,
      adapter: params.adapter,
    });

    return data;
  } catch (error: unknown) {
    dispatch({
      reducer: params.reducer,
      type: params.type,
      error: error as ApiError<F>,
      data: params.clear_data_on_error ? null : undefined,
    });
    throw error;
  }
}

export interface UseApiRequestParams {
  reducer: string;
  type: string;
}

export function useApiRequest<
  D = unknown,
  F extends FormErrors = FormErrors,
  S extends DefaultApiState = DefaultApiState,
>(params: UseApiRequestParams): ApiRequestState<D, F> | undefined {
  return useSelector<S, ApiRequestState<D, F> | undefined>((state: S) => {
    const reducers = _.at<ApiModuleState>(state, [params.reducer]);

    if (
      reducers.length &&
      typeof reducers[0] === 'object' &&
      reducers[0] &&
      params.type in reducers[0]
    ) {
      return reducers[0][params.type];
    }

    return undefined;
  });
}

export function useApi<
  D = unknown,
  F extends FormErrors = FormErrors,
  S extends DefaultApiState = DefaultApiState,
  P = D,
>(
  dispatch: Dispatch<ApiAction<S, D, F, P>>,
  params: FetchApiParams<D, P>,
): ApiRequestState<D> | undefined {
  const touched = useRef<boolean>(false);
  const memoizedRoute = useRef<string | null | undefined>(params.route);
  const memoizedParams = useRef<RequestParams | null | undefined>(params.params);
  const memoizedBearerToken = useRef<string | null | undefined>(params.bearer_token);

  useEffect(() => {
    (async () => {
      if (
        !params.block &&
        (!touched.current ||
          !_.isEqual(memoizedRoute.current, params.route) ||
          !_.isEqual(memoizedParams.current, params.params) ||
          memoizedBearerToken.current !== params.bearer_token)
      ) {
        touched.current = true;
        memoizedRoute.current = params.route;
        memoizedParams.current = params.params;
        memoizedBearerToken.current = params.bearer_token;

        try {
          await fetchApi<D, F, S, P>(dispatch, params);
        } catch (error) {
          // ...
        }
      }
    })();
  }, [
    params.block,
    params.route,
    params.params,
    params.bearer_token,
    params.reducer,
    params.type,
    params.adapter,
    params,
    dispatch,
  ]);

  return useApiRequest<D, F, S>({
    reducer: params.reducer,
    type: params.type,
  });
}
