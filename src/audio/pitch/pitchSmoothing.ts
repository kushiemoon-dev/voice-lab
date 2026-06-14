const MIN_HZ = 60
const MAX_HZ = 500

export class MedianSmoother {
  private readonly window: number[] = []

  constructor(
    private readonly size: number,
    private readonly clarityThreshold: number,
  ) {}

  push(hz: number, clarity: number): number | null {
    if (clarity < this.clarityThreshold) return null
    if (hz < MIN_HZ || hz > MAX_HZ) return null

    this.window.push(hz)
    if (this.window.length > this.size) this.window.shift()

    const sorted = [...this.window].sort((a, b) => a - b)
    return sorted[Math.floor(sorted.length / 2)] ?? null
  }

  reset(): void {
    this.window.length = 0
  }
}

export class EmaSmoother {
  private value: number | null = null

  constructor(private readonly alpha = 0.35) {}

  update(x: number): number {
    this.value = this.value === null ? x : this.alpha * x + (1 - this.alpha) * this.value
    return this.value
  }

  reset(): void {
    this.value = null
  }
}
