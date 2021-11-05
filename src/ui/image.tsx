import { ReactElement, useState, useEffect, useRef, CSSProperties, useCallback } from 'react';
import { Property } from 'csstype';
import Model from '../state/model';
import useMeasure, { Measure } from './measure';

export interface Dimension {
  width?: number;
  height?: number;
  ratio?: number;
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

export type AspectRatio =
  | 'cover'
  | 'fit'
  | 'square'
  | '5:4'
  | '4:3'
  | '3:2'
  | '16:10'
  | '16:9'
  | '1.85:1'
  | '2.35:1'
  | '2.76:1';

export type Orientation = 'landscape' | 'portrait';

export function resolveRatio(
  aspectRatio: AspectRatio,
  orientation: Orientation = 'landscape',
): number {
  let ratio;
  switch (aspectRatio) {
    case 'square':
      ratio = 1;
      break;
    case '5:4':
      ratio = 5 / 4;
      break;
    case '4:3':
      ratio = 4 / 3;
      break;
    case '3:2':
      ratio = 3 / 2;
      break;
    case '16:10':
      ratio = 16 / 10;
      break;
    case '16:9':
      ratio = 16 / 9;
      break;
    case '1.85:1':
      ratio = 1.85;
      break;
    case '2.35:1':
      ratio = 2.35;
      break;
    case '2.76:1':
      ratio = 2.76;
      break;
    default:
      ratio = 1;
      break;
  }
  return orientation === 'portrait' ? 1 / ratio : ratio;
}

export function calcHeight(
  width: number,
  aspectRatio: AspectRatio = 'square',
  orientation: Orientation = 'landscape',
): number {
  const ratio = resolveRatio(aspectRatio, orientation);
  return width / ratio;
}

export function calcWidth(
  height: number,
  aspectRatio: AspectRatio = 'square',
  orientation: Orientation = 'landscape',
): number {
  const ratio = resolveRatio(aspectRatio, orientation);
  return height * ratio;
}

export interface Props {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  aspectRatio?: AspectRatio;
  orientation?: Orientation;
  objectFit?: Property.ObjectFit;
  objectPosition?: Property.ObjectPosition;
  backgroundColor?: Property.BackgroundColor;
  placeholder?: boolean;
}

export default function Img({
  src,
  alt,
  width,
  height,
  aspectRatio = 'fit',
  orientation = 'landscape',
  objectFit = 'cover',
  objectPosition = 'center center',
  backgroundColor,
  placeholder,
}: Props): ReactElement | null {
  const imageDimension = useImageDimensions(src);

  const [style, setStyle] = useState<CSSProperties>({
    width,
    height,
    objectFit,
    objectPosition,
    backgroundColor,
  });

  const computeMeasure = useCallback(
    (measure: Measure) => {
      if (width && !height) {
        if (imageDimension && aspectRatio === 'fit') {
          setStyle((s) => ({
            ...s,
            height: measure.width / (imageDimension.ratio || 1),
          }));
        } else if (aspectRatio !== 'fit' && aspectRatio !== 'cover') {
          setStyle((s) => ({
            ...s,
            height: calcHeight(measure.width, aspectRatio, orientation),
          }));
        }
      } else if (height && !width) {
        if (imageDimension && aspectRatio === 'fit') {
          setStyle((s) => ({
            ...s,
            width: measure.height / (imageDimension.ratio || 1),
          }));
        } else if (aspectRatio !== 'fit' && aspectRatio !== 'cover') {
          setStyle((s) => ({
            ...s,
            width: calcWidth(measure.height, aspectRatio, orientation),
          }));
        }
      }
    },
    [aspectRatio, height, imageDimension, orientation, width],
  );

  const img = useRef<HTMLImageElement>(null);
  const imgMeasure = useMeasure<HTMLImageElement>(img);

  const div = useRef<HTMLDivElement>(null);
  const divMeasure = useMeasure<HTMLDivElement>(div);

  useEffect(() => {
    if (imgMeasure) {
      computeMeasure(imgMeasure);
    } else if (divMeasure) {
      computeMeasure(divMeasure);
    }
  }, [computeMeasure, divMeasure, imgMeasure]);

  if (src) {
    return <img ref={img} src={src} alt={alt} style={style} />;
  }

  if (placeholder) {
    return <div ref={div} style={style} />;
  }

  return null;
}
