import { describe, it, expect, vi } from 'vitest'
import { playSnapshot } from '../playback'

function makeAudioCtx() {
  const source = {
    buffer: null as AudioBuffer | null,
    onended: null as (() => void) | null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }
  const buffer = {} as AudioBuffer
  const ctx = {
    createBuffer: vi.fn(() => buffer),
    createBufferSource: vi.fn(() => source),
    destination: {},
    sampleRate: 48000,
  } as unknown as AudioContext

  // copyToChannel must be present on the fake buffer
  ;(buffer as unknown as { copyToChannel: ReturnType<typeof vi.fn> }).copyToChannel = vi.fn()

  return { ctx, source, buffer }
}

describe('playSnapshot', () => {
  it('retourne la source et appelle start(0)', () => {
    const { ctx, source } = makeAudioCtx()
    const snapshot = new Float32Array(100)
    const result = playSnapshot(snapshot, 48000, ctx)
    expect(result).toBe(source)
    expect(source.start).toHaveBeenCalledWith(0)
  })

  it('câble onEnded sur source.onended', () => {
    const { ctx, source } = makeAudioCtx()
    const cb = vi.fn()
    playSnapshot(new Float32Array(10), 48000, ctx, cb)
    expect(source.onended).toBe(cb)
  })

  it('source.onended non défini si aucun callback', () => {
    const { ctx, source } = makeAudioCtx()
    playSnapshot(new Float32Array(10), 48000, ctx)
    expect(source.onended).toBeNull()
  })

  it('connecte la source à la destination', () => {
    const { ctx, source } = makeAudioCtx()
    playSnapshot(new Float32Array(10), 48000, ctx)
    expect(source.connect).toHaveBeenCalledWith(ctx.destination)
  })
})
