import { createContext, ReactElement, ReactNode, useContext, useMemo } from 'react';
import { Screen, useScreen } from './ui';

export interface FrontState {
  screen?: Screen;
}

const Context = createContext<FrontState | undefined>(undefined);

export interface FrontProps {
  children?: ReactNode;
  defaultScreen?: Screen;
}

export function useFront(): FrontState {
  const front = useContext<FrontState | undefined>(Context);
  if (!front) {
    throw new Error('useFront() should be used inside <FrontContext> component');
  }
  return front;
}

export function Front({ children, defaultScreen }: FrontProps): ReactElement {
  const screen = useScreen();

  const value = useMemo<FrontState>(
    () => ({
      screen: screen || defaultScreen,
    }),
    [defaultScreen, screen],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
