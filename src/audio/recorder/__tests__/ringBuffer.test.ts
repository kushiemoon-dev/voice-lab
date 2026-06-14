import { describe, it, expect } from 'vitest'
import { RingBuffer } from '../ringBuffer'

describe('RingBuffer', () => {
  it('snapshot vide → Float32Array de longueur 0', () => {
    const rb = new RingBuffer(100)
    expect(rb.snapshot().length).toBe(0)
  })

  it('push puis snapshot retourne les samples dans l\'ordre chronologique', () => {
    const rb = new RingBuffer(10)
    rb.push(new Float32Array([1, 2, 3]))
    rb.push(new Float32Array([4, 5]))
    const snap = rb.snapshot()
    expect(Array.from(snap)).toEqual([1, 2, 3, 4, 5])
  })

  it('débordement : garde les N derniers samples', () => {
    const rb = new RingBuffer(4)
    rb.push(new Float32Array([1, 2, 3, 4, 5]))
    const snap = rb.snapshot()
    expect(snap.length).toBe(4)
    expect(Array.from(snap)).toEqual([2, 3, 4, 5])
  })

  it('clear remet à zéro', () => {
    const rb = new RingBuffer(10)
    rb.push(new Float32Array([1, 2, 3]))
    rb.clear()
    expect(rb.snapshot().length).toBe(0)
  })

  it('snapshot retourne une copie immuable', () => {
    const rb = new RingBuffer(10)
    rb.push(new Float32Array([1, 2, 3]))
    const snap = rb.snapshot()
    snap[0] = 999
    expect(rb.snapshot()[0]).toBe(1)
  })

  it('filledSamples reflète le nombre de samples pushés', () => {
    const rb = new RingBuffer(100)
    rb.push(new Float32Array(30))
    expect(rb.filledSamples).toBe(30)
  })
})
