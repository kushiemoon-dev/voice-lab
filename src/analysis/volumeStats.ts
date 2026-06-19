export interface VolumeStats {
  readonly count: number
  readonly mean: number | null
  readonly min: number | null
  readonly max: number | null
}

export class VolumeStatsAccumulator {
  private count = 0
  private sum = 0
  private min = Infinity
  private max = -Infinity

  push(normalized: number): void {
    this.count++
    this.sum += normalized
    if (normalized < this.min) this.min = normalized
    if (normalized > this.max) this.max = normalized
  }

  getStats(): VolumeStats {
    if (this.count === 0) {
      return { count: 0, mean: null, min: null, max: null }
    }
    return {
      count: this.count,
      mean: this.sum / this.count,
      min: this.min,
      max: this.max,
    }
  }

  reset(): void {
    this.count = 0
    this.sum = 0
    this.min = Infinity
    this.max = -Infinity
  }
}
