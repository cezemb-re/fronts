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
import { NavLink, To } from 'react-router-dom';

export interface WrapperProps {
  to?: To;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => unknown;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  href?: string;
  rel?: string | undefined;
  target?: HTMLAttributeAnchorTarget;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
}

export interface Props extends WrapperProps {
  children: ReactNode;
  className?: string;
}

export default forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement, Props>(
  function Wrapper(
    {
      children,
      className,
      to,
      onClick,
      onFocus,
      onBlur,
      disabled,
      type,
      href,
      target,
      rel,
      referrerPolicy,
    }: Props,
    ref: ForwardedRef<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement>,
  ): ReactElement {
    if (to) {
      return (
        <NavLink
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          to={to}
          className={className}
          target={target}
          rel={rel}
          referrerPolicy={referrerPolicy}>
          {children}
        </NavLink>
      );
    }
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
        <a
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          referrerPolicy={referrerPolicy}
          className={className}>
          {children}
        </a>
      );
    }
    return (
      <div className={className} ref={ref as ForwardedRef<HTMLDivElement>}>
        {children}
      </div>
    );
  },
);
