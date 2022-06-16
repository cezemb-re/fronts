import './index.scss';
import env, { Env, NativeEnv } from './state/env';
import {
  Model,
  PaginatedList,
  FormErrors,
  ApiErrorData,
  ApiError,
  isApiError,
  RequestBody,
  buildRequestBody,
  RequestParams,
  buildRequestConfig,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  ApiConfig,
  ApiContext,
  useApi,
  ApiProvider,
} from './state/api';
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
import {
  ModalsContext,
  useModals,
  Modal,
  ModalComponentProps,
  ModalsState,
  PushModalParams,
  PushModalFunction,
} from './ui/modal';
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

export { env };

export type { Env, NativeEnv };

export {
  buildRequestBody,
  buildRequestConfig,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  useApi,
  ApiProvider,
  isApiError,
};

export type {
  Model,
  PaginatedList,
  FormErrors,
  ApiErrorData,
  ApiError,
  RequestBody,
  RequestParams,
  ApiConfig,
  ApiContext,
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
  PushModalParams,
  PushModalFunction,
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
