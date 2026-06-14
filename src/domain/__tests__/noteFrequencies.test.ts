import { describe, it, expect } from 'vitest'
import { NOTE_NAMES, hzToNoteName, NOTES } from '../noteFrequencies'

describe('NOTES', () => {
  it('A4 = 440 Hz', () => {
    const a4 = NOTES.find(n => n.name === 'A4')
    expect(a4?.hz).toBeCloseTo(440, 1)
  })
  it('chaque note a un Hz > 0', () => {
    NOTES.forEach(n => expect(n.hz).toBeGreaterThan(0))
  })
})

describe('hzToNoteName', () => {
  it('440 Hz → "A4"', () => expect(hzToNoteName(440)).toBe('A4'))
  it('261.6 Hz → "C4"', () => expect(hzToNoteName(261.6)).toBe('C4'))
})

describe('NOTE_NAMES', () => {
  it('contient C et A', () => {
    expect(NOTE_NAMES).toContain('C')
    expect(NOTE_NAMES).toContain('A')
  })
})
