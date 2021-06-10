import env, { Env, NativeEnv } from './state/env';
import {
  AnyState,
  ModelState,
  ModuleState,
  State,
  Merger,
  Action,
  createReducer,
} from './state/state';
import {
  FormErrors,
  ApiErrorPrototype,
  ApiError,
  ApiRequest,
  ApiState,
  ApiAction,
  createApiReducer,
  initialApiRequest,
  createRequestBody,
  HTTPMethod,
  ApiRequestParams,
  apiRequest,
  FetchApiParams,
  fetchApi,
  UseApiRequestParams,
  useApiRequest,
  UseApiParams,
  useApi,
} from './state/api';
import Model from './state/model';
import useClickOutside from './ui/clickOutside';
import useMeasure, { Measure } from './ui/measure';
import {
  useScrollProgress,
  useScrollThreshold,
  useScrollThresholds,
} from './ui/scrollProgress';
import {
  Dimension,
  Format,
  Image,
  useImageDimensions,
  AspectRatio,
  Mode,
  resolveRatio,
  calcHeight,
  calcWidth,
  PlaceholderCategory,
  placeIMG,
} from './ui/images';
import { formatRelativeDate, formatRelativeDateTime } from './adapters/time';

/**
 * State
 */

export type { Env, NativeEnv };

export { env };

export type { AnyState, ModelState, ModuleState, State, Merger, Action };

export { createReducer };

export type {
  FormErrors,
  ApiErrorPrototype,
  ApiError,
  ApiRequest,
  ApiState,
  ApiAction,
  ApiRequestParams,
  FetchApiParams,
  UseApiRequestParams,
  UseApiParams,
};

export {
  HTTPMethod,
  createApiReducer,
  initialApiRequest,
  createRequestBody,
  apiRequest,
  fetchApi,
  useApiRequest,
  useApi,
};

export type { Model };

/**
 * UI
 */

export { useClickOutside };

export type { Measure };

export { useMeasure };

export { useScrollProgress, useScrollThreshold, useScrollThresholds };

export type { Dimension, Image };

export {
  useImageDimensions,
  resolveRatio,
  calcHeight,
  calcWidth,
  placeIMG,
  Format,
  AspectRatio,
  Mode,
  PlaceholderCategory,
};

/**
 * Adapters
 */

export { formatRelativeDate, formatRelativeDateTime };
