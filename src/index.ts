import './index.scss';
import { doesEventTargetContainsElements, useClickOutside } from './ui/interactions';
import useDOMRect from './ui/domRect';
import { useScrollProgress, useScrollThreshold, useScrollThresholds } from './ui/scrollProgress';
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
  Wrapper,
  ModalsContext,
  useModals,
};

export type {
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
