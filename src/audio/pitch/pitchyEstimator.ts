import { PitchDetector } from 'pitchy'
import type { PitchEstimator, PitchResult } from './PitchEstimator'

export class PitchyEstimator implements PitchEstimator {
  private detector: ReturnType<typeof PitchDetector.forFloat32Array> | null = null
  private lastBufferSize = 0

  estimate(frame: Float32Array, sampleRate: number): PitchResult {
    if (frame.length !== this.lastBufferSize) {
      this.detector = PitchDetector.forFloat32Array(frame.length)
      this.lastBufferSize = frame.length
    }
    const [hz, clarity] = this.detector!.findPitch(frame, sampleRate)
    return { hz, clarity }
  }
}
