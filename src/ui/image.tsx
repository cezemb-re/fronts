import { ReactElement, useState, useEffect, useRef, CSSProperties } from 'react';
import { Property } from 'csstype';
import Model from '../state/model';
import useMeasure from './measure';

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

export type Mode = 'landscape' | 'portrait';

export function resolveRatio(aspectRatio: AspectRatio, mode: Mode = 'landscape'): number {
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
  return mode === 'portrait' ? 1 / ratio : ratio;
}

export function calcHeight(
  width: number,
  aspectRatio: AspectRatio = 'square',
  mode: Mode = 'landscape',
): number {
  const ratio = resolveRatio(aspectRatio, mode);
  return width / ratio;
}

export function calcWidth(
  height: number,
  aspectRatio: AspectRatio = 'square',
  mode: Mode = 'landscape',
): number {
  const ratio = resolveRatio(aspectRatio, mode);
  return height * ratio;
}

export function getPlaceholderUrl(dimension: Dimension, color?: string): string {
  return `https://via.placeholder.com/${dimension.width || 800}${
    dimension.height ? `x${dimension.height}` : ''
  }.png${color ? `/${color}` : ''}`;
}

export interface Props {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  aspectRatio?: AspectRatio;
  mode?: Mode;
  placeholder?: boolean;
  borderRadius?: number;
  objectFit?: Property.ObjectFit;
  objectPosition?: Property.ObjectPosition;
}

export default function Img({
  src,
  alt,
  width,
  height,
  aspectRatio = 'fit',
  mode = 'landscape',
  placeholder = false,
  objectFit = 'cover',
  objectPosition = 'center center',
}: Props): ReactElement {
  let trueSrc = src;

  if (!trueSrc && placeholder) {
    trueSrc = getPlaceholderUrl({
      width: typeof width === 'number' ? width : undefined,
      height: typeof height === 'number' ? height : undefined,
    });
  }

  const [style, setStyle] = useState<CSSProperties>({
    width,
    height,
    objectFit,
    objectPosition,
  });

  const element = useRef<HTMLImageElement>(null);
  const measure = useMeasure<HTMLImageElement>(element);
  const image = useImageDimensions(trueSrc);

  useEffect(() => {
    if (image && measure) {
      if (width && !height) {
        if (aspectRatio === 'fit') {
          setStyle((s) => ({
            ...s,
            height: measure.width / (image.ratio || 1),
          }));
        } else if (aspectRatio !== 'cover') {
          setStyle((s) => ({
            ...s,
            height: calcHeight(measure.width, aspectRatio, mode),
          }));
        }
      } else if (height && !width) {
        if (aspectRatio === 'fit') {
          setStyle((s) => ({
            ...s,
            width: measure.height / (image.ratio || 1),
          }));
        } else if (aspectRatio !== 'cover') {
          setStyle((s) => ({
            ...s,
            width: calcWidth(measure.height, aspectRatio, mode),
          }));
        }
      }
    }
  }, [aspectRatio, height, image, measure, mode, width]);

  return <img ref={element} src={trueSrc} alt={alt} style={style} />;
}
