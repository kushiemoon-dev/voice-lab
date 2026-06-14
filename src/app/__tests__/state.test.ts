import { describe, it, expect } from 'vitest'
import { initialState } from '../state'

describe('initialState', () => {
  it('mic starts idle', () => expect(initialState.micStatus).toBe('idle'))
  it('mic error starts null', () => expect(initialState.micError).toBeNull())
  it('active mode starts on pitch', () => expect(initialState.activeMode).toBe('pitch'))
  it('screen starts on landing', () => expect(initialState.screen).toBe('landing'))
  it('sample rate is a positive number', () => expect(initialState.sampleRate).toBeGreaterThan(0))
})
