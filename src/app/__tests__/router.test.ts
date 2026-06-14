import { describe, it, expect } from 'vitest'
import { screenFromPath, pathForScreen } from '../router'

describe('router', () => {
  it('maps /app to tool', () => {
    expect(screenFromPath('/app')).toBe('tool')
  })
  it('maps / to landing', () => {
    expect(screenFromPath('/')).toBe('landing')
  })
  it('maps empty string to landing', () => {
    expect(screenFromPath('')).toBe('landing')
  })
  it('maps unknown path to landing', () => {
    expect(screenFromPath('/other')).toBe('landing')
  })
  it('pathForScreen tool returns /app', () => {
    expect(pathForScreen('tool')).toBe('/app')
  })
  it('pathForScreen landing returns /', () => {
    expect(pathForScreen('landing')).toBe('/')
  })
})
