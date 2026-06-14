import { describe, it, expect } from 'vitest'
import { clamp, lerp, hzToMidi, midiToHz, rmsToDbfs, hzToLogY } from '../math'

describe('clamp', () => {
  it('retourne min si valeur < min', () => expect(clamp(-5, 0, 10)).toBe(0))
  it('retourne max si valeur > max', () => expect(clamp(15, 0, 10)).toBe(10))
  it('retourne la valeur si dans la plage', () => expect(clamp(5, 0, 10)).toBe(5))
})

describe('lerp', () => {
  it('t=0 retourne a', () => expect(lerp(0, 100, 0)).toBe(0))
  it('t=1 retourne b', () => expect(lerp(0, 100, 1)).toBe(100))
  it('t=0.5 retourne milieu', () => expect(lerp(0, 100, 0.5)).toBe(50))
})

describe('hzToMidi / midiToHz', () => {
  it('A4 = 440 Hz = midi 69', () => expect(hzToMidi(440)).toBeCloseTo(69, 5))
  it('midi 69 = 440 Hz', () => expect(midiToHz(69)).toBeCloseTo(440, 5))
  it('aller-retour cohérent', () => expect(midiToHz(hzToMidi(220))).toBeCloseTo(220, 4))
})

describe('rmsToDbfs', () => {
  it('rms 0 retourne -Infinity', () => expect(rmsToDbfs(0)).toBe(-Infinity))
  it('rms 1 retourne 0 dB', () => expect(rmsToDbfs(1)).toBeCloseTo(0, 5))
  it('rms 0.5 ≈ -6 dB', () => expect(rmsToDbfs(0.5)).toBeCloseTo(-6.02, 1))
})

describe('hzToLogY', () => {
  it('minHz retourne height (bas du canvas)', () => expect(hzToLogY(60, 60, 500, 400)).toBeCloseTo(400, 1))
  it('maxHz retourne 0 (haut du canvas)', () => expect(hzToLogY(500, 60, 500, 400)).toBeCloseTo(0, 1))
  it('220 Hz est entre 0 et 400', () => {
    const y = hzToLogY(220, 60, 500, 400)
    expect(y).toBeGreaterThan(0)
    expect(y).toBeLessThan(400)
  })
})
