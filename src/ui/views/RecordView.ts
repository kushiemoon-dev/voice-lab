import { el } from '../../lib/dom'
import { createButton } from '../components/Button'
import { RingBuffer } from '../../audio/recorder/ringBuffer'
import { loadCaptureWorklet } from '../../audio/worklet/workletLoader'
import { playSnapshot } from '../../audio/recorder/playback'
import { encodeWav } from '../../audio/recorder/wav'
import type { AudioEngine } from '../../audio/AudioEngine'
import { t } from '../../i18n/strings'

const MAX_SECONDS = 30
type RecordState = 'idle' | 'recording' | 'stopped'

export class RecordView {
  private state: RecordState = 'idle'
  private ringBuffer: RingBuffer
  private sampleRate = 48000
  private _engine: AudioEngine | null = null
  private tickInterval: ReturnType<typeof setInterval> | null = null
  private playbackSource: AudioBufferSourceNode | null = null

  private readonly root: HTMLElement
  private readonly recordBtn: HTMLButtonElement
  private readonly listenBtn: HTMLButtonElement
  private readonly exportBtn: HTMLButtonElement
  private readonly clearBtn: HTMLButtonElement
  private readonly durationEl: HTMLElement
  private readonly recDot: HTMLElement
  private readonly waveCanvas: HTMLCanvasElement
  private readonly statusLive: HTMLElement

  constructor() {
    this.recordBtn = createButton(t('record.start'), () => { this.onToggleRecord() }, 'primary')
    this.listenBtn = createButton(`▶ ${t('record.listen')}`, () => { this.onListen() })
    this.listenBtn.disabled = true
    this.exportBtn = createButton(t('record.export'), () => { void this.onExport() })
    this.exportBtn.disabled = true
    this.clearBtn = createButton(t('record.clear'), () => { this.onClear() })
    this.clearBtn.disabled = true

    this.durationEl = el('span', {
      style: 'color: var(--text-muted); font-size: 0.9rem; font-variant-numeric: tabular-nums;',
    }, `0s / ${MAX_SECONDS}s`)

    this.recDot = el('span', { 'aria-hidden': 'true', style: 'display: none;' }, '●')

    this.statusLive = el('span', {
      'aria-live': 'polite',
      'aria-atomic': 'true',
      style: 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);',
    })

    this.waveCanvas = el('canvas', {
      width: '800', height: '80',
      'aria-hidden': 'true',
      style: 'width: 100%; height: 80px; border-radius: var(--radius-md); background: var(--surface-raised); display: none; margin-top: var(--space-4);',
    }) as unknown as HTMLCanvasElement

    this.root = el('div', { class: 'view-card' },
      el('h1', { style: 'margin-bottom: var(--space-2);' }, t('record.title')),
      el('p', { style: 'color: var(--text-muted); font-size: 0.875rem; margin-bottom: var(--space-5);' }, t('record.privacy')),
      el('div', { style: 'display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;' },
        this.recordBtn, this.recDot, this.durationEl,
      ),
      this.waveCanvas,
      el('div', { style: 'display: flex; gap: var(--space-2); margin-top: var(--space-4); flex-wrap: wrap;' },
        this.listenBtn, this.exportBtn, this.clearBtn,
      ),
      this.statusLive,
    )

