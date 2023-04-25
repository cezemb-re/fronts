import {
  FocusEventHandler,
  MouseEvent,
  ReactElement,
  ReactNode,
  forwardRef,
  ForwardedRef,
  HTMLAttributeAnchorTarget,
  HTMLAttributeReferrerPolicy,
} from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';

export interface WrapperProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => unknown;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  href?: string | UrlObject;
  rel?: string;
  target?: HTMLAttributeAnchorTarget;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  children?: ReactNode;
  className?: string;
}

export const Wrapper = forwardRef<
  HTMLAnchorElement | HTMLButtonElement | HTMLDivElement,
  WrapperProps
>(function Wrapper(
  {
    children,
    className,
    onClick,
    onFocus,
    onBlur,
    disabled,
    type,
    href,
    target,
    rel,
    referrerPolicy,
  }: WrapperProps,
  ref: ForwardedRef<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement>,
): ReactElement {
  if (onClick || type) {
    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={type || 'button'}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className={className}
        disabled={disabled}>
        {children}
      </button>
    );
  }
  if (href) {
    return (
      <Link
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        referrerPolicy={referrerPolicy}
        className={className}>
        {children}
      </Link>
    );
  }
  return (
    <div className={className} ref={ref as ForwardedRef<HTMLDivElement>}>
      {children}
    </div>
  );
});
