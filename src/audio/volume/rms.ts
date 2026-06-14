import { clamp } from '../../lib/math'

export const computeRms = (frame: Float32Array): number => {
  let sum = 0
  for (let i = 0; i < frame.length; i++) {
    const s = frame[i] ?? 0
    sum += s * s
  }
  return Math.sqrt(sum / frame.length)
}

const DBFS_MIN = -60
const DBFS_MAX = 0

export const rmsToNormalized = (rms: number): number => {
  if (rms <= 0) return 0
  const db = 20 * Math.log10(rms)
  return clamp((db - DBFS_MIN) / (DBFS_MAX - DBFS_MIN), 0, 1)
}

export class RmsSmoothed {
  private value = 0

  constructor(private readonly alpha = 0.2) {}

  update(frame: Float32Array): number {
    const rms = computeRms(frame)
    this.value = this.alpha * rms + (1 - this.alpha) * this.value
    return rmsToNormalized(this.value)
  }
}
