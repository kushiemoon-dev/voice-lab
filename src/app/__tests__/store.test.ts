import { describe, it, expect, vi } from 'vitest'
import { createStore } from '../store'

describe('createStore', () => {
  it('getState retourne l\'état initial', () => {
    const store = createStore({ count: 0 })
    expect(store.getState().count).toBe(0)
  })
  it('setState met à jour l\'état', () => {
    const store = createStore({ count: 0 })
    store.setState({ count: 5 })
    expect(store.getState().count).toBe(5)
  })
  it('setState est immuable — ne mute pas l\'objet précédent', () => {
    const store = createStore({ count: 0 })
    const before = store.getState()
    store.setState({ count: 99 })
    expect(before.count).toBe(0)
  })
  it('subscribe est appelé à chaque setState', () => {
    const store = createStore({ x: 1 })
    const fn = vi.fn()
    store.subscribe(fn)
    store.setState({ x: 2 })
    store.setState({ x: 3 })
    expect(fn).toHaveBeenCalledTimes(2)
  })
  it('unsubscribe stoppe les notifications', () => {
    const store = createStore({ x: 1 })
    const fn = vi.fn()
    const unsub = store.subscribe(fn)
    unsub()
    store.setState({ x: 2 })
    expect(fn).not.toHaveBeenCalled()
  })
})
