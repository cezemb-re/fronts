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
  ApiListResponse,
} from './state/api';
import Model from './state/model';
import { doesEventTargetContainsElements, useClickOutside } from './ui/interactions';
import useDOMRect from './ui/domRect';
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
import Wrapper, { WrapperProps } from './ui/wrapper';
import { ModalsContext, useModals, Modal, ModalComponentProps, ModalsState } from './ui/modal';
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

export {
  env,
  createReducer,
  createApiReducer,
  createRequestBody,
  apiRequest,
  fetchApi,
  useApiRequest,
  useApi,
};

export type {
  Env,
  NativeEnv,
  DefaultState,
  Adapter,
  Action,
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
  Model,
  ApiListResponse,
};

/**
 * UI
 */

export {
  doesEventTargetContainsElements,
  useClickOutside,
  useDOMRect,
  useScrollProgress,
  useScrollThreshold,
  useScrollThresholds,
  BreakPoint,
  useBreakPoint,
  useImageDimensions,
  resolveRatio,
  calcHeight,
  calcWidth,
  Img,
  Wrapper,
  ModalsContext,
  useModals,
};

export type {
  Dimension,
  Image,
  Format,
  AspectRatio,
  Orientation,
  WrapperProps,
  Modal,
  ModalComponentProps,
  ModalsState,
};

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
