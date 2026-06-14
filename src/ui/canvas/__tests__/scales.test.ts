import { describe, it, expect } from 'vitest'
import { pitchToY, timeToX } from '../scales'

describe('pitchToY', () => {
  it('higher pitch maps to lower Y (top of canvas)', () => {
    const H = 300
    expect(pitchToY(400, H)).toBeLessThan(pitchToY(200, H))
  })
  it('result is within canvas bounds', () => {
    const H = 300
    const y = pitchToY(200, H)
    expect(y).toBeGreaterThanOrEqual(0)
    expect(y).toBeLessThanOrEqual(H)
  })
  it('extreme high pitch maps near top', () => {
    expect(pitchToY(500, 300)).toBeLessThan(50)
  })
  it('extreme low pitch maps near bottom', () => {
    expect(pitchToY(80, 300)).toBeGreaterThan(250)
  })
})

describe('timeToX', () => {
  it('maps first point to 0', () => {
    expect(timeToX(0, 10, 100)).toBe(0)
  })
  it('maps last point to full width', () => {
    expect(timeToX(9, 10, 100)).toBe(100)
  })
  it('maps middle point to half width', () => {
    expect(timeToX(4, 9, 100)).toBeCloseTo(50)
  })
  it('returns 0 when totalPoints is 1', () => {
    expect(timeToX(0, 1, 100)).toBe(0)
  })
  it('scales proportionally', () => {
    expect(timeToX(1, 5, 100)).toBeCloseTo(25)
  })
})
