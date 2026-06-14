import { describe, it, expect } from 'vitest'
import { PHRASES, THEMES, THEME_LABELS, getPhrasesByTheme, getRandomPhrase } from '../phrases'

describe('phrases domain', () => {
  it('every theme has at least 50 phrases', () => {
    for (const theme of THEMES) {
      const count = getPhrasesByTheme(theme).length
      expect(count, `theme "${theme}" has only ${count} phrases`).toBeGreaterThanOrEqual(50)
    }
  })

  it('all phrase ids are unique', () => {
    const ids = PHRASES.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('every phrase.theme is a valid THEME_LABELS key', () => {
    for (const phrase of PHRASES) {
      expect(Object.keys(THEME_LABELS)).toContain(phrase.theme)
    }
  })

  it('getRandomPhrase returns a phrase from the requested theme', () => {
    for (const theme of THEMES) {
      const phrase = getRandomPhrase(undefined, theme)
      expect(phrase.theme).toBe(theme)
    }
  })

  it('THEMES matches THEME_LABELS keys', () => {
    expect(THEMES).toEqual(Object.keys(THEME_LABELS))
  })
})
