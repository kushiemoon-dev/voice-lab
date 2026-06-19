import { describe, it, expect } from 'vitest'
import { estimateFormants, apertureNorm, brightnessNorm } from '../formants'

const SR = 48000
const BIN_COUNT = 2048
const HZ_PER_BIN = SR / (2 * BIN_COUNT) // ≈ 11.72 Hz/bin

function makeSyntheticSpectrum(peaks: { hz: number; db: number }[]): Float32Array {
  const freq = new Float32Array(BIN_COUNT).fill(-80)
  for (const { hz, db } of peaks) {
    const center = Math.round(hz / HZ_PER_BIN)
    for (let i = center - 8; i <= center + 8; i++) {
      if (i >= 0 && i < BIN_COUNT) {
        freq[i] = Math.max(freq[i]!, db - Math.abs(i - center) * 3)
      }
    }
  }
  return freq
}

describe('estimateFormants', () => {
  it('valid=false quand f0Hz est null', () => {
    const freq = makeSyntheticSpectrum([{ hz: 700, db: -10 }, { hz: 1800, db: -15 }])
    const r = estimateFormants(freq, SR, BIN_COUNT, null)
    expect(r.valid).toBe(false)
  })

  it('valid=false sur spectre silencieux', () => {
    const freq = new Float32Array(BIN_COUNT).fill(-80)
    const r = estimateFormants(freq, SR, BIN_COUNT, 150)
    expect(r.valid).toBe(false)
  })

  it('détecte F1 dans la bande [250–900 Hz]', () => {
    const freq = makeSyntheticSpectrum([{ hz: 700, db: -10 }, { hz: 1800, db: -15 }])
    const r = estimateFormants(freq, SR, BIN_COUNT, 150)
    expect(r.valid).toBe(true)
    expect(r.f1).toBeGreaterThanOrEqual(250)
    expect(r.f1).toBeLessThanOrEqual(900)
    expect(Math.abs(r.f1 - 700)).toBeLessThan(100)
  })

  it('détecte F2 dans la bande [900–2500 Hz]', () => {
    const freq = makeSyntheticSpectrum([{ hz: 700, db: -10 }, { hz: 1800, db: -15 }])
    const r = estimateFormants(freq, SR, BIN_COUNT, 150)
    expect(r.valid).toBe(true)
    expect(r.f2).toBeGreaterThanOrEqual(900)
    expect(r.f2).toBeLessThanOrEqual(2500)
    expect(Math.abs(r.f2 - 1800)).toBeLessThan(100)
  })
})

describe('apertureNorm', () => {
  it('0 à 250 Hz (bouche fermée)', () => {
    expect(apertureNorm(250)).toBe(0)
  })
  it('1 à 900 Hz (bouche ouverte)', () => {
    expect(apertureNorm(900)).toBe(1)
  })
  it('~0.5 à 575 Hz (mi-ouverte)', () => {
    expect(apertureNorm(575)).toBeCloseTo(0.5, 1)
  })
  it('clamp à 0 en dessous de 250 Hz', () => {
    expect(apertureNorm(100)).toBe(0)
  })
  it('clamp à 1 au dessus de 900 Hz', () => {
    expect(apertureNorm(1200)).toBe(1)
  })
})

describe('brightnessNorm', () => {
  it('0 à 900 Hz (sombre)', () => {
    expect(brightnessNorm(900)).toBe(0)
  })
  it('1 à 2500 Hz (clair)', () => {
    expect(brightnessNorm(2500)).toBe(1)
  })
  it('~0.5 à 1700 Hz (neutre)', () => {
    expect(brightnessNorm(1700)).toBeCloseTo(0.5, 1)
  })
})
