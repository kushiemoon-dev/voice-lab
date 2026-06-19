import { describe, it, expect } from 'vitest'
import { VOICE_RANGES, MIN_DISPLAY_HZ, MAX_DISPLAY_HZ, getRangesForHz } from '../voiceRanges'

describe('VOICE_RANGES', () => {
  it('contient 3 plages', () => expect(VOICE_RANGES).toHaveLength(3))
  it('chaque plage a minHz < maxHz', () => {
    VOICE_RANGES.forEach(r => expect(r.minHz).toBeLessThan(r.maxHz))
  })
  it('toutes dans MIN..MAX', () => {
    VOICE_RANGES.forEach(r => {
      expect(r.minHz).toBeGreaterThanOrEqual(MIN_DISPLAY_HZ)
      expect(r.maxHz).toBeLessThanOrEqual(MAX_DISPLAY_HZ)
    })
  })
})

describe('getRangesForHz', () => {
  it('110 Hz → plage grave', () => {
    expect(getRangesForHz(110).map(r => r.id)).toContain('low')
  })
  it('220 Hz → plage médium', () => {
    expect(getRangesForHz(220).map(r => r.id)).toContain('mid')
  })
  it('1 Hz (hors plage) → tableau vide', () => {
    expect(getRangesForHz(1)).toHaveLength(0)
  })
})
