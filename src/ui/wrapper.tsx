import {
  FocusEventHandler,
  MouseEvent,
  ReactElement,
  ReactNode,
  forwardRef,
  ForwardedRef,
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
  target?: string;
}

export interface Props extends WrapperProps {
  children: ReactNode;
  className?: string;
}

export default forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(function Wrapper(
  {
    children,
    className,
    to,
    onClick,
    onFocus,
    onBlur,
    disabled,
    type = 'button',
    href,
    target,
  }: Props,
  ref: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
): ReactElement {
  if (to) {
    return (
      <NavLink ref={ref as ForwardedRef<HTMLAnchorElement>} to={to} className={className}>
        {children}
      </NavLink>
    );
  }
  if (onClick) {
    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={type}
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
        className={className}>
        {children}
      </a>
    );
  }
  return <div className={className}>{children}</div>;
});
