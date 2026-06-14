export class RingBuffer {
  private readonly buffer: Float32Array
  private writePos = 0
  private filled = 0

  constructor(readonly capacitySamples: number) {
    this.buffer = new Float32Array(capacitySamples)
  }

  push(frame: Float32Array): void {
    for (let i = 0; i < frame.length; i++) {
      this.buffer[this.writePos] = frame[i] ?? 0
      this.writePos = (this.writePos + 1) % this.capacitySamples
      if (this.filled < this.capacitySamples) this.filled++
    }
  }

  snapshot(): Float32Array {
    const out = new Float32Array(this.filled)
    const start = this.filled < this.capacitySamples ? 0 : this.writePos
    for (let i = 0; i < this.filled; i++) {
      out[i] = this.buffer[(start + i) % this.capacitySamples] ?? 0
    }
    return out
  }

  clear(): void {
    this.buffer.fill(0)
    this.writePos = 0
    this.filled = 0
  }

  get filledSamples(): number {
    return this.filled
  }
}
