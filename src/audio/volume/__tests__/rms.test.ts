import { describe, it, expect } from 'vitest'
import { computeRms, rmsToNormalized } from '../rms'

describe('computeRms', () => {
  it('tableau de zéros → 0', () => {
    expect(computeRms(new Float32Array(1024))).toBe(0)
  })
  it('tableau de 1.0 → 1.0', () => {
    expect(computeRms(new Float32Array(512).fill(1))).toBeCloseTo(1, 5)
  })
  it('tableau de 0.5 → 0.5', () => {
    expect(computeRms(new Float32Array(512).fill(0.5))).toBeCloseTo(0.5, 5)
  })
})

describe('rmsToNormalized', () => {
  it('rms 0 → 0', () => expect(rmsToNormalized(0)).toBe(0))
  it('rms 1 → 1 (max)', () => expect(rmsToNormalized(1)).toBeCloseTo(1, 1))
  it('valeur entre 0 et 1 pour rms intermédiaire', () => {
    const v = rmsToNormalized(0.1)
    expect(v).toBeGreaterThan(0)
    expect(v).toBeLessThan(1)
  })
})
