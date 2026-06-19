import { el } from '../../lib/dom'
import { PitchGraphRenderer } from '../canvas/PitchGraphRenderer'
import { ScreenReaderLive } from '../components/ScreenReaderLive'
import { PitchyEstimator } from '../../audio/pitch/pitchyEstimator'
import { MedianSmoother } from '../../audio/pitch/pitchSmoothing'
import { RmsSmoothed } from '../../audio/volume/rms'
import { Meter } from '../components/Meter'
import { hzToNoteName } from '../../domain/noteFrequencies'
import type { AudioEngine } from '../../audio/AudioEngine'
import { createResizeObserver } from '../canvas/canvasUtils'
import { createSelect } from '../components/Select'
import { t } from '../../i18n/strings'
import type { StringKey } from '../../i18n/strings'

function volLevelKey(vol: number): StringKey {
  if (vol < 0.15) return 'volume.level.verysoft'
  if (vol < 0.35) return 'volume.level.soft'
  if (vol < 0.65) return 'volume.level.moderate'
  if (vol < 0.82) return 'volume.level.loud'
  return 'volume.level.veryloud'
}

export class PitchView {
  private readonly root: HTMLElement
  private readonly canvas: HTMLCanvasElement
  private readonly canvasWrap: HTMLElement
  private readonly renderer: PitchGraphRenderer
  private readonly liveRegion: ScreenReaderLive
  private readonly estimator = new PitchyEstimator()
  private readonly smoother = new MedianSmoother(5, 0.85)
  private readonly rmsSmoothed = new RmsSmoothed()
  private lastSampleAt = 0
  private readonly meter = new Meter(t('pitch.volume'))
  private readonly volFeedbackEl: HTMLElement
  // Readout live
  private readonly readoutEl: HTMLElement
  private readonly hzEl: HTMLElement
  private readonly noteEl: HTMLElement
  private readonly idleEl: HTMLElement
  private isIdle = true
  private unsubFrame: (() => void) | null = null
  private resizeObserver: ResizeObserver | null = null

  constructor(private readonly engine: AudioEngine) {
    this.canvas = el('canvas', {
      style: 'width: 100%; display: block; border-radius: 8px;',
      'aria-hidden': 'true',
    })
    this.canvasWrap = el('div', { class: 'pitch-canvas-wrap' }, this.canvas)
    this.liveRegion = new ScreenReaderLive(2000)
    this.renderer = new PitchGraphRenderer(this.canvas)

    // Readout live — état idle par défaut
    this.hzEl   = el('span', { class: 'pitch-readout__hz'   }, '—')
    this.noteEl = el('span', { class: 'pitch-readout__note' }, '')
    this.idleEl = el('span', { class: 'pitch-readout__idle' }, t('pitch.idle'))
    this.readoutEl = el('div', { class: 'pitch-readout' }, this.idleEl)

    // Select cible
    const targetOptions = [
      { label: t('pitch.targetNone'), value: 'none' },
      { label: '165 Hz — E3',         value: '165' },
      { label: '180 Hz — F#3',        value: '180' },
      { label: '200 Hz — G3',         value: '200' },
      { label: '220 Hz — A3',         value: '220' },
      { label: '250 Hz — B3',         value: '250' },
    ] as const
    const targetSelect = createSelect(targetOptions, (val) => {
      this.renderer.setTargetHz(val === 'none' ? null : parseInt(val, 10))
    }, t('pitch.targetLabel'))
    const toolbar = el('div', { class: 'pitch-toolbar' },
      el('span', { class: 'pitch-toolbar__label' }, t('pitch.target')),
      targetSelect,
    )

    // Légende
    const legend = el('div', { class: 'legend' },
      el('span', { class: 'legend__item' },
        el('span', { class: 'legend__swatch', style: 'background: rgba(148, 163, 184, 0.4);' }),
        t('pitch.band.low')),
      el('span', { class: 'legend__item' },
        el('span', { class: 'legend__swatch', style: 'background: rgba(148, 163, 184, 0.55);' }),
        t('pitch.band.mid')),
      el('span', { class: 'legend__item' },
        el('span', { class: 'legend__swatch', style: 'background: rgba(148, 163, 184, 0.4);' }),
        t('pitch.band.high')),
    )

    // Volume
    this.volFeedbackEl = el('span', {
      style: 'color: var(--text-muted); font-size: 0.8rem; margin-top: var(--space-1); display: block;',
    })
    const volumeBlock = el('div', { class: 'volume-block' },
      el('div', { class: 'volume-block__label' }, t('pitch.volume')),
      this.meter.element,
      this.volFeedbackEl,
    )

    this.root = el('div', { class: 'view-card', style: 'padding: var(--space-6);' },
      el('h1', { style: 'font-size: 1rem; margin-bottom: var(--space-4);' }, t('pitch.title')),
      this.readoutEl,
      this.canvasWrap,
      legend,
      toolbar,
      volumeBlock,
      this.liveRegion.element,
    )
  }

  mount(parent: Element): void {
    parent.append(this.root)

    // Observer le WRAP (pas le canvas) pour éviter le bug de resize
    this.resizeObserver = createResizeObserver(this.canvasWrap, (w) => {
      this.renderer.resize(w, 340)
    })

    const SAMPLE_INTERVAL_MS = 33 // ~30 Hz → 300 pts / 30 ≈ 10 s de fenêtre

    this.unsubFrame = this.engine.onFrame(frame => {
      const sr = this.engine.getSampleRate()
      const raw = this.estimator.estimate(frame, sr)
      const hz = this.smoother.push(raw.hz ?? 0, raw.clarity)
      const vol = this.rmsSmoothed.update(frame)
      this.meter.update(vol)
      this.volFeedbackEl.textContent = t(volLevelKey(vol))

      // Throttle : un point toutes les ~33 ms seulement
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
        this.noteEl.textContent = hzToNoteName(hz)
        this.liveRegion.announce(`${Math.round(hz)} Hz, ${hzToNoteName(hz)}`)
      }
    })
  }

  destroy(): void {
    this.unsubFrame?.()
    this.resizeObserver?.disconnect()
    this.smoother.reset()
  }

  get element(): HTMLElement { return this.root }
}
