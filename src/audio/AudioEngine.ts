import type { Result } from '../lib/result'
import type { MicError } from '../lib/errors'
import { ok, err } from '../lib/result'
import { mapDomException } from '../lib/errors'

type FrameCallback = (frame: Float32Array) => void
type FreqCallback = (freqData: Float32Array) => void

export interface AudioEngine {
  start(stream: MediaStream): Promise<Result<void, MicError>>
  stop(): void
  onFrame(cb: FrameCallback): () => void
  onFreqFrame(cb: FreqCallback): () => void
  getSampleRate(): number
  getFreqBinCount(): number
  getContext(): AudioContext | null
}

export function createAudioEngine(): AudioEngine {
  let ctx: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let source: MediaStreamAudioSourceNode | null = null
  let rafId: number | null = null
  // Pre-allocated buffers — valid only during the RAF callback; callers must not retain across ticks
  let timeBuf: Float32Array<ArrayBuffer> | null = null
  let freqBuf: Float32Array<ArrayBuffer> | null = null
  const callbacks = new Set<FrameCallback>()
  const freqCallbacks = new Set<FreqCallback>()

  const tick = (): void => {
    if (!analyser || !timeBuf) return
    analyser.getFloatTimeDomainData(timeBuf)
    for (const cb of callbacks) cb(timeBuf)

    if (freqCallbacks.size > 0 && freqBuf) {
      analyser.getFloatFrequencyData(freqBuf)
      for (const cb of freqCallbacks) cb(freqBuf)
    }

    rafId = requestAnimationFrame(tick)
  }

  return {
    async start(stream) {
      // Re-entrancy guard: cancel previous loop and close old context first
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
      if (ctx) {
        source?.disconnect()
        await ctx.close().catch(() => {})
        ctx = null; analyser = null; source = null; timeBuf = null; freqBuf = null
      }
      try {
        ctx = new AudioContext()
        if (ctx.state === 'suspended') await ctx.resume()

        analyser = ctx.createAnalyser()
        analyser.fftSize = 4096
        analyser.smoothingTimeConstant = 0
        timeBuf = new Float32Array(analyser.fftSize)
        freqBuf = new Float32Array(analyser.frequencyBinCount)

        source = ctx.createMediaStreamSource(stream)
        source.connect(analyser)

        rafId = requestAnimationFrame(tick)
        return ok(undefined)
      } catch (e) {
        return err(mapDomException(e))
      }
    },

    stop() {
      if (rafId !== null) cancelAnimationFrame(rafId)
      source?.disconnect()
      void ctx?.close()
      ctx = null
      analyser = null
      source = null
      rafId = null
      timeBuf = null
      freqBuf = null
    },

    onFrame(cb) {
      callbacks.add(cb)
      return () => { callbacks.delete(cb) }
    },

    onFreqFrame(cb) {
      freqCallbacks.add(cb)
      return () => { freqCallbacks.delete(cb) }
    },

    getSampleRate() {
      return ctx?.sampleRate ?? 48000
    },

    getFreqBinCount() {
      return analyser?.frequencyBinCount ?? 2048
    },

    getContext() {
      return ctx
    },
  }
}
