import { describe, it, expect } from 'vitest'
import { VolumeStatsAccumulator } from '../volumeStats'

describe('VolumeStatsAccumulator', () => {
  it('retourne count=0 / tout null à vide', () => {
    const acc = new VolumeStatsAccumulator()
    const s = acc.getStats()
    expect(s.count).toBe(0)
    expect(s.mean).toBeNull()
    expect(s.min).toBeNull()
    expect(s.max).toBeNull()
  })

  it('calcule mean / min / max correctement', () => {
    const acc = new VolumeStatsAccumulator()
    acc.push(0.2)
    acc.push(0.4)
    acc.push(0.6)
    const s = acc.getStats()
    expect(s.count).toBe(3)
    expect(s.min).toBeCloseTo(0.2)
    expect(s.max).toBeCloseTo(0.6)
    expect(s.mean).toBeCloseTo(0.4)
  })

  it('gère une valeur unique', () => {
    const acc = new VolumeStatsAccumulator()
    acc.push(0.5)
    const s = acc.getStats()
    expect(s.count).toBe(1)
    expect(s.min).toBe(0.5)
    expect(s.max).toBe(0.5)
    expect(s.mean).toBe(0.5)
  })

  it('reset remet tout à zéro', () => {
    const acc = new VolumeStatsAccumulator()
    acc.push(0.8)
    acc.reset()
    const s = acc.getStats()
    expect(s.count).toBe(0)
    expect(s.mean).toBeNull()
  })
})
