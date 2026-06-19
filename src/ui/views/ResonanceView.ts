import { el } from '../../lib/dom'
import { Meter } from '../components/Meter'
import { PitchyEstimator } from '../../audio/pitch/pitchyEstimator'
import { MedianSmoother } from '../../audio/pitch/pitchSmoothing'
import type { AudioEngine } from '../../audio/AudioEngine'
import { t } from '../../i18n/strings'
import { estimateFormants, apertureNorm, brightnessNorm } from '../../analysis/formants'

const UPDATE_MS = 150
const EMA_ALPHA = 0.6 // temporal smoothing for meter display

export class ResonanceView {
  private readonly root: HTMLElement
  private readonly apertureEl: HTMLElement
  private readonly brightnessEl: HTMLElement
  private readonly apertureMeter = new Meter(t('resonance.aperture'))
  private readonly brightnessMeter = new Meter(t('resonance.brightness'))
  private readonly statusEl: HTMLElement

  private latestFreqData: Float32Array | null = null
  private lastUpdateAt = 0
  private smoothAperture = 0.5
  private smoothBrightness = 0.5
  private unsubFreq: (() => void) | null = null
  private unsubFrame: (() => void) | null = null
  private readonly estimator = new PitchyEstimator()
  private readonly smoother = new MedianSmoother(5, 0.85)

  constructor(private readonly engine: AudioEngine) {
    this.apertureEl = el('span', {
      style: 'color: var(--text-muted); font-size: 0.8rem; display: block; margin-top: var(--space-1);',
    })
    this.brightnessEl = el('span', {
      style: 'color: var(--text-muted); font-size: 0.8rem; display: block; margin-top: var(--space-1);',
    })
    this.statusEl = el('p', {
      'aria-live': 'polite',
      style: 'font-size: 0.85rem; color: var(--text-muted); margin-top: var(--space-4); font-style: italic;',
    }, t('resonance.waiting'))

    const apertureBlock = el('div', { style: 'margin-bottom: var(--space-4);' },
      el('div', { style: 'font-size: 0.875rem; margin-bottom: var(--space-2);' }, t('resonance.aperture')),
      this.apertureMeter.element,
      this.apertureEl,
    )
    const brightnessBlock = el('div', { style: 'margin-bottom: var(--space-4);' },
      el('div', { style: 'font-size: 0.875rem; margin-bottom: var(--space-2);' }, t('resonance.brightness')),
      this.brightnessMeter.element,
      this.brightnessEl,
    )

    this.root = el('div', {},
      el('p', { style: 'font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--space-4); font-style: italic;' },
        t('resonance.description'),
      ),
      el('p', { style: 'font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--space-4);' },
        t('resonance.holdVowel'),
      ),
      apertureBlock,
      brightnessBlock,
      this.statusEl,
    )
  }

  mount(): void {
    const sr = this.engine.getSampleRate()
    const binCount = this.engine.getFreqBinCount()

    this.unsubFreq = this.engine.onFreqFrame(data => {
      this.latestFreqData = data
    })

    this.unsubFrame = this.engine.onFrame(frame => {
      const raw = this.estimator.estimate(frame, sr)
      const hz = this.smoother.push(raw.hz ?? 0, raw.clarity)

      const now = performance.now()
      if (now - this.lastUpdateAt < UPDATE_MS) return
      this.lastUpdateAt = now

      if (!this.latestFreqData) return

      const result = estimateFormants(this.latestFreqData, sr, binCount, hz)
      if (!result.valid) {
        this.statusEl.textContent = t('resonance.waiting')
        return
      }

      this.statusEl.textContent = ''

      const ap = apertureNorm(result.f1)
      const br = brightnessNorm(result.f2)
      this.smoothAperture = EMA_ALPHA * this.smoothAperture + (1 - EMA_ALPHA) * ap
      this.smoothBrightness = EMA_ALPHA * this.smoothBrightness + (1 - EMA_ALPHA) * br

      this.apertureMeter.update(this.smoothAperture)
      this.brightnessMeter.update(this.smoothBrightness)
      this.apertureEl.textContent = this.apertureLabel(this.smoothAperture)
      this.brightnessEl.textContent = this.brightnessLabel(this.smoothBrightness)
    })
  }

  private apertureLabel(norm: number): string {
    if (norm < 0.33) return t('resonance.closed')
    if (norm < 0.67) return t('resonance.mid')
    return t('resonance.open')
  }

  private brightnessLabel(norm: number): string {
    if (norm < 0.33) return t('resonance.dark')
    if (norm < 0.67) return t('resonance.neutral')
    return t('resonance.bright')
  }

  destroy(): void {
    this.unsubFreq?.()
    this.unsubFrame?.()
    this.smoother.reset()
  }

  get element(): HTMLElement { return this.root }
}
