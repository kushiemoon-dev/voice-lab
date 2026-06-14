import { describe, it, expect } from 'vitest'
import { MODES } from '../modes'

describe('MODES', () => {
  it('contains 5 modes', () => expect(MODES).toHaveLength(5))
  it('all modes have non-empty labels', () => {
    MODES.forEach(m => expect(m.label.length).toBeGreaterThan(0))
  })
  it('all modes have an id', () => {
    MODES.forEach(m => expect(m.id).toBeTruthy())
  })
  it('pitch requires mic', () => {
    expect(MODES.find(m => m.id === 'pitch')?.requiresMic).toBe(true)
  })
  it('tones does not require mic', () => {
    expect(MODES.find(m => m.id === 'tones')?.requiresMic).toBe(false)
  })
  it('phrases does not require mic', () => {
    expect(MODES.find(m => m.id === 'phrases')?.requiresMic).toBe(false)
  })
  it('record requires mic', () => {
    expect(MODES.find(m => m.id === 'record')?.requiresMic).toBe(true)
  })
  it('labo requires mic', () => {
    expect(MODES.find(m => m.id === 'labo')?.requiresMic).toBe(true)
  })
})
