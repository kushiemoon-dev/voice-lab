// Piano-like harmonics: [frequency ratio, relative amplitude]
const PIANO_PARTIALS: Array<[number, number]> = [
  [1.0, 0.50],
  [2.0, 0.25],
  [3.0, 0.15],
  [4.0, 0.08],
  [5.0, 0.04],
  [6.0, 0.02],
]
const PIANO_DECAY_S = 2.5

export class TonePlayer {
  private ctx: AudioContext | null = null
  private oscs: OscillatorNode[] = []
  private masterGain: GainNode | null = null

  play(freqHz: number, audioCtx?: AudioContext): void {
    this.stop()
    this.ctx = audioCtx ?? new AudioContext()
    const now = this.ctx.currentTime

    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0, now)
    this.masterGain.gain.linearRampToValueAtTime(0.35, now + 0.004)
    this.masterGain.gain.exponentialRampToValueAtTime(0.12, now + 0.08)
    this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + PIANO_DECAY_S)
    this.masterGain.connect(this.ctx.destination)

    this.oscs = PIANO_PARTIALS.map(([ratio, amp]) => {
      const osc = this.ctx!.createOscillator()
      const g = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.value = freqHz * ratio
      g.gain.value = amp
      osc.connect(g)
      g.connect(this.masterGain!)
      osc.start(now)
      osc.stop(now + PIANO_DECAY_S + 0.1)
      return osc
    })
  }

  stop(): void {
    if (!this.ctx || !this.masterGain) return
    const now = this.ctx.currentTime
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.03)
    this.oscs.forEach(osc => { try { osc.stop(now + 0.05) } catch {} })
    this.oscs = []
    this.masterGain = null
  }

  isPlaying(): boolean { return this.masterGain !== null }
}
