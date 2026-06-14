export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * clamp(t, 0, 1)

export const hzToMidi = (hz: number): number =>
  69 + 12 * Math.log2(hz / 440)

export const midiToHz = (midi: number): number =>
  440 * Math.pow(2, (midi - 69) / 12)

export const rmsToDbfs = (rms: number): number => {
  if (rms <= 0) return -Infinity
  return 20 * Math.log10(rms)
}

export const hzToLogY = (hz: number, minHz: number, maxHz: number, height: number): number => {
  const logMin = Math.log2(minHz)
  const logMax = Math.log2(maxHz)
  const logHz = Math.log2(clamp(hz, minHz, maxHz))
  const t = (logHz - logMin) / (logMax - logMin)
  return height * (1 - t)
}
