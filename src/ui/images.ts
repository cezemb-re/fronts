import { useState, useEffect } from 'react';
import Model from '../state/model';

export interface Dimension {
  width: number;
  height: number;
  ratio: number;
}

export type Format = 'png' | 'jpg' | 'gif' | 'unknown';

export interface Image extends Model, Dimension {
  format?: Format;
  url?: string;
  large_url?: string;
  medium_url?: string;
  small_url?: string;
  thumbnail_url?: string;
}

export function useImageDimensions(src: string | null | undefined): Dimension | undefined {
  const [dimensions, setDimensions] = useState<Dimension | undefined>(undefined);

  function onImageLoad(this: HTMLImageElement) {
    setDimensions({
      width: this.width,
      height: this.height,
      ratio: this.width / this.height,
    });
  }

  useEffect(() => {
    if (src) {
      const newImage = new Image();
      newImage.src = src;
      newImage.addEventListener('load', onImageLoad);
    }
  }, [src]);

  return dimensions;
}

export enum AspectRatio {
  COVER = 'cover',
  FIT = 'fit',
  SQUARE = 'square',
  AR5x4 = 'ar5x4',
  AR4x3 = 'ar3x4',
  AR3x2 = 'ar3x2',
  AR19x9 = 'ar16x9',
}

export enum Mode {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait',
}

export function resolveRatio(aspectRatio: AspectRatio, mode = Mode.LANDSCAPE): number {
  let ratio;
  switch (aspectRatio) {
    case AspectRatio.SQUARE:
      ratio = 1;
      break;
    case AspectRatio.AR5x4:
      ratio = 5 / 4;
      break;
    case AspectRatio.AR4x3:
      ratio = 4 / 3;
      break;
    case AspectRatio.AR3x2:
      ratio = 3 / 2;
      break;
    case AspectRatio.AR19x9:
      ratio = 16 / 9;
      break;
    default:
      ratio = 1;
      break;
  }
  return mode === Mode.PORTRAIT ? 1 / ratio : ratio;
}

export function calcHeight(
  width: number,
  aspectRatio = AspectRatio.SQUARE,
  mode = Mode.LANDSCAPE,
): number {
  const ratio = resolveRatio(aspectRatio, mode);
  return width / ratio;
}

export function calcWidth(
  height: number,
  aspectRatio = AspectRatio.SQUARE,
  mode = Mode.LANDSCAPE,
): number {
  const ratio = resolveRatio(aspectRatio, mode);
  return height * ratio;
}

export type PlaceholderCategory = 'any' | 'animals' | 'architecture' | 'nature' | 'people' | 'tech';

export function placeIMG(
  dimension: Dimension = { width: 600, height: 600, ratio: 1 },
  placeholderCategory: PlaceholderCategory = 'any',
): string {
  return `http://placeimg.com/${dimension.width}/${dimension.height}/${placeholderCategory}`;
}
