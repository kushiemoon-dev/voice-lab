import { describe, it, expect } from 'vitest'
import { computeVoiceQuality } from '../voiceQuality'

function sineWave(freqHz: number, sampleRate: number, durationS: number): Float32Array {
  const n = Math.floor(sampleRate * durationS)
  const frame = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    frame[i] = Math.sin(2 * Math.PI * freqHz * i / sampleRate)
  }
  return frame
}

function silence(n: number): Float32Array {
  return new Float32Array(n)
}

describe('computeVoiceQuality', () => {
  it('sinus pur → valid=true, jitter≈0, shimmer≈0, HNR élevé non-null', () => {
    const sr = 16000
    const f0 = 200
    const frame = sineWave(f0, sr, 0.5)
    const m = computeVoiceQuality(frame, f0, sr)

    expect(m.valid).toBe(true)
    expect(m.jitter).not.toBeNull()
    expect(m.shimmer).not.toBeNull()
    expect(m.hnr).not.toBeNull()

    expect(m.jitter!).toBeLessThan(1)      // jitter < 1% pour signal pur
    expect(m.shimmer!).toBeLessThan(1)     // shimmer < 1% pour signal pur
    expect(m.hnr!).toBeGreaterThan(20)     // HNR > 20 dB pour sinus pur (fix E1)
  })

  it('signal silence → valid=false', () => {
    const m = computeVoiceQuality(silence(512), 200, 16000)
    expect(m.valid).toBe(false)
  })

  it('signal trop court → valid=false', () => {
    const frame = sineWave(200, 16000, 0.001) // ~16 échantillons seulement
    const m = computeVoiceQuality(frame, 200, 16000)
    expect(m.valid).toBe(false)
  })

  it('HNR non-null pour voix pure (fix bug E1 — ancienne formule rLag < r0)', () => {
    // Pour un sinus parfait, rLag ≈ r0 → ancienne formule renvoyait null
    const frame = sineWave(150, 8000, 0.5)
    const m = computeVoiceQuality(frame, 150, 8000)
    expect(m.hnr).not.toBeNull()
    expect(m.hnr!).toBeGreaterThan(10)
  })
})
