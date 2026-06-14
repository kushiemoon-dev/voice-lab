import { el } from '../../lib/dom'
import { SpectrumRenderer } from '../canvas/SpectrumRenderer'
import type { AudioEngine } from '../../audio/AudioEngine'
import { createResizeObserver } from '../canvas/canvasUtils'
import { ScreenReaderLive } from '../components/ScreenReaderLive'
import { t } from '../../i18n/strings'

const SILENCE_DB = -80

export class SpectrumView {
  private readonly root: HTMLElement
  private readonly canvas: HTMLCanvasElement
  private readonly canvasWrap: HTMLElement
  private readonly renderer: SpectrumRenderer
  private readonly liveRegion = new ScreenReaderLive(3000)
  private sampleRate = 0
  private freqBinCount = 0
  private unsubFreq: (() => void) | null = null
  private resizeObserver: ResizeObserver | null = null

  constructor(private readonly engine: AudioEngine) {
    this.canvas = el('canvas', { style: 'width:100%;display:block;border-radius:8px;', 'aria-hidden': 'true' })
    this.canvasWrap = el('div', { style: 'width:100%;' }, this.canvas)
    this.renderer = new SpectrumRenderer(this.canvas)

    this.root = el('div', {},
      el('p', { style: 'font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-3);' },
        t('spectrum.description')),
      this.canvasWrap,
      this.liveRegion.element,
    )
  }

  mount(): void {
    this.sampleRate = this.engine.getSampleRate()
    this.freqBinCount = this.engine.getFreqBinCount()
    this.renderer.setSampleRate(this.sampleRate, this.freqBinCount)
    this.resizeObserver = createResizeObserver(this.canvasWrap, (w) => {
      this.renderer.resize(w, 260)
    })
    this.unsubFreq = this.engine.onFreqFrame(data => {
      this.renderer.render(data)
      if (this.freqBinCount > 0) {
        let peakBin = 1
        for (let i = 2; i < data.length; i++) {
          if ((data[i] ?? -Infinity) > (data[peakBin] ?? -Infinity)) peakBin = i
        }
        if ((data[peakBin] ?? -Infinity) > SILENCE_DB) {
          const peakHz = Math.round(peakBin * this.sampleRate / (2 * this.freqBinCount))
          this.liveRegion.announce(`${peakHz} Hz`)
        }
      }
    })
  }

  destroy(): void {
    this.unsubFreq?.()
    this.resizeObserver?.disconnect()
  }

  get element(): HTMLElement { return this.root }
}
