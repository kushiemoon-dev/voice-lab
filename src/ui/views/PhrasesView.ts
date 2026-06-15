import { el } from '../../lib/dom'
import { getPhrasesByTheme, getRandomPhrase, THEME_LABELS, THEMES } from '../../domain/phrases'
import type { Phrase, PhraseTheme } from '../../domain/phrases'
import { createButton } from '../components/Button'
import { createSelect } from '../components/Select'
import { PitchGraphRenderer } from '../canvas/PitchGraphRenderer'
import { ScreenReaderLive } from '../components/ScreenReaderLive'
import { PitchyEstimator } from '../../audio/pitch/pitchyEstimator'
import { MedianSmoother } from '../../audio/pitch/pitchSmoothing'
import { RingBuffer } from '../../audio/recorder/ringBuffer'
import { loadCaptureWorklet } from '../../audio/worklet/workletLoader'
import { playSnapshot } from '../../audio/recorder/playback'
import { encodeWav } from '../../audio/recorder/wav'
import { createResizeObserver } from '../canvas/canvasUtils'
import { hzToNoteName } from '../../domain/noteFrequencies'
import { VOICE_RANGES } from '../../domain/voiceRanges'
import type { AudioEngine } from '../../audio/AudioEngine'
import { t } from '../../i18n/strings'

function readoutColorForHz(hz: number): string {
  const range = VOICE_RANGES.find(r => hz >= r.minHz && hz <= r.maxHz)
  if (!range) return 'var(--text)'
  if (range.id === 'masculine') return '#5bcefa'
  if (range.id === 'feminine')  return '#f5a9b8'
  return 'var(--text)'
}

const MAX_SECONDS = 30
type RecordState = 'idle' | 'recording' | 'stopped'

export class PhrasesView {
  private readonly root: HTMLElement
  private readonly textEl: HTMLElement
  private readonly counterEl: HTMLElement
  private currentIndex = 0
  private currentTheme: PhraseTheme = 'general'
  private filtered: readonly Phrase[] = getPhrasesByTheme('general')

  // Pitch graph
  private readonly pitchCanvas: HTMLCanvasElement
  private readonly pitchWrap: HTMLElement
  private readonly renderer: PitchGraphRenderer
  private readonly liveRegion: ScreenReaderLive
  private readonly estimator = new PitchyEstimator()
  private readonly smoother = new MedianSmoother(5, 0.85)
  private lastSampleAt = 0
  private unsubFrame: (() => void) | null = null
  private resizeObserver: ResizeObserver | null = null
  private readonly readoutEl: HTMLElement
  private readonly hzEl: HTMLElement
  private readonly noteEl: HTMLElement
  private readonly idleEl: HTMLElement
  private isIdle = true

  // Record
  private recordState: RecordState = 'idle'
  private ringBuffer: RingBuffer
  private sampleRate = 48000
  private tickInterval: ReturnType<typeof setInterval> | null = null
  private playbackSource: AudioBufferSourceNode | null = null
  private readonly recordBtn: HTMLButtonElement
  private readonly listenBtn: HTMLButtonElement
  private readonly exportBtn: HTMLButtonElement
  private readonly clearBtn: HTMLButtonElement
  private readonly durationEl: HTMLElement
  private readonly recDot: HTMLElement
  private readonly waveCanvas: HTMLCanvasElement
  private readonly statusLive: HTMLElement

