import { FocusEventHandler, MouseEventHandler, ReactElement, ReactNode } from 'react';
import { NavLink, To } from 'react-router-dom';

export interface WrapperProps {
  to?: To;
  onClick?: MouseEventHandler<HTMLButtonElement>;
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

export default function Wrapper({
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
}: Props): ReactElement {
  if (to) {
    return (
      <NavLink to={to} className={className}>
        {children}
      </NavLink>
    );
  }
  if (onClick) {
    return (
      <button
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
      <a href={href} target={target} className={className}>
        {children}
      </a>
    );
  }
  return <div className={className}>{children}</div>;
}
