import { setupHiDpiCanvas, clearCanvas } from './canvasUtils'
import { pitchToY, timeToX } from './scales'
import { VOICE_RANGES } from '../../domain/voiceRanges'
import { hzToNoteName } from '../../domain/noteFrequencies'

const BG_COLOR = '#0e1116'
const PITCH_COLOR = '#ffffff'
const LABEL_COLOR = 'rgba(240, 246, 252, 0.75)'
const HISTORY_LENGTH = 300
const GRID_HZ = [80, 100, 130, 165, 200, 250, 300, 400, 500]
const PAD_LEFT = 40
const PAD_RIGHT = 34

export class PitchGraphRenderer {
  private ctx2d: CanvasRenderingContext2D
  private width = 600
  private height = 260
  private readonly history: (number | null)[] = []
  private targetHz: number | null = null

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx2d = setupHiDpiCanvas(canvas, this.width, this.height)
  }

  resize(w: number, h: number): void {
    this.width = w
    this.height = h
    this.ctx2d = setupHiDpiCanvas(this.canvas, w, h)
  }

  setTargetHz(hz: number | null): void {
    this.targetHz = hz
    this.draw()
  }

  pushPoint(hz: number | null): void {
    this.history.push(hz)
    if (this.history.length > HISTORY_LENGTH) this.history.shift()
    this.draw()
  }

  private rangeColorForHz(hz: number): string {
    const range = VOICE_RANGES.find(r => hz >= r.minHz && hz <= r.maxHz)
    if (!range) return 'rgba(255,255,255,0.6)'
    if (range.id === 'masculine') return 'rgba(91, 206, 250, 0.6)'
    if (range.id === 'feminine')  return 'rgba(245, 169, 184, 0.6)'
    return 'rgba(255, 255, 255, 0.6)'
  }

  private draw(): void {
    const { ctx2d: ctx, width: W, height: H, history } = this
    const innerW = W - PAD_LEFT - PAD_RIGHT
    clearCanvas(ctx, W, H, BG_COLOR)

    // 1. Axe Y gradué — lignes de grille horizontales avec gouttières
    ctx.save()
    ctx.font = '10px system-ui, sans-serif'
    for (const hz of GRID_HZ) {
      const y = pitchToY(hz, H)
      ctx.strokeStyle = 'rgba(240, 246, 252, 0.20)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      ctx.beginPath()
      ctx.moveTo(PAD_LEFT, y)
      ctx.lineTo(W - PAD_RIGHT, y)
      ctx.stroke()
      ctx.setLineDash([])

      // Labels Hz : right-aligné dans la gouttière gauche
      ctx.fillStyle = 'rgba(240, 246, 252, 0.45)'
      ctx.textAlign = 'right'
      ctx.fillText(`${hz}`, PAD_LEFT - 4, y - 3)

      // Labels notes : left-aligné dans la gouttière droite
      ctx.textAlign = 'left'
      ctx.fillText(hzToNoteName(hz), W - PAD_RIGHT + 4, y - 3)
    }
    ctx.restore()

    // 2. Bandes de plage de voix avec gradient vertical
    for (const range of VOICE_RANGES) {
      const yTop = pitchToY(range.maxHz, H)
      const yBot = pitchToY(range.minHz, H)
      const yMid = (yTop + yBot) / 2

      const grad = ctx.createLinearGradient(0, yTop, 0, yBot)
      const centerColor = range.color.replace(/[\d.]+\)$/, '0.28)')
      const edgeColor = range.color.replace(/[\d.]+\)$/, '0)')
      grad.addColorStop(0, edgeColor)
      grad.addColorStop(0.5, centerColor)
      grad.addColorStop(1, edgeColor)

      ctx.fillStyle = grad
      ctx.fillRect(PAD_LEFT, yTop, innerW, yBot - yTop)

      // Label de bande centré verticalement, dans la zone de tracé
      ctx.fillStyle = LABEL_COLOR
      ctx.font = 'italic 11px system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(range.label, PAD_LEFT + 6, yMid + 4)
    }

    // 3. Ligne de référence cible
    if (this.targetHz !== null) {
      const yTarget = pitchToY(this.targetHz, H)
      ctx.save()
      ctx.strokeStyle = 'rgba(245, 169, 184, 0.7)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([8, 5])
      ctx.beginPath()
      ctx.moveTo(PAD_LEFT, yTarget)
      ctx.lineTo(W - PAD_RIGHT, yTarget)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = 'rgba(245, 169, 184, 0.9)'
      ctx.font = 'bold 11px system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`Cible : ${this.targetHz} Hz (${hzToNoteName(this.targetHz)})`, PAD_LEFT + 6, yTarget - 5)
      ctx.restore()
    }

    // 4. Courbe de pitch — interpolation quadratique via points milieux
    // X aligné à droite sur la capacité fixe : le point le plus récent est
    // toujours au bord droit ; les points entrent par la droite et défilent
    // vers la gauche à vitesse constante dès le 1er point (pas de rescale).
    const dx = innerW / (HISTORY_LENGTH - 1)
    ctx.beginPath()
    let prevX: number | null = null
    let prevY: number | null = null
    let penDown = false
    history.forEach((hz, i) => {
      if (hz === null || hz <= 0) {
        penDown = false
        prevX = null
        prevY = null
        return
      }
      const x = PAD_LEFT + innerW - (history.length - 1 - i) * dx
      const y = pitchToY(hz, H)
      if (!penDown) {
        ctx.moveTo(x, y)
        penDown = true
      } else if (prevX !== null && prevY !== null) {
        const mx = (prevX + x) / 2
        const my = (prevY + y) / 2
        ctx.quadraticCurveTo(prevX, prevY, mx, my)
      }
      prevX = x
      prevY = y
    })
    // Dernier segment jusqu'au point final
    if (prevX !== null && prevY !== null) ctx.lineTo(prevX, prevY)
    ctx.strokeStyle = PITCH_COLOR
    ctx.lineWidth = 1.5
    ctx.stroke()

    // 5. Point courant + halo coloré (toujours au bord droit)
    const last = history.at(-1)
    if (last !== null && last !== undefined && last > 0) {
      const x = PAD_LEFT + innerW
      const y = pitchToY(last, H)
      const haloColor = this.rangeColorForHz(last)

      // Halo externe
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fillStyle = haloColor.replace(/[\d.]+\)$/, '0.25)')
      ctx.fill()

      // Halo intermédiaire
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = haloColor.replace(/[\d.]+\)$/, '0.45)')
      ctx.fill()

      // Point central
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = PITCH_COLOR
      ctx.fill()
    }
  }
}
