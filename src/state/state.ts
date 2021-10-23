import { Action as ReduxAction, Reducer } from 'redux';

export interface DefaultState {
  [key: string]: unknown;
}

export type Adapter<S = unknown, P = unknown> = (state: S, payload: P) => S;

export interface Action<S extends DefaultState = DefaultState, P = unknown>
  extends ReduxAction<keyof S> {
  reducer: string;
  payload: P;
  adapter?: Adapter<P, P>;
}

export function createReducer<S extends DefaultState = DefaultState>(
  name: string,
  initialState: S,
): Reducer<S, Action<S>> {
  return (state: S = initialState, action: Action<S>) => {
    if (action.reducer !== name || typeof state !== 'object' || !state || !(action.type in state)) {
      return state;
    }

    return {
      ...state,
      [action.type]: action.adapter
        ? action.adapter(state[action.type], action.payload)
        : action.payload,
    };
  };
}
