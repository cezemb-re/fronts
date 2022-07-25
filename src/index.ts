import './index.scss';
import { doesEventTargetContainsElements, useClickOutside } from './ui/interactions';
import useDOMRect from './ui/domRect';
import {
  Scroll,
  useElementScroll,
  useElementScrollProgressThreshold,
  useElementScrollProgressThresholds,
  useScroll,
  useScrollProgressThreshold,
  useScrollDistanceThreshold,
} from './ui/scroll';
import { BreakPoint, useScreen, useBreakPoint } from './ui/screens';
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
import FrontContext, { FrontState, useFront } from './front';

/**
 * UI
 */

export {
  doesEventTargetContainsElements,
  useClickOutside,
  useDOMRect,
  useElementScroll,
  useElementScrollProgressThreshold,
  useElementScrollProgressThresholds,
  useScroll,
  useScrollProgressThreshold,
  useScrollDistanceThreshold,
  BreakPoint,
  useBreakPoint,
  Wrapper,
  ModalsContext,
  useScreen,
  useModals,
};

export type {
  Scroll,
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

export type { ScriptStatus, UseScriptOptions };

export { useScript };

/**
 * Front
 */

export type { FrontState };

export { FrontContext, useFront };
