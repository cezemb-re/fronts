import { useRef, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Action as ReduxAction, Dispatch, Reducer } from 'redux';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import env from './env';
import { Merger, ModelState } from './state';

export type FormErrors<E extends keyof any = keyof any> = Partial<
  Record<'form' | E, string>
>;

export interface ApiErrorPrototype<E extends keyof any = keyof any> {
  code: string;
  status: number;
  form_errors?: FormErrors<E>;
  state: any;
}

export class ApiError<E extends keyof any = keyof any> extends Error
  implements ApiErrorPrototype<E> {
  code: string;

  status: number;

  form_errors?: FormErrors<E>;

  state: any;

  constructor(error: ApiErrorPrototype<E> & Error) {
    super(error.message);
    this.code = error.code;
    this.status = error.status;
    this.form_errors = error.form_errors;
  }
}

export interface ApiRequest<D = any, E extends keyof any = keyof any> {
  pending?: boolean;
  data?: D;
  error?: ApiError<E> | Error;
}

export type ApiState<D = any, E extends keyof any = any> = Record<
  keyof any,
  ApiRequest<D, E>
>;

export interface ApiAction<
  S extends ApiState = ApiState,
  D = any,
  E extends keyof any = keyof any
> extends ApiRequest<D, E>, ReduxAction<string> {
  reducer: string;
  merger?: Merger<S, D>;
}

export function createApiReducer<S extends ApiState = ApiState, D = any>(
  name: string,
  initialState: S
): Reducer<S, ApiAction<S, D>> {
  return (state: S = initialState, action: ApiAction<S, D>) => {
    if (name !== action.reducer) {
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

    if (action.data) {
      nextState[action.type].data =
        'merger' in action && action.merger
          ? action.merger(state[action.type].data, action.data)
          : action.data;
    }

    return nextState;
  };
}

export const initialApiRequest: ApiRequest = {
  pending: false,
};

export function createRequestBody(body: Record<any, any>): FormData {
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

export enum HTTPMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export interface ApiRequestParams {
  route: string;
  method?: HTTPMethod;
  params?: Record<keyof any, any>;
  bearer_token?: string;
  locale?: string;
  body?: Record<keyof any, any>;
}

export async function apiRequest<D = any>(
  params: ApiRequestParams
): Promise<AxiosResponse<D>> {
  const config: AxiosRequestConfig = {
    headers: {
      'X-Api-Key': env.API_KEY,
    },
  };

  if (params) {
    if ('locale' in params && params.locale !== undefined) {
      config.headers['X-locale'] = params.locale;
    }

    if ('bearer_token' in params && params.bearer_token !== undefined) {
      config.headers.Authorization = `Bearer ${params.bearer_token}`;
    }

    if ('params' in params && params.params !== undefined) {
      config.params = params.params;
    }
  }

  try {
    switch (params.method) {
      default:
      case HTTPMethod.GET:
        return await axios.get<D>(`${env.API_HOST}${params.route}`, config);

      case HTTPMethod.POST:
        return await axios.post<D>(
          `${env.API_HOST}${params.route}`,
          'body' in params && params.body
            ? createRequestBody(params.body)
            : null,
          config
        );

      case HTTPMethod.PUT:
        return await axios.put<D>(
          `${env.API_HOST}${params.route}`,
          'body' in params && params.body
            ? createRequestBody(params.body)
            : null,
          config
        );

      case HTTPMethod.DELETE:
        return await axios.delete<D>(`${env.API_HOST}${params.route}`, config);
    }
  } catch (error) {
    throw error.response ? new ApiError(error.response.data) : error;
  }
}

export interface FetchApiParams<S extends ApiState = ApiState, D = any> {
  reducer: string;
  type: string;
  route?: string;
  params?: Record<any, any>;
  bearer_token?: string;
  merger?: Merger<S, D>;
  block?: boolean;
}

export async function fetchApi<
  D = any,
  E extends keyof any = keyof any,
  S extends ApiState<D, E> = ApiState<D, E>
>(
  dispatch: Dispatch<ApiAction<S, D, E>>,
  params: FetchApiParams<S, D>
): Promise<D> {
  dispatch({ reducer: params.reducer, type: params.type, pending: true });

  try {
    const response = await apiRequest<D>({
      route: params.route || `/${params.type}`,
      bearer_token: params.bearer_token,
      params: params.params,
    });

    const data = response?.data;

    dispatch({
      reducer: params.reducer,
      type: params.type,
      data,
      merger: params.merger,
    });

    return data;
  } catch (error) {
    dispatch({ reducer: params.reducer, type: params.type, error });
    throw error;
  }
}

export interface UseApiRequestParams {
  reducer: string;
  type: string;
}

export function useApiRequest<
  D = any,
  E extends keyof any = keyof any,
  S extends ApiState<D, E> = ApiState<D, E>
>(params: UseApiRequestParams): ApiRequest<D, E> | undefined {
  return useSelector<S, ApiRequest<D, E>>((state: S) => {
    const reducer = _.at<ModelState>(state, [params.reducer]);

    if (
      reducer.length &&
      typeof reducer[0] === 'object' &&
      reducer[0] &&
      params.type in reducer[0]
    ) {
      return reducer[0][params.type];
    }

    return undefined;
  });
}

export interface UseApiParams<S extends ApiState = ApiState, D = any> {
  reducer: string;
  type: string;
  route?: string;
  params?: Record<keyof any, any>;
  bearer_token?: string;
  merger?: Merger<S, D>;
  block?: boolean;
}

export function useApi<
  D = any,
  E extends keyof any = keyof any,
  S extends ApiState<D, E> = ApiState<D, E>
>(
  dispatch: Dispatch<ApiAction<S, D, E>>,
  params: UseApiParams<S, D>
): ApiRequest<D, E> | undefined {
  const touched = useRef<boolean>(false);
  const memoizedRoute = useRef<string | null | undefined>(params.route);
  const memoizedParams = useRef<Record<any, any> | null | undefined>(
    params.params
  );
  const memoizedBearerToken = useRef<string | null | undefined>(
    params.bearer_token
  );

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
          await fetchApi(dispatch, params);
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
    params.merger,
    params,
    dispatch,
  ]);

  return useApiRequest<D, E, S>({
    reducer: params.reducer,
    type: params.type,
  });
}
