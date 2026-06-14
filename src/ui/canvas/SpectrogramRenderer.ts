import { setupHiDpiCanvas } from './canvasUtils'

const COLOR_STOPS = [
  { t: 0.0,  r: 14,  g: 17,  b: 22  },
  { t: 0.2,  r: 20,  g: 40,  b: 80  },
  { t: 0.45, r: 91,  g: 206, b: 250 },
  { t: 0.7,  r: 200, g: 220, b: 255 },
  { t: 0.85, r: 245, g: 169, b: 184 },
  { t: 1.0,  r: 255, g: 255, b: 255 },
]

function interpColor(t: number): [number, number, number] {
  let lo = COLOR_STOPS[0]!
  let hi = COLOR_STOPS[COLOR_STOPS.length - 1]!
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (t >= COLOR_STOPS[i]!.t && t <= COLOR_STOPS[i + 1]!.t) {
      lo = COLOR_STOPS[i]!
      hi = COLOR_STOPS[i + 1]!
      break
    }
  }
  const f = hi.t === lo.t ? 0 : (t - lo.t) / (hi.t - lo.t)
  return [
    Math.round(lo.r + (hi.r - lo.r) * f),
    Math.round(lo.g + (hi.g - lo.g) * f),
    Math.round(lo.b + (hi.b - lo.b) * f),
  ]
}

export class SpectrogramRenderer {
  private ctx2d: CanvasRenderingContext2D
  private width = 800
  private height = 260
  private sampleRate = 48000
  private freqBinCount = 2048

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx2d = setupHiDpiCanvas(canvas, this.width, this.height)
  }

  resize(w: number, h: number): void {
    const existing = this.ctx2d.getImageData(0, 0, this.width, this.height)
    this.width = w
    this.height = h
    this.ctx2d = setupHiDpiCanvas(this.canvas, w, h)
    this.ctx2d.putImageData(existing, 0, 0)
  }

  setSampleRate(sr: number, binCount: number): void {
    this.sampleRate = sr
    this.freqBinCount = binCount
  }

  render(freqData: Float32Array): void {
    const { ctx2d: ctx, width: W, height: H } = this
    const nyquist = this.sampleRate / 2
    const maxFreq = 8000
    const maxBin = Math.floor((maxFreq / nyquist) * this.freqBinCount)
    const usedBins = Math.min(maxBin, freqData.length)

    // Décaler l'image d'1px vers la gauche
    const imageData = ctx.getImageData(1, 0, W - 1, H)
    ctx.putImageData(imageData, 0, 0)

    // Nouvelle colonne à droite (x = W-1)
    const col = ctx.createImageData(1, H)
    for (let row = 0; row < H; row++) {
      const freqRatio = 1 - row / H
      const binIndex = Math.floor(freqRatio * usedBins)
      const db = freqData[binIndex] ?? -90
      const normalized = Math.max(0, Math.min(1, (db + 90) / 90))
      const [r, g, b] = interpColor(normalized)
      const idx = row * 4
      col.data[idx]     = r
      col.data[idx + 1] = g
      col.data[idx + 2] = b
      col.data[idx + 3] = 255
    }
    ctx.putImageData(col, W - 1, 0)

    // Labels fréquence axe Y (droite)
    ctx.fillStyle = 'rgba(240,246,252,0.5)'
    ctx.font = '9px system-ui, sans-serif'
    ctx.textAlign = 'left'
    for (const freq of [1000, 2000, 4000, 8000]) {
      if (freq > maxFreq) break
      const y = H - (freq / maxFreq) * H
      ctx.fillText(freq >= 1000 ? `${freq / 1000}k` : `${freq}`, W - 28, y + 3)
    }
  }
}
