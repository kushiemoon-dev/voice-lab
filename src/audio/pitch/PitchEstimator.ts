export interface PitchResult {
  readonly hz: number | null
  readonly clarity: number
}

export interface PitchEstimator {
  estimate(frame: Float32Array, sampleRate: number): PitchResult
}
