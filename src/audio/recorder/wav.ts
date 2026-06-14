/** Encode une tranche Float32Array en WAV PCM 16 bits mono. */
export function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const dataLen = samples.length * 2
  const buf = new ArrayBuffer(44 + dataLen)
  const v = new DataView(buf)
  const s = (o: number, x: string) => { for (let i = 0; i < x.length; i++) v.setUint8(o + i, x.charCodeAt(i)) }
  s(0, 'RIFF'); v.setUint32(4, 36 + dataLen, true); s(8, 'WAVE')
  s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true)
  v.setUint16(22, 1, true); v.setUint32(24, sampleRate, true)
  v.setUint32(28, sampleRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  s(36, 'data'); v.setUint32(40, dataLen, true)
  let o = 44
  for (let i = 0; i < samples.length; i++, o += 2) {
    const x = Math.max(-1, Math.min(1, samples[i]!))
    v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7fff, true)
  }
  return buf
}