    this.ringBuffer = new RingBuffer(48000 * MAX_SECONDS)
  }

  async mount(parent: Element, stream: MediaStream, engine: AudioEngine): Promise<void> {
    this._engine = engine
    this.sampleRate = engine.getSampleRate()
    this.ringBuffer = new RingBuffer(this.sampleRate * MAX_SECONDS)
    parent.append(this.root)

    const audioCtx = engine.getContext()
    if (!audioCtx) return

    try {
      await loadCaptureWorklet(audioCtx, stream, (chunk) => {
        if (this.state !== 'recording') return
        this.ringBuffer.push(chunk)
        if (this.ringBuffer.filledSamples >= this.sampleRate * MAX_SECONDS) {
          this.stopRecording()
        }
      })
    } catch (_) {
      const errEl = el('p', {
        role: 'alert',
        style: 'color:var(--error);font-size:0.9rem;margin-top:var(--space-4);',
      }, t('record.workletError'))
      this.root.append(errEl)
      this.recordBtn.disabled = true
    }
  }

  private onToggleRecord(): void {
    if (this.state === 'recording') { this.stopRecording() } else { this.startRecording() }
  }

  private startRecording(): void {
    this.stopPlayback()
    this.state = 'recording'
    this.ringBuffer.clear()
    this.waveCanvas.style.display = 'none'
    this.listenBtn.disabled = true
    this.exportBtn.disabled = true
    this.clearBtn.disabled = true

    this.recordBtn.textContent = t('record.stop')
    this.recordBtn.style.background = '#ef4444'
    this.recordBtn.style.borderColor = '#ef4444'
    this.recDot.className = 'rec-dot'
    this.recDot.style.display = 'inline'
    this.statusLive.textContent = t('record.status.progress')

    this.tickInterval = setInterval(() => {
      const secs = Math.floor(this.ringBuffer.filledSamples / this.sampleRate)
      this.durationEl.textContent = `${secs}s / ${MAX_SECONDS}s`
    }, 200)
  }

  private stopRecording(): void {
    this.state = 'stopped'
    if (this.tickInterval) { clearInterval(this.tickInterval); this.tickInterval = null }

    this.recordBtn.textContent = t('record.start')
    this.recordBtn.style.background = ''
    this.recordBtn.style.borderColor = ''
    this.recDot.style.display = 'none'

    const secs = Math.round(this.ringBuffer.filledSamples / this.sampleRate)
    this.durationEl.textContent = `${secs}s ${t('record.recorded')}`
    this.statusLive.textContent = t('record.status.ready')

    if (this.ringBuffer.filledSamples > 0) {
      this.listenBtn.disabled = false
      this.exportBtn.disabled = false
      this.clearBtn.disabled = false
      this.drawWaveform(this.ringBuffer.snapshot())
    }
  }

  private drawWaveform(data: Float32Array): void {
    const canvas = this.waveCanvas
    canvas.style.display = 'block'
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800, H = 80
    const step = Math.max(1, Math.floor(data.length / W))

    // Normalize to peak so even quiet signals fill the display
    let peak = 0
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i] ?? 0)
      if (abs > peak) peak = abs
    }
    const scale = peak > 0.001 ? (1 / peak) * 0.9 : 1

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke()

    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let x = 0; x < W; x++) {
      let min = 1, max = -1
      for (let s = 0; s < step; s++) {
        const v = (data[x * step + s] ?? 0) * scale
        if (v < min) min = v
        if (v > max) max = v
      }
      const y1 = ((1 - max) / 2) * H
      const y2 = ((1 - min) / 2) * H
      if (x === 0) ctx.moveTo(x + 0.5, y1)
      ctx.lineTo(x + 0.5, y1)
      ctx.lineTo(x + 0.5, y2)
    }
    ctx.stroke()
  }

  private onListen(): void {
    if (this.playbackSource) { this.stopPlayback(); return }
    const audioCtx = this._engine?.getContext() ?? null
    if (!audioCtx) return
    this.playbackSource = playSnapshot(
      this.ringBuffer.snapshot(), this.sampleRate, audioCtx,
      () => { this.onPlaybackEnded() },
    )
    this.listenBtn.textContent = `⏹ ${t('record.listenStop')}`
  }

  private stopPlayback(): void {
    try { this.playbackSource?.stop() } catch {}
  }

  private onPlaybackEnded(): void {
    this.playbackSource = null
    this.listenBtn.textContent = `▶ ${t('record.listen')}`
  }

  private async onExport(): Promise<void> {
    const wav = encodeWav(this.ringBuffer.snapshot(), this.sampleRate)
    const blob = new Blob([wav], { type: 'audio/wav' })
    try {
      const res = await fetch('/api/stage-wav', { method: 'POST', body: blob })
      if (res.ok) {
        const a = document.createElement('a')
        a.href = '/api/download-wav'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        return
      }
    } catch (_) { /* fallback */ }
    // Fallback: data URI for static hosting
    const bytes = new Uint8Array(wav)
    const CHUNK = 8192
    const parts: string[] = []
    for (let i = 0; i < bytes.byteLength; i += CHUNK) {
      parts.push(String.fromCharCode(...(bytes.subarray(i, i + CHUNK) as unknown as number[])))
    }
    const a = document.createElement('a')
    a.href = 'data:audio/wav;base64,' + btoa(parts.join(''))
    a.download = t('record.exportFilename')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  private onClear(): void {
    this.stopPlayback()
    this.state = 'idle'
    this.ringBuffer.clear()
    this.listenBtn.disabled = true
    this.exportBtn.disabled = true
    this.clearBtn.disabled = true
    this.recordBtn.textContent = t('record.start')
    this.durationEl.textContent = `0s / ${MAX_SECONDS}s`
    this.waveCanvas.style.display = 'none'
    this.statusLive.textContent = t('record.status.cleared')
  }

  destroy(): void {
    this.stopPlayback()
    if (this.tickInterval) clearInterval(this.tickInterval)
  }

  get element(): HTMLElement { return this.root }
}
