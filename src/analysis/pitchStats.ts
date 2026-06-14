import { VOICE_RANGES } from '../domain/voiceRanges'

export interface PitchStats {
  readonly count: number
  readonly minHz: number | null
  readonly maxHz: number | null
  readonly meanHz: number | null
  readonly rangeHz: number | null
  readonly targetPct: number | null
  readonly dominantRange: string | null
}

export class PitchStatsAccumulator {
  // O(1) accumulators — no unbounded array; safe on long sessions
  private count = 0
  private sum = 0
  private min = Infinity
  private max = -Infinity
  // inTargetCount: counted vs target active at push time (doesn't backfill on setTarget)
  private inTargetCount = 0
  private targetMin: number | null = null
  private targetMax: number | null = null
  private readonly rangeCounts = new Map<string, number>()

  setTarget(minHz: number | null, maxHz: number | null): void {
    this.targetMin = minHz
    this.targetMax = maxHz
  }

  push(hz: number): void {
    this.count++
    this.sum += hz
    if (hz < this.min) this.min = hz
    if (hz > this.max) this.max = hz
    if (this.targetMin !== null && this.targetMax !== null &&
        hz >= this.targetMin && hz <= this.targetMax) {
      this.inTargetCount++
    }
    for (const range of VOICE_RANGES) {
      if (hz >= range.minHz && hz <= range.maxHz) {
        this.rangeCounts.set(range.label, (this.rangeCounts.get(range.label) ?? 0) + 1)
      }
    }
  }

  getStats(): PitchStats {
    if (this.count === 0) {
      return { count: 0, minHz: null, maxHz: null, meanHz: null, rangeHz: null, targetPct: null, dominantRange: null }
    }

    const targetPct = (this.targetMin !== null && this.targetMax !== null)
      ? Math.round((this.inTargetCount / this.count) * 100)
      : null

    let dominantRange: string | null = null
    let best = 0
    for (const [label, cnt] of this.rangeCounts) {
      if (cnt > best) { best = cnt; dominantRange = label }
    }

    return {
      count: this.count,
      minHz: Math.round(this.min),
      maxHz: Math.round(this.max),
      meanHz: Math.round(this.sum / this.count),
      rangeHz: Math.round(this.max - this.min),
      targetPct,
      dominantRange,
    }
  }

  reset(): void {
    this.count = 0
    this.sum = 0
    this.min = Infinity
    this.max = -Infinity
    this.inTargetCount = 0
    this.rangeCounts.clear()
  }
}
