import { setupHiDpiCanvas, clearCanvas } from './canvasUtils'

const BG_COLOR = '#0e1116'
const LABEL_COLOR = 'rgba(240,246,252,0.45)'

const FREQ_MARKERS = [100, 200, 500, 1000, 2000, 4000, 8000]

export class SpectrumRenderer {
  private ctx2d: CanvasRenderingContext2D
  private width = 800
  private height = 260
  private sampleRate = 48000
  private freqBinCount = 2048

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx2d = setupHiDpiCanvas(canvas, this.width, this.height)
  }

  resize(w: number, h: number): void {
    this.width = w
    this.height = h
    this.ctx2d = setupHiDpiCanvas(this.canvas, w, h)
  }

  setSampleRate(sr: number, binCount: number): void {
    this.sampleRate = sr
    this.freqBinCount = binCount
  }

  render(freqData: Float32Array): void {
    const { ctx2d: ctx, width: W, height: H } = this
    clearCanvas(ctx, W, H, BG_COLOR)

    const nyquist = this.sampleRate / 2
    const maxFreq = 8000
    const maxBin = Math.floor(maxFreq / nyquist * this.freqBinCount)
    const usedBins = Math.min(maxBin, freqData.length)

    const barWidth = W / usedBins
    const PAD_TOP = 20

    for (let i = 0; i < usedBins; i++) {
      const db = freqData[i] ?? -100
      const normalized = Math.max(0, Math.min(1, (db + 90) / 90))
      const barH = normalized * (H - PAD_TOP)
      const x = i * barWidth
      const t = i / usedBins

      const r = Math.round(91  + (245 - 91)  * t)
      const g = Math.round(206 + (169 - 206) * t)
      const b = Math.round(250 + (184 - 250) * t)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(x, H - barH, barWidth, barH)
    }

    ctx.fillStyle = LABEL_COLOR
    ctx.font = '10px system-ui, sans-serif'
    ctx.textAlign = 'center'
    for (const freq of FREQ_MARKERS) {
      if (freq > maxFreq) break
      const x = (freq / maxFreq) * W
      ctx.fillText(freq >= 1000 ? `${freq / 1000}k` : `${freq}`, x, H - 4)
      ctx.fillStyle = 'rgba(240,246,252,0.2)'
      ctx.fillRect(x, H - PAD_TOP, 1, PAD_TOP - 6)
      ctx.fillStyle = LABEL_COLOR
    }
  }
}
