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

export type { ScriptStatus, UseScriptOptions };

export { useScript };
