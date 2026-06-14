export interface Harmonic {
  readonly n: number
  readonly hz: number
  readonly amplitude: number
}

export function extractHarmonics(
  freqData: Float32Array,
  f0Hz: number,
  sampleRate: number,
  binCount: number,
  maxHarmonics = 8,
): Harmonic[] {
  const nyquist = sampleRate / 2
  const hzPerBin = nyquist / binCount

  const harmonics: Harmonic[] = []
  for (let n = 1; n <= maxHarmonics; n++) {
    const targetHz = n * f0Hz
    if (targetHz > nyquist) break

    const bin = Math.round(targetHz / hzPerBin)
    let peakBin = bin
    let peakDb = -Infinity
    for (let b = Math.max(0, bin - 3); b <= Math.min(binCount - 1, bin + 3); b++) {
      const db = freqData[b] ?? -100
      if (db > peakDb) { peakDb = db; peakBin = b }
    }

    const hz = peakBin * hzPerBin
    const amplitude = Math.max(0, Math.min(1, (peakDb + 90) / 90))
    harmonics.push({ n, hz, amplitude })
  }
  return harmonics
}
