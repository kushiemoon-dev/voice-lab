import { describe, it, expect } from 'vitest'
import { PitchStatsAccumulator } from '../pitchStats'

describe('PitchStatsAccumulator', () => {
  it('retourne count=0 / tout null à vide', () => {
    const acc = new PitchStatsAccumulator()
    const s = acc.getStats()
    expect(s.count).toBe(0)
    expect(s.minHz).toBeNull()
    expect(s.maxHz).toBeNull()
    expect(s.meanHz).toBeNull()
    expect(s.rangeHz).toBeNull()
    expect(s.targetPct).toBeNull()
    expect(s.dominantRange).toBeNull()
  })

  it('calcule min / max / mean / range en O(1)', () => {
    const acc = new PitchStatsAccumulator()
    acc.push(100)
    acc.push(200)
    acc.push(150)
    const s = acc.getStats()
    expect(s.count).toBe(3)
    expect(s.minHz).toBe(100)
    expect(s.maxHz).toBe(200)
    expect(s.meanHz).toBe(150)
    expect(s.rangeHz).toBe(100)
  })

  it('calcule targetPct correctement', () => {
    const acc = new PitchStatsAccumulator()
    acc.setTarget(100, 200)
    acc.push(150)  // in
    acc.push(250)  // out
    acc.push(175)  // in
    acc.push(50)   // out
    const s = acc.getStats()
    expect(s.targetPct).toBe(50)
  })

  it('targetPct null si pas de cible', () => {
    const acc = new PitchStatsAccumulator()
    acc.push(150)
    expect(acc.getStats().targetPct).toBeNull()
  })

  it('dominantRange identifie la plage la plus fréquente', () => {
    const acc = new PitchStatsAccumulator()
    // 150-250 Hz = plage médium (la plus fréquente ici)
    acc.push(180)
    acc.push(200)
    acc.push(220)
    // 60-150 Hz = plage grave
    acc.push(100)
    const s = acc.getStats()
    expect(s.dominantRange).toBeTruthy()
  })

  it('f0RangeSemitones nul à vide', () => {
    const acc = new PitchStatsAccumulator()
    expect(acc.getStats().f0RangeSemitones).toBeNull()
  })

  it('f0RangeSemitones ~ 12 demi-tons pour une octave', () => {
    const acc = new PitchStatsAccumulator()
    acc.push(220)   // A3
    acc.push(440)   // A4 — exactement 12 demi-tons plus haut
    const s = acc.getStats()
    expect(s.f0RangeSemitones).toBe(12)
  })

  it('f0RangeSemitones ~ 0 pour deux fréquences identiques', () => {
    const acc = new PitchStatsAccumulator()
    acc.push(300)
    acc.push(300)
    const s = acc.getStats()
    expect(s.f0RangeSemitones).toBe(0)
  })

  it('reset remet tout à zéro', () => {
    const acc = new PitchStatsAccumulator()
    acc.push(200)
    acc.push(300)
    acc.reset()
    const s = acc.getStats()
    expect(s.count).toBe(0)
    expect(s.minHz).toBeNull()
  })

  it('tient un grand volume sans crash (pas de spread)', () => {
    const acc = new PitchStatsAccumulator()
    for (let i = 0; i < 100_000; i++) {
      acc.push(150 + (i % 100))
    }
    const s = acc.getStats()
    expect(s.count).toBe(100_000)
    expect(s.minHz).toBe(150)
    expect(s.maxHz).toBe(249)
  })
})
