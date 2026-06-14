import { el } from '../../lib/dom'
import type { AudioEngine } from '../../audio/AudioEngine'
import { PitchyEstimator } from '../../audio/pitch/pitchyEstimator'
import { MedianSmoother } from '../../audio/pitch/pitchSmoothing'
import { computeVoiceQuality, type VoiceQualityMetrics } from '../../analysis/voiceQuality'
import { t } from '../../i18n/strings'

type QualityLevel = 'good' | 'warning' | 'bad'

function jitterLevel(v: number): QualityLevel {
  return v < 1 ? 'good' : v < 2 ? 'warning' : 'bad'
}

function shimmerLevel(v: number): QualityLevel {
  return v < 3 ? 'good' : v < 6 ? 'warning' : 'bad'
}

function hnrLevel(v: number): QualityLevel {
  return v > 15 ? 'good' : v > 7 ? 'warning' : 'bad'
}

const LEVEL_COLOR: Record<QualityLevel, string> = {
  good:    'var(--success)',
  warning: 'var(--warning)',
  bad:     'var(--error)',
}

// Résout la clé t() à l'appel (pas à l'import) — reflète la langue courante
function levelKey(level: QualityLevel): 'quality.level.normal' | 'quality.level.borderline' | 'quality.level.high' {
  if (level === 'good')    return 'quality.level.normal'
  if (level === 'warning') return 'quality.level.borderline'
  return 'quality.level.high'
}

function hnrLevelKey(level: QualityLevel): 'quality.level.normal' | 'quality.level.borderline' | 'quality.level.low' {
  if (level === 'good')    return 'quality.level.normal'
  if (level === 'warning') return 'quality.level.borderline'
  return 'quality.level.low'
}

function globalInterpretation(m: VoiceQualityMetrics): string {
  if (!m.valid) return t('quality.waiting')

  const issues: string[] = []
  if (m.jitter  !== null && m.jitter  >= 2) issues.push(t('quality.issue.highJitter'))
  if (m.shimmer !== null && m.shimmer >= 6) issues.push(t('quality.issue.highShimmer'))
  if (m.hnr     !== null && m.hnr    <  7) issues.push(t('quality.issue.lowHNR'))

  const warnings: string[] = []
  if (m.jitter  !== null && m.jitter  >= 1 && m.jitter  < 2) warnings.push(t('quality.warning.borderlineJitter'))
  if (m.shimmer !== null && m.shimmer >= 3 && m.shimmer < 6) warnings.push(t('quality.warning.borderlineShimmer'))
  if (m.hnr     !== null && m.hnr    >= 7  && m.hnr    <= 15) warnings.push(t('quality.warning.borderlineHNR'))

  if (issues.length > 0)   return `${t('quality.issues')}: ${issues.join(', ')}.`
  if (warnings.length > 0) return `${t('quality.warnings')}: ${warnings.join(', ')}. ${t('quality.monitor')}`
  return t('quality.normal')
}

// Throttle : computeVoiceQuality (lourd) au maximum 1×/s dans onFrame
const COMPUTE_INTERVAL_MS = 1000

export class VoiceQualityView {
  private readonly root: HTMLElement
  private readonly jitterValueEl: HTMLElement
  private readonly jitterBadgeEl: HTMLElement
  private readonly shimmerValueEl: HTMLElement
  private readonly shimmerBadgeEl: HTMLElement
  private readonly hnrValueEl: HTMLElement
  private readonly hnrBadgeEl: HTMLElement
  private readonly interpretationEl: HTMLElement

  private readonly estimator = new PitchyEstimator()
  private readonly smoother  = new MedianSmoother(5, 0.85)

  private lastMetrics: VoiceQualityMetrics = { jitter: null, shimmer: null, hnr: null, valid: false }
  private lastComputeAt = 0
  private unsub: (() => void) | null = null
  private intervalId: ReturnType<typeof setInterval> | null = null

