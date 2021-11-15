import './index.scss';
import env, { Env, NativeEnv } from './state/env';
import { DefaultState, Adapter, Action, createReducer } from './state/state';
import {
  FormErrors,
  ApiErrorPrototype,
  ApiError,
  ApiRequestState,
  ApiReducerState,
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
  RequestBody,
  RequestParams,
} from './state/api';
import Model from './state/model';
import useClickOutside from './ui/clickOutside';
import useMeasure, { Measure } from './ui/measure';
import { useScrollProgress, useScrollThreshold, useScrollThresholds } from './ui/scrollProgress';
import Img, {
  Dimension,
  Format,
  Image,
  useImageDimensions,
  AspectRatio,
  Orientation,
  resolveRatio,
  calcHeight,
  calcWidth,
} from './ui/image';
import { BreakPoint, useBreakPoint } from './ui/container';
import { formatRelativeDate, formatRelativeDateTime } from './adapters/time';
import useScript, { ScriptStatus, UseScriptOptions } from './utils/script';
import { GeoLocation, serializeGeoLocation, parseGeoLocation } from './utils/geoLocation';
import {
  useGoogleMapsApi,
  useAutocompleteService,
  PlacePredictionType,
  usePlacesService,
  usePlacePredictions,
  usePlaceDetails,
  usePlaceDetailsGetter,
} from './utils/googleMaps';
import Place from './utils/place';

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
  ApiReducerState,
  ApiModuleState,
  DefaultApiState,
  ApiAction,
  ApiRequestParams,
  FetchApiParams,
  UseApiRequestParams,
  RequestBody,
  RequestParams,
  HTTPMethod,
};

export { createApiReducer, createRequestBody, apiRequest, fetchApi, useApiRequest, useApi };

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

export { useImageDimensions, resolveRatio, calcHeight, calcWidth, Img };

export type { Format, AspectRatio, Orientation };

/**
 * Adapters
 */

export { formatRelativeDate, formatRelativeDateTime };

/**
 * Utils
 */

export {
  useScript,
  serializeGeoLocation,
  parseGeoLocation,
  usePlacesService,
  useGoogleMapsApi,
  useAutocompleteService,
  usePlacePredictions,
  usePlaceDetails,
  usePlaceDetailsGetter,
};

export type { ScriptStatus, UseScriptOptions, GeoLocation, Place, PlacePredictionType };
