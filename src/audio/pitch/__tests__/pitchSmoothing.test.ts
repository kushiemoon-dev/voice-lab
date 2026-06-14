import { describe, it, expect } from 'vitest'
import { MedianSmoother, EmaSmoother } from '../pitchSmoothing'

describe('MedianSmoother', () => {
  it('retourne null si clarity sous le seuil', () => {
    const s = new MedianSmoother(5, 0.85)
    expect(s.push(220, 0.5)).toBeNull()
  })

  it('lisse les valeurs : retourne une médiane stable', () => {
    const s = new MedianSmoother(5, 0.85)
    ;[220, 218, 222, 219, 221].forEach(hz => s.push(hz, 0.95))
    const last = s.push(220, 0.95)
    expect(last).not.toBeNull()
    expect(last!).toBeGreaterThan(215)
    expect(last!).toBeLessThan(225)
  })

  it('rejette les valeurs hors plage 60–500 Hz', () => {
    const s = new MedianSmoother(3, 0.85)
    expect(s.push(50, 0.99)).toBeNull()
    expect(s.push(600, 0.99)).toBeNull()
  })

  it('reset vide la fenêtre', () => {
    const s = new MedianSmoother(3, 0.85)
    s.push(220, 0.99)
    s.push(220, 0.99)
    s.push(220, 0.99)
    s.reset()
    // après reset, une seule valeur ne suffit pas pour la médiane mais doit retourner cette valeur
    const result = s.push(220, 0.99)
    expect(result).toBe(220)
  })
})

describe('EmaSmoother', () => {
  it('premier échantillon = passthrough', () => {
    const e = new EmaSmoother(0.35)
    expect(e.update(200)).toBe(200)
  })

  it('converge vers valeur stable', () => {
    const e = new EmaSmoother(0.35)
    let v = 0
    for (let i = 0; i < 30; i++) v = e.update(200)
    expect(v).toBeGreaterThan(195)
    expect(v).toBeLessThanOrEqual(200)
  })

  it('reset repart de zéro (prochain update = passthrough)', () => {
    const e = new EmaSmoother(0.35)
    e.update(200)
    e.update(200)
    e.reset()
    expect(e.update(150)).toBe(150)
  })
})
