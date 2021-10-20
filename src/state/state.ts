import { Action as ReduxAction, Reducer } from 'redux';

export type AnyState<K extends keyof any = keyof any> = Record<K, any>;

export type ModelState<K extends keyof any = keyof any> = Record<K, AnyState>;

export type Merger<S extends AnyState = AnyState, P = any> = (state: S, payload: P) => S;

export interface Action<S extends AnyState = AnyState, P = any> extends ReduxAction<string> {
  reducer: string;
  payload: P;
  merger?: Merger<S, P>;
}

export function createReducer<S extends AnyState = AnyState, P = any>(
  name: string,
  initialState: S,
): Reducer<S, Action<S, P>> {
  return (state: S = initialState, action: Action<S, P>) => {
    if (action.reducer !== name || typeof state !== 'object' || !state || !(action.type in state)) {
      return state;
    }

    return {
      ...state,
      [action.type]:
        'merger' in action && action.merger
          ? action.merger(state[action.type], action.payload)
          : action.payload,
    };
  };
}
