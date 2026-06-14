export interface VoiceQualityMetrics {
  readonly jitter: number | null   // % (0-10 typiquement)
  readonly shimmer: number | null  // % (0-20 typiquement)
  readonly hnr: number | null      // dB (-10 à 30 typiquement)
  readonly valid: boolean          // false si pas assez de signal
}

// Détecte les passages à zéro montants avec interpolation linéaire sub-sample.
// Impose un espacement minimal de 0.5 période — élimine les crossings parasites
// dus aux harmoniques/bruit. Retourne des positions fractionnaires (float samples).
function risingZeroCrossings(frame: Float32Array, f0Hz: number, sampleRate: number): number[] {
  const minSpacing = 0.5 * sampleRate / f0Hz
  const crossings: number[] = []
  let lastCrossing = -Infinity
  for (let i = 1; i < frame.length; i++) {
    const prev = frame[i - 1] ?? 0
    const curr = frame[i] ?? 0
    if (prev < 0 && curr >= 0) {
      // Interpolation linéaire : position exacte du crossing (< 1 sample d'erreur)
      const frac = prev / (prev - curr)   // proportion dans [i-1, i]
      const pos = (i - 1) + frac
      if (pos - lastCrossing >= minSpacing) {
        crossings.push(pos)
        lastCrossing = pos
      }
    }
  }
  return crossings
}

export function computeVoiceQuality(
  frame: Float32Array,
  f0Hz: number,
  sampleRate: number,
): VoiceQualityMetrics {
  const crossings = risingZeroCrossings(frame, f0Hz, sampleRate)
  if (crossings.length < 4) return { jitter: null, shimmer: null, hnr: null, valid: false }

  // --- Jitter ---
  const periods: number[] = []
  for (let i = 1; i < crossings.length; i++) {
    periods.push((crossings[i]! - crossings[i - 1]!) / sampleRate)
  }
  const meanPeriod = periods.reduce((a, b) => a + b, 0) / periods.length
  const jitterAbs = periods.slice(1).reduce((sum, p, i) => sum + Math.abs(p - periods[i]!), 0) / (periods.length - 1)
  const jitter = meanPeriod > 0 ? (jitterAbs / meanPeriod) * 100 : null

  // --- Shimmer ---
  const amplitudes: number[] = []
  for (let i = 0; i < crossings.length - 1; i++) {
    const start = Math.ceil(crossings[i]!)
    const end = Math.floor(crossings[i + 1]!)
    let peak = 0
    for (let j = start; j < end; j++) {
      const v = Math.abs(frame[j] ?? 0)
      if (v > peak) peak = v
    }
    amplitudes.push(peak)
  }
  const meanAmp = amplitudes.reduce((a, b) => a + b, 0) / amplitudes.length
  const shimmerAbs = amplitudes.slice(1).reduce((sum, a, i) => sum + Math.abs(a - amplitudes[i]!), 0) / (amplitudes.length - 1)
  const shimmer = meanAmp > 0.001 ? (shimmerAbs / meanAmp) * 100 : null

  // --- HNR (autocorrélation) ---
  // Formule : ac = rLag/r0 (coefficient d'autocorrélation normalisé)
  // HNR = 10*log10(ac/(1-ac)) — valeur élevée pour voix pures, null si signal trop faible.
  const lag = Math.round(sampleRate / f0Hz)
  let r0 = 0, rLag = 0
  const n = frame.length - lag
  for (let i = 0; i < n; i++) {
    r0   += (frame[i] ?? 0) * (frame[i] ?? 0)
    rLag += (frame[i] ?? 0) * (frame[i + lag] ?? 0)
  }
  let hnr: number | null = null
  if (r0 > 0 && rLag > 0) {
    const ac = Math.min(rLag / r0, 0.9999)
    hnr = 10 * Math.log10(ac / (1 - ac))
  }

  return {
    jitter:  jitter  !== null ? Math.round(jitter  * 100) / 100 : null,
    shimmer: shimmer !== null ? Math.round(shimmer * 100) / 100 : null,
    hnr:     hnr     !== null ? Math.round(hnr     * 10 ) / 10  : null,
    valid: true,
  }
}
