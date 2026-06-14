import { el } from '../../lib/dom'
import { SpectrogramRenderer } from '../canvas/SpectrogramRenderer'
import type { AudioEngine } from '../../audio/AudioEngine'
import { createResizeObserver } from '../canvas/canvasUtils'
import { t } from '../../i18n/strings'

export class SpectrogramView {
  private readonly root: HTMLElement
  private readonly canvas: HTMLCanvasElement
  private readonly canvasWrap: HTMLElement
  private readonly renderer: SpectrogramRenderer
  private unsubFreq: (() => void) | null = null
  private resizeObserver: ResizeObserver | null = null

  constructor(private readonly engine: AudioEngine) {
    this.canvas = el('canvas', {
      style: 'width:100%;display:block;border-radius:8px;',
      'aria-hidden': 'true',
    })
    this.canvasWrap = el('div', { style: 'width:100%;' }, this.canvas)
    this.renderer = new SpectrogramRenderer(this.canvas)

    this.root = el('div', {},
      el('p', {
        style: 'font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-3);',
      }, t('spectrogram.description')),
      this.canvasWrap,
    )
  }

  mount(): void {
    this.renderer.setSampleRate(this.engine.getSampleRate(), this.engine.getFreqBinCount())
    this.resizeObserver = createResizeObserver(this.canvasWrap, (w) => {
      this.renderer.resize(w, 260)
    })
    this.unsubFreq = this.engine.onFreqFrame(data => {
      this.renderer.render(data)
    })
  }

  destroy(): void {
    this.unsubFreq?.()
    this.resizeObserver?.disconnect()
  }

  get element(): HTMLElement { return this.root }
}
