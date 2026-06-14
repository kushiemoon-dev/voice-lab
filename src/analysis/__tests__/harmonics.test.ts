import { describe, it, expect } from 'vitest'
import { extractHarmonics } from '../harmonics'

/** Crée un freqData factice avec un pic de `peakDb` à chaque harmonique de f0Hz. */
function fakeFreqData(
  f0Hz: number,
  sampleRate: number,
  binCount: number,
  maxHarmonics: number,
  peakDb = -20,
  noiseFloor = -90,
): Float32Array {
  const nyquist = sampleRate / 2
  const hzPerBin = nyquist / binCount
  const data = new Float32Array(binCount).fill(noiseFloor)
  for (let n = 1; n <= maxHarmonics; n++) {
    const targetHz = n * f0Hz
    if (targetHz > nyquist) break
    const bin = Math.round(targetHz / hzPerBin)
    if (bin < binCount) data[bin] = peakDb
  }
  return data
}

describe('extractHarmonics', () => {
  const SR = 44100
  const BINS = 2048
  const F0 = 200

  it('détecte les harmoniques aux bons Hz (±hzPerBin)', () => {
    const nyquist = SR / 2
    const hzPerBin = nyquist / BINS
    const freqData = fakeFreqData(F0, SR, BINS, 8)
    const harmonics = extractHarmonics(freqData, F0, SR, BINS)

    expect(harmonics.length).toBeGreaterThan(0)
    for (const h of harmonics) {
      const expectedHz = h.n * F0
      expect(h.hz).toBeCloseTo(expectedHz, -Math.log10(hzPerBin * 4))
    }
  })

  it('amplitude normalisée dans [0, 1]', () => {
    const freqData = fakeFreqData(F0, SR, BINS, 8)
    const harmonics = extractHarmonics(freqData, F0, SR, BINS)

    for (const h of harmonics) {
      expect(h.amplitude).toBeGreaterThanOrEqual(0)
      expect(h.amplitude).toBeLessThanOrEqual(1)
    }
  })

  it('harmoniques détectées en ordre (n=1, 2, 3…)', () => {
    const freqData = fakeFreqData(F0, SR, BINS, 6)
    const harmonics = extractHarmonics(freqData, F0, SR, BINS, 6)

    harmonics.forEach((h, i) => {
      expect(h.n).toBe(i + 1)
    })
  })

  it('respecte maxHarmonics', () => {
    const freqData = fakeFreqData(F0, SR, BINS, 8)
    const harmonics = extractHarmonics(freqData, F0, SR, BINS, 3)
    expect(harmonics.length).toBeLessThanOrEqual(3)
  })

  it('s\'arrête à la fréquence de Nyquist', () => {
    const freqData = fakeFreqData(F0, SR, BINS, 100)
    const harmonics = extractHarmonics(freqData, F0, SR, BINS, 100)
    for (const h of harmonics) {
      expect(h.hz).toBeLessThanOrEqual(SR / 2)
    }
  })
})
