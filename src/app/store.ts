export type Subscriber<S> = (state: Readonly<S>) => void

export interface Store<S extends object> {
  getState: () => Readonly<S>
  setState: (partial: Partial<S>) => void
  subscribe: (fn: Subscriber<S>) => () => void
}

export function createStore<S extends object>(initialState: S): Store<S> {
  let state: S = { ...initialState }
  const subscribers = new Set<Subscriber<S>>()

  return {
    getState: () => Object.freeze({ ...state }),
    setState: (partial) => {
      state = { ...state, ...partial }
      const frozen = Object.freeze({ ...state })
      for (const fn of subscribers) fn(frozen)
    },
    subscribe: (fn) => {
      subscribers.add(fn)
      return () => { subscribers.delete(fn) }
    },
  }
}
