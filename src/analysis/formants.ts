const SILENCE_DB = -55
const SMOOTH_RADIUS = 3

function smoothEnvelope(src: Float32Array): Float32Array {
  const out = new Float32Array(src.length)
  const n = src.length
  for (let i = 0; i < n; i++) {
    const lo = Math.max(0, i - SMOOTH_RADIUS)
    const hi = Math.min(n - 1, i + SMOOTH_RADIUS)
    let sum = 0
    for (let j = lo; j <= hi; j++) sum += src[j]!
    out[i] = sum / (hi - lo + 1)
  }
  return out
}

function peakBin(data: Float32Array, lo: number, hi: number): number {
  let best = lo
  let bestVal = -Infinity
  for (let i = lo; i <= hi; i++) {
    if (data[i]! > bestVal) { bestVal = data[i]!; best = i }
  }
  return best
}

export interface Formants {
  readonly f1: number
  readonly f2: number
  readonly valid: boolean
}

export function estimateFormants(
  freqDb: Float32Array,
  sampleRate: number,
  binCount: number,
  f0Hz: number | null,
): Formants {
  if (f0Hz === null) return { f1: 0, f2: 0, valid: false }

  const hzPerBin = sampleRate / (2 * binCount)

  let maxDb = -Infinity
  for (const v of freqDb) { if (v > maxDb) maxDb = v }
  if (maxDb < SILENCE_DB) return { f1: 0, f2: 0, valid: false }

  const smoothed = smoothEnvelope(freqDb)

  const f1Lo = Math.max(0, Math.round(250 / hzPerBin))
  const f1Hi = Math.min(binCount - 1, Math.round(900 / hzPerBin))
  const f2Lo = Math.max(0, Math.round(900 / hzPerBin))
  const f2Hi = Math.min(binCount - 1, Math.round(2500 / hzPerBin))

  const f1 = peakBin(smoothed, f1Lo, f1Hi) * hzPerBin
  const f2 = peakBin(smoothed, f2Lo, f2Hi) * hzPerBin

  return { f1, f2, valid: true }
}

// F1 ↔ ouverture de bouche : 250 Hz (fermée) → 900 Hz (ouverte)
export function apertureNorm(f1: number): number {
  return Math.max(0, Math.min(1, (f1 - 250) / (900 - 250)))
}

// F2 ↔ résonance claire/sombre : 900 Hz (sombre) → 2500 Hz (clair)
export function brightnessNorm(f2: number): number {
  return Math.max(0, Math.min(1, (f2 - 900) / (2500 - 900)))
}
