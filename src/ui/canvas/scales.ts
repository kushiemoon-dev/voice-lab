import { hzToLogY } from '../../lib/math'
import { MIN_DISPLAY_HZ, MAX_DISPLAY_HZ } from '../../domain/voiceRanges'

export const pitchToY = (hz: number, height: number): number =>
  hzToLogY(hz, MIN_DISPLAY_HZ, MAX_DISPLAY_HZ, height)

export const timeToX = (
  pointIndex: number,
  totalPoints: number,
  width: number,
): number => {
  if (totalPoints <= 1) return 0
  return (pointIndex / (totalPoints - 1)) * width
}