  constructor(private readonly engine: AudioEngine) {
    this.textEl = el('p', {
      style: 'font-size: 1.4rem; line-height: 1.8; font-weight: 500; min-height: 3.6rem;',
      'aria-live': 'polite',
    })
    this.counterEl = el('span', { style: 'color: var(--text-muted); font-size: 0.8rem;' })

    const themeSelect = createSelect(
      THEMES.map(th => ({ value: th, label: THEME_LABELS[th] })),
      (theme) => { this.setTheme(theme) },
      t('phrases.theme'),
    )

    const btnPrev   = createButton(t('phrases.prev'),   () => { this.navigate(-1) })
    const btnNext   = createButton(t('phrases.next'),   () => { this.navigate(1) })
    const btnRandom = createButton(t('phrases.random'), () => { this.showRandom() }, 'primary')

    // Readout live
    this.hzEl   = el('span', { class: 'pitch-readout__hz'   }, '—')
    this.noteEl = el('span', { class: 'pitch-readout__note' }, '')
    this.idleEl = el('span', { class: 'pitch-readout__idle' }, t('pitch.idle'))
    this.readoutEl = el('div', { class: 'pitch-readout' }, this.idleEl)

    // Pitch graph
    this.pitchCanvas = el('canvas', {
      'aria-hidden': 'true',
      style: 'width: 100%; display: block; border-radius: 8px;',
    }) as unknown as HTMLCanvasElement
    this.pitchWrap = el('div', { style: 'width: 100%; margin-top: var(--space-4);' }, this.pitchCanvas)
    this.renderer = new PitchGraphRenderer(this.pitchCanvas)
    this.liveRegion = new ScreenReaderLive(2000)

    // Record controls
    this.recordBtn = createButton(t('record.start'), () => { this.onToggleRecord() }, 'primary')
    this.listenBtn = createButton(`▶ ${t('record.listen')}`, () => { this.onListen() })
    this.listenBtn.disabled = true
    this.exportBtn = createButton(t('record.export'), () => { void this.onExport() })
    this.exportBtn.disabled = true
    this.clearBtn  = createButton(t('record.clear'), () => { this.onClear() })
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
      width: '800', height: '60',
      'aria-hidden': 'true',
      style: 'width: 100%; height: 60px; border-radius: var(--radius-md); background: var(--surface-raised); display: none; margin-top: var(--space-3);',
    }) as unknown as HTMLCanvasElement

    this.ringBuffer = new RingBuffer(48000 * MAX_SECONDS)

    this.root = el('div', { class: 'view-card' },
      el('h1', { style: 'font-size: 1rem; margin-bottom: var(--space-3);' }, t('phrases.title')),
      el('p', { style: 'color: var(--text-muted); font-size: 0.875rem; margin-bottom: var(--space-3);' },
        t('phrases.subtitle'),
      ),
      el('div', { style: 'margin-bottom: var(--space-4);' }, themeSelect),
      this.textEl,
      el('div', { style: 'display: flex; gap: var(--space-2); margin-top: var(--space-4); flex-wrap: wrap;' },
        btnPrev, btnNext, btnRandom,
      ),
      el('div', { style: 'margin-top: var(--space-3);' }, this.counterEl),
      this.readoutEl,
      this.pitchWrap,
      el('div', { style: 'display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-4);' },
        this.recordBtn, this.recDot, this.durationEl,
      ),
      this.waveCanvas,
      el('div', { style: 'display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;' },
        this.listenBtn, this.exportBtn, this.clearBtn,
      ),
      this.liveRegion.element,
      this.statusLive,
    )

    this.show(0)
  }

  private setTheme(theme: PhraseTheme): void {
    this.currentTheme = theme
    this.filtered = getPhrasesByTheme(theme)
    this.show(0)
  }

  private show(index: number): void {
    this.currentIndex = index
    const phrase = this.filtered[index]
    if (!phrase) return
    this.textEl.textContent = `"${phrase.text}"`
    this.counterEl.textContent = `${t('phrases.counter')} ${index + 1} / ${this.filtered.length}`
  }

  private navigate(delta: number): void {
    const next = (this.currentIndex + delta + this.filtered.length) % this.filtered.length
    this.show(next)
  }

  private showRandom(): void {
    const current = this.filtered[this.currentIndex]
    const phrase = getRandomPhrase(current?.id, this.currentTheme)
    const idx = this.filtered.findIndex(p => p.id === phrase.id)
    if (idx >= 0) this.show(idx)
  }

  async mount(stream: MediaStream): Promise<void> {
    this.sampleRate = this.engine.getSampleRate()
    this.ringBuffer = new RingBuffer(this.sampleRate * MAX_SECONDS)

    this.resizeObserver = createResizeObserver(this.pitchWrap, (w) => {
      this.renderer.resize(w, 180)
    })

    const SAMPLE_INTERVAL_MS = 33
    this.unsubFrame = this.engine.onFrame(frame => {
      const sr = this.engine.getSampleRate()
      const raw = this.estimator.estimate(frame, sr)
      const hz = this.smoother.push(raw.hz ?? 0, raw.clarity)
      const now = performance.now()
      if (now - this.lastSampleAt >= SAMPLE_INTERVAL_MS) {
        this.lastSampleAt = now
        this.renderer.pushPoint(hz)
      }
      if (hz !== null) {
        if (this.isIdle) {
          this.readoutEl.replaceChildren(this.hzEl, this.noteEl)
          this.isIdle = false
        }
        this.hzEl.textContent = `${Math.round(hz)} Hz`
        this.hzEl.style.color = readoutColorForHz(hz)
        this.noteEl.textContent = hzToNoteName(hz)
        this.liveRegion.announce(`${Math.round(hz)} Hz`)
      }
    })

    const audioCtx = this.engine.getContext()
    if (!audioCtx) return
    try {
      await loadCaptureWorklet(audioCtx, stream, (chunk) => {
        if (this.recordState !== 'recording') return
        this.ringBuffer.push(chunk)
        if (this.ringBuffer.filledSamples >= this.sampleRate * MAX_SECONDS) {
          this.stopRecording()
        }
      })
    } catch (_) {
      this.recordBtn.disabled = true
    }
  }

  private onToggleRecord(): void {
    if (this.recordState === 'recording') { this.stopRecording() } else { this.startRecording() }
  }

  private startRecording(): void {
    this.stopPlayback()
    this.recordState = 'recording'
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
    this.recordState = 'stopped'
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
    this.waveCanvas.style.display = 'block'
    const ctx = this.waveCanvas.getContext('2d')
    if (!ctx) return
    const W = 800, H = 60
    const step = Math.max(1, Math.floor(data.length / W))
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
    const audioCtx = this.engine.getContext()
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
    this.recordState = 'idle'
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
    this.unsubFrame?.()
    this.resizeObserver?.disconnect()
    this.smoother.reset()
    if (this.tickInterval) clearInterval(this.tickInterval)
  }

  get element(): HTMLElement { return this.root }
}
