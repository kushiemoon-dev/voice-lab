import { el } from '../../lib/dom'
import { PitchyEstimator } from '../../audio/pitch/pitchyEstimator'
import { MedianSmoother } from '../../audio/pitch/pitchSmoothing'
import { PitchStatsAccumulator } from '../../analysis/pitchStats'
import { createButton } from '../components/Button'
import type { AudioEngine } from '../../audio/AudioEngine'
import { t } from '../../i18n/strings'

export class StatsView {
  private readonly root: HTMLElement
  private readonly accumulator = new PitchStatsAccumulator()
  private readonly estimator = new PitchyEstimator()
  private readonly smoother = new MedianSmoother(7, 0.85)

  private readonly valMin: HTMLElement
  private readonly valMax: HTMLElement
  private readonly valMean: HTMLElement
  private readonly valRange: HTMLElement
  private readonly valDominant: HTMLElement
  private readonly valCount: HTMLElement

  private unsubFrame: (() => void) | null = null
  private intervalId: ReturnType<typeof setInterval> | null = null

  constructor(private readonly engine: AudioEngine) {
    const makeCard = (label: string, valueEl: HTMLElement): HTMLElement =>
      el('div', { class: 'stat-card' },
        el('div', { class: 'stat-card__label' }, label),
        valueEl,
      )

    this.valMin      = el('div', { class: 'stat-card__value' }, '—')
    this.valMax      = el('div', { class: 'stat-card__value' }, '—')
    this.valMean     = el('div', { class: 'stat-card__value' }, '—')
    this.valRange    = el('div', { class: 'stat-card__value' }, '—')
    this.valDominant = el('div', { class: 'stat-card__value' }, '—')
    this.valCount    = el('div', { class: 'stat-card__value' }, '0')

    const grid = el('div', { class: 'stats-grid' },
      makeCard(t('stats.min'),      this.valMin),
      makeCard(t('stats.max'),      this.valMax),
      makeCard(t('stats.mean'),     this.valMean),
      makeCard(t('stats.range'),    this.valRange),
      makeCard(t('stats.dominant'), this.valDominant),
      makeCard(t('stats.frames'),   this.valCount),
    )

    const resetBtn = createButton(t('stats.reset'), () => {
      this.accumulator.reset()
      this.smoother.reset()
      this.renderStats()
    })

    this.root = el('div', {},
      el('h3', { style: 'font-size:1rem;margin-bottom:var(--space-2);' }, t('stats.title')),
      el('p', { class: 'description', style: 'font-size:0.875rem;color:var(--text-muted);margin-bottom:var(--space-2);' },
        t('stats.description')),
      grid,
      resetBtn,
    )
  }

  private renderStats(): void {
    const s = this.accumulator.getStats()
    this.valMin.textContent      = s.minHz  !== null ? `${s.minHz} Hz`  : '—'
    this.valMax.textContent      = s.maxHz  !== null ? `${s.maxHz} Hz`  : '—'
    this.valMean.textContent     = s.meanHz !== null ? `${s.meanHz} Hz` : '—'
    this.valRange.textContent    = s.rangeHz !== null ? `${s.rangeHz} Hz` : '—'
    this.valDominant.textContent = s.dominantRange ?? '—'
    this.valCount.textContent    = `${s.count}`
  }

  mount(): void {
    this.unsubFrame = this.engine.onFrame(frame => {
      const sr = this.engine.getSampleRate()
      const raw = this.estimator.estimate(frame, sr)
      const hz = this.smoother.push(raw.hz ?? 0, raw.clarity)
      if (hz !== null) {
        this.accumulator.push(hz)
      }
    })

    this.intervalId = setInterval(() => { this.renderStats() }, 2000)
  }

  destroy(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId)
    this.unsubFrame?.()
    this.smoother.reset()
  }

  get element(): HTMLElement { return this.root }
}
