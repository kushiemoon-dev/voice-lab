import { setupHiDpiCanvas, clearCanvas } from './canvasUtils'
import { hzToNoteName } from '../../domain/noteFrequencies'
import type { Harmonic } from '../../analysis/harmonics'

const BG_COLOR = '#0e1116'
const FUNDAMENTAL_COLOR = '#f5a9b8'
const HARMONIC_COLOR = '#5bcefa'
const MAX_FREQ_DISPLAY = 8000

export class HarmonicsRenderer {
  private ctx2d: CanvasRenderingContext2D
  private width = 800
  private height = 260

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx2d = setupHiDpiCanvas(canvas, this.width, this.height)
  }

  resize(w: number, h: number): void {
    this.width = w
    this.height = h
    this.ctx2d = setupHiDpiCanvas(this.canvas, w, h)
  }

  render(freqData: Float32Array, harmonics: Harmonic[], sampleRate: number, binCount: number): void {
    const { ctx2d: ctx, width: W, height: H } = this
    clearCanvas(ctx, W, H, BG_COLOR)

    const nyquist = sampleRate / 2
    const maxBin = Math.floor(MAX_FREQ_DISPLAY / nyquist * binCount)
    const usedBins = Math.min(maxBin, freqData.length)

    // Spectre de fond en gris discret
    const barW = W / usedBins
    for (let i = 0; i < usedBins; i++) {
      const db = freqData[i] ?? -100
      const norm = Math.max(0, Math.min(1, (db + 90) / 90))
      const h = norm * (H - 30)
      ctx.fillStyle = 'rgba(240,246,252,0.08)'
      ctx.fillRect(i * barW, H - 30 - h, barW, h)
    }

    // Harmoniques
    for (const h of harmonics) {
      if (h.hz > MAX_FREQ_DISPLAY) continue
      const x = (h.hz / MAX_FREQ_DISPLAY) * W
      const barH = h.amplitude * (H - 50)
      const color = h.n === 1 ? FUNDAMENTAL_COLOR : HARMONIC_COLOR

      ctx.fillStyle = color
      ctx.globalAlpha = 0.85
      ctx.fillRect(x - 2, H - 30 - barH, 4, barH)
      ctx.globalAlpha = 1

      ctx.fillStyle = color
      ctx.font = '10px system-ui, sans-serif'
      ctx.textAlign = 'center'
      const labelY = H - 30 - barH - 8
      ctx.fillText(`H${h.n}`, x, Math.max(labelY, 14))
      ctx.fillStyle = 'rgba(240,246,252,0.6)'
      ctx.fillText(`${Math.round(h.hz)}Hz`, x, Math.max(labelY + 12, 26))
      if (h.n <= 4) ctx.fillText(hzToNoteName(h.hz), x, Math.max(labelY + 24, 38))
    }

    // Axe X : marqueurs de fréquence
    ctx.fillStyle = 'rgba(240,246,252,0.35)'
    ctx.font = '10px system-ui, sans-serif'
    ctx.textAlign = 'center'
    for (const freq of [500, 1000, 2000, 4000, 8000]) {
      const x = (freq / MAX_FREQ_DISPLAY) * W
      ctx.fillText(freq >= 1000 ? `${freq / 1000}k` : `${freq}`, x, H - 4)
      ctx.fillStyle = 'rgba(240,246,252,0.15)'
      ctx.fillRect(x, H - 30, 1, 22)
      ctx.fillStyle = 'rgba(240,246,252,0.35)'
    }
  }
}
