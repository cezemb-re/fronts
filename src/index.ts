import './index.scss';
import env, { Env, NativeEnv } from './state/env';
import { DefaultState, Adapter, Action, createReducer } from './state/state';
import {
  FormErrors,
  ApiErrorPrototype,
  ApiError,
  ApiRequestState,
  ApiModuleState,
  DefaultApiState,
  ApiAction,
  createApiReducer,
  createRequestBody,
  HTTPMethod,
  ApiRequestParams,
  apiRequest,
  FetchApiParams,
  fetchApi,
  UseApiRequestParams,
  useApiRequest,
  useApi,
} from './state/api';
import Model from './state/model';
import useClickOutside from './ui/clickOutside';
import useMeasure, { Measure } from './ui/measure';
import { useScrollProgress, useScrollThreshold, useScrollThresholds } from './ui/scrollProgress';
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
import { BreakPoint, useBreakPoint } from './ui/container';
import { formatRelativeDate, formatRelativeDateTime } from './adapters/time';
import useScript, { ScriptStatus, UseScriptOptions } from './utils/script';

/**
 * State
 */

export type { Env, NativeEnv };

export { env };

export type { DefaultState, Adapter, Action };

export { createReducer };

export type {
  FormErrors,
  ApiErrorPrototype,
  ApiError,
  ApiRequestState,
  ApiModuleState,
  DefaultApiState,
  ApiAction,
  ApiRequestParams,
  FetchApiParams,
  UseApiRequestParams,
};

export {
  HTTPMethod,
  createApiReducer,
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

export { BreakPoint, useBreakPoint };

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

/**
 * Utils
 */

export { useScript };

export type { ScriptStatus, UseScriptOptions };