  constructor(private readonly engine: AudioEngine) {
    this.jitterValueEl  = el('span', { class: 'stat-card__value' }, '—')
    this.jitterBadgeEl  = el('span', { style: 'font-size:0.75rem;margin-left:6px;' }, '')
    this.shimmerValueEl = el('span', { class: 'stat-card__value' }, '—')
    this.shimmerBadgeEl = el('span', { style: 'font-size:0.75rem;margin-left:6px;' }, '')
    this.hnrValueEl     = el('span', { class: 'stat-card__value' }, '—')
    this.hnrBadgeEl     = el('span', { style: 'font-size:0.75rem;margin-left:6px;' }, '')
    this.interpretationEl = el('p', {
      style: 'margin-top:var(--space-4);color:var(--text-muted);font-size:0.9rem;text-align:center;',
      'aria-live': 'polite',
    }, t('quality.waiting'))

    const jitterCard = el('div', { class: 'stat-card' },
      el('span', { class: 'stat-card__label' }, t('quality.jitter')),
      el('div', { 'aria-live': 'polite' }, this.jitterValueEl, this.jitterBadgeEl),
    )
    const shimmerCard = el('div', { class: 'stat-card' },
      el('span', { class: 'stat-card__label' }, t('quality.shimmer')),
      el('div', { 'aria-live': 'polite' }, this.shimmerValueEl, this.shimmerBadgeEl),
    )
    const hnrCard = el('div', { class: 'stat-card' },
      el('span', { class: 'stat-card__label' }, t('quality.hnr')),
      el('div', { 'aria-live': 'polite' }, this.hnrValueEl, this.hnrBadgeEl),
    )

    this.root = el('div', {},
      el('p', { style: 'color:var(--text-muted);font-size:0.9rem;margin-bottom:var(--space-4);' },
        t('quality.sustainedVowel')),
      el('div', { class: 'stats-grid' }, jitterCard, shimmerCard, hnrCard),
      this.interpretationEl,
    )
  }

  mount(): void {
    const sampleRate = this.engine.getSampleRate()

    this.unsub = this.engine.onFrame((frame) => {
      const { hz, clarity } = this.estimator.estimate(frame, sampleRate)
      if (hz === null) return
      const f0 = this.smoother.push(hz, clarity)
      if (f0 === null) return
      // Throttle DSP lourd — le display est mis à jour par setInterval de toute façon
      const now = performance.now()
      if (now - this.lastComputeAt >= COMPUTE_INTERVAL_MS) {
        this.lastComputeAt = now
        const metrics = computeVoiceQuality(frame, f0, sampleRate)
        if (metrics.valid) this.lastMetrics = metrics
      }
    })

    this.intervalId = setInterval(() => {
      this.updateDisplay(this.lastMetrics)
    }, 1500)
  }

  destroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.unsub?.()
    this.unsub = null
    this.smoother.reset()
  }

  get element(): HTMLElement { return this.root }

  private updateDisplay(m: VoiceQualityMetrics): void {
    if (!m.valid) {
      this.jitterValueEl.textContent  = '—'
      this.shimmerValueEl.textContent = '—'
      this.hnrValueEl.textContent     = '—'
      this.jitterBadgeEl.textContent  = ''
      this.shimmerBadgeEl.textContent = ''
      this.hnrBadgeEl.textContent     = ''
      this.interpretationEl.textContent = t('quality.waiting')
      return
    }

    if (m.jitter !== null) {
      const lvl = jitterLevel(m.jitter)
      this.jitterValueEl.textContent  = `${m.jitter.toFixed(2)} %`
      this.jitterBadgeEl.textContent  = t(levelKey(lvl))
      this.jitterBadgeEl.style.color  = LEVEL_COLOR[lvl]
    }

    if (m.shimmer !== null) {
      const lvl = shimmerLevel(m.shimmer)
      this.shimmerValueEl.textContent  = `${m.shimmer.toFixed(2)} %`
      this.shimmerBadgeEl.textContent  = t(levelKey(lvl))
      this.shimmerBadgeEl.style.color  = LEVEL_COLOR[lvl]
    }

    if (m.hnr !== null) {
      const lvl = hnrLevel(m.hnr)
      this.hnrValueEl.textContent  = `${m.hnr.toFixed(1)} dB`
      this.hnrBadgeEl.textContent  = t(hnrLevelKey(lvl))
      this.hnrBadgeEl.style.color  = LEVEL_COLOR[lvl]
    }

    this.interpretationEl.textContent = globalInterpretation(m)
  }
}
