import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screenFromPath, pathForScreen, navigate, initRouter } from '../router'
import { createStore } from '../store'
import { initialState } from '../state'

describe('screenFromPath', () => {
  it('maps /app to tool', () => expect(screenFromPath('/app')).toBe('tool'))
  it('maps / to landing', () => expect(screenFromPath('/')).toBe('landing'))
  it('maps empty string to landing', () => expect(screenFromPath('')).toBe('landing'))
  it('maps unknown path to landing', () => expect(screenFromPath('/other')).toBe('landing'))
})

describe('pathForScreen', () => {
  it('tool returns /app', () => expect(pathForScreen('tool')).toBe('/app'))
  it('landing returns /', () => expect(pathForScreen('landing')).toBe('/'))
})

describe('navigate', () => {
  it('updates store screen to tool', () => {
    const store = createStore(initialState)
    navigate(store, 'tool')
    expect(store.getState().screen).toBe('tool')
  })

  it('updates store screen to landing', () => {
    const store = createStore(initialState)
    navigate(store, 'landing')
    expect(store.getState().screen).toBe('landing')
  })

  it('calls pushState with /app for tool', () => {
    vi.stubGlobal('location', { pathname: '/' })
    const spy = vi.spyOn(history, 'pushState')
    const store = createStore(initialState)
    navigate(store, 'tool')
    expect(spy).toHaveBeenCalledWith({ screen: 'tool' }, '', '/app')
    spy.mockRestore()
    vi.unstubAllGlobals()
  })

  it('skips pushState when already on the target path', () => {
    vi.stubGlobal('location', { pathname: '/' })
    const spy = vi.spyOn(history, 'pushState')
    const store = createStore(initialState)
    navigate(store, 'landing') // already at /
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
    vi.unstubAllGlobals()
  })
})

describe('initRouter', () => {
  afterEach(() => { vi.unstubAllGlobals() })

  it('sets initial screen from current pathname', () => {
    vi.stubGlobal('location', { pathname: '/' })
    const store = createStore(initialState)
    const cleanup = initRouter(store)
    expect(store.getState().screen).toBe('landing')
    cleanup()
  })

  it('sets initial screen to tool when path is /app', () => {
    vi.stubGlobal('location', { pathname: '/app' })
    const store = createStore(initialState)
    const cleanup = initRouter(store)
    expect(store.getState().screen).toBe('tool')
    cleanup()
  })

  it('updates store on popstate', () => {
    vi.stubGlobal('location', { pathname: '/' })
    const store = createStore(initialState)
    const cleanup = initRouter(store)
    vi.stubGlobal('location', { pathname: '/app' })
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(store.getState().screen).toBe('tool')
    cleanup()
  })

  it('cleanup removes popstate listener', () => {
    vi.stubGlobal('location', { pathname: '/' })
    const store = createStore(initialState)
    const cleanup = initRouter(store)
    cleanup()
    vi.stubGlobal('location', { pathname: '/app' })
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(store.getState().screen).toBe('landing') // unchanged
  })
})
