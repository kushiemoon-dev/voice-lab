import { el } from '../../lib/dom'
import { HarmonicsRenderer } from '../canvas/HarmonicsRenderer'
import { PitchyEstimator } from '../../audio/pitch/pitchyEstimator'
import { MedianSmoother } from '../../audio/pitch/pitchSmoothing'
import { extractHarmonics } from '../../analysis/harmonics'
import type { AudioEngine } from '../../audio/AudioEngine'
import { createResizeObserver } from '../canvas/canvasUtils'
import type { Harmonic } from '../../analysis/harmonics'
import { t } from '../../i18n/strings'

// Throttle render + DSP à ~30 Hz (latestFreqData reste valide dans le même RAF)
const SAMPLE_INTERVAL_MS = 33

export class HarmonicsView {
  private readonly root: HTMLElement
  private readonly canvas: HTMLCanvasElement
  private readonly canvasWrap: HTMLElement
  private readonly renderer: HarmonicsRenderer
  private readonly estimator = new PitchyEstimator()
  private readonly smoother = new MedianSmoother(7, 0.85)
  private latestFreqData: Float32Array | null = null
  private latestHarmonics: Harmonic[] = []
  private lastRenderAt = 0
  private unsubFrame: (() => void) | null = null
  private unsubFreq: (() => void) | null = null
  private resizeObserver: ResizeObserver | null = null
  private readonly infoEl: HTMLElement

  constructor(private readonly engine: AudioEngine) {
    this.canvas = el('canvas', {
      style: 'width:100%;display:block;border-radius:8px;',
      'aria-hidden': 'true',
    }) as HTMLCanvasElement
    this.canvasWrap = el('div', { style: 'width:100%;' }, this.canvas)
    this.renderer = new HarmonicsRenderer(this.canvas)
    this.infoEl = el('p', {
      style: 'font-size:0.9rem;color:var(--text-muted);margin-top:var(--space-3);min-height:1.4em;',
      'aria-live': 'polite',
    }, t('harmonics.holdVowel'))

    this.root = el('div', {},
      el('p', { style: 'font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-3);' },
        t('harmonics.description')),
      this.canvasWrap,
      this.infoEl,
    )
  }

  mount(): void {
    const sr = this.engine.getSampleRate()
    const binCount = this.engine.getFreqBinCount()

    this.resizeObserver = createResizeObserver(this.canvasWrap, (w) => {
      this.renderer.resize(w, 260)
    })

    // latestFreqData est valide uniquement pendant le RAF courant (buffer réutilisé)
    this.unsubFreq = this.engine.onFreqFrame(data => {
      this.latestFreqData = data
    })

    this.unsubFrame = this.engine.onFrame(frame => {
      const raw = this.estimator.estimate(frame, sr)
      const hz = this.smoother.push(raw.hz ?? 0, raw.clarity)

      // Throttle extractHarmonics + render à ~30 Hz
      const now = performance.now()
      if (now - this.lastRenderAt < SAMPLE_INTERVAL_MS) return
      this.lastRenderAt = now

      if (hz !== null && this.latestFreqData !== null) {
        this.latestHarmonics = extractHarmonics(this.latestFreqData, hz, sr, binCount)
        this.renderer.render(this.latestFreqData, this.latestHarmonics, sr, binCount)
        this.infoEl.textContent = `${t('harmonics.fundamental')} : ${Math.round(hz)} Hz — ${this.latestHarmonics.length} ${t('harmonics.detected')}`
      } else if (this.latestFreqData !== null) {
        this.renderer.render(this.latestFreqData, [], sr, binCount)
        this.infoEl.textContent = t('harmonics.holdVowel')
      }
    })
  }

  destroy(): void {
    this.unsubFrame?.()
    this.unsubFreq?.()
    this.resizeObserver?.disconnect()
    this.smoother.reset()
  }

  get element(): HTMLElement { return this.root }
}
