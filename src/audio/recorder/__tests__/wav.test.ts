import { describe, it, expect } from 'vitest'
import { encodeWav } from '../wav'

describe('encodeWav', () => {
  const SR = 44100

  it('entête RIFF correcte', () => {
    const samples = new Float32Array(100)
    const buf = encodeWav(samples, SR)
    const v = new DataView(buf)
    const ascii = (o: number, n: number) =>
      Array.from({ length: n }, (_, i) => String.fromCharCode(v.getUint8(o + i))).join('')

    expect(ascii(0, 4)).toBe('RIFF')
    expect(ascii(8, 4)).toBe('WAVE')
    expect(ascii(12, 4)).toBe('fmt ')
    expect(ascii(36, 4)).toBe('data')
  })

  it('taille totale = 44 + samples * 2', () => {
    const n = 256
    const buf = encodeWav(new Float32Array(n), SR)
    expect(buf.byteLength).toBe(44 + n * 2)
  })

  it('taille du chunk data correcte', () => {
    const n = 512
    const buf = encodeWav(new Float32Array(n), SR)
    const v = new DataView(buf)
    expect(v.getUint32(40, true)).toBe(n * 2)
  })

  it('sample rate dans l\'entête', () => {
    const buf = encodeWav(new Float32Array(10), 22050)
    const v = new DataView(buf)
    expect(v.getUint32(24, true)).toBe(22050)
  })

  it('PCM mono 16 bits — format audio code = 1', () => {
    const buf = encodeWav(new Float32Array(10), SR)
    const v = new DataView(buf)
    expect(v.getUint16(20, true)).toBe(1)   // PCM
    expect(v.getUint16(22, true)).toBe(1)   // mono
    expect(v.getUint16(34, true)).toBe(16)  // 16 bits
  })

  it('clamp les échantillons hors [-1, 1]', () => {
    const samples = new Float32Array([2.0, -2.0])
    const buf = encodeWav(samples, SR)
    const v = new DataView(buf)
    const s0 = v.getInt16(44, true)
    const s1 = v.getInt16(46, true)
    expect(s0).toBe(0x7fff)   // +1.0 → max positif
    expect(s1).toBe(-0x8000)  // -1.0 → min négatif
  })
})
