export interface VoiceRange {
  readonly id: 'low' | 'mid' | 'high'
  readonly label: string
  readonly minHz: number
  readonly maxHz: number
  readonly color: string
}

export const MIN_DISPLAY_HZ = 60
export const MAX_DISPLAY_HZ = 500

export const VOICE_RANGES: readonly VoiceRange[] = [
  { id: 'low',  label: 'Graves',  minHz: 60,  maxHz: 150, color: 'rgba(148, 163, 184, 0.10)' },
  { id: 'mid',  label: 'Médiums', minHz: 150, maxHz: 250, color: 'rgba(148, 163, 184, 0.14)' },
  { id: 'high', label: 'Aigus',   minHz: 250, maxHz: 500, color: 'rgba(148, 163, 184, 0.10)' },
]

export const getRangesForHz = (hz: number): readonly VoiceRange[] =>
  VOICE_RANGES.filter(r => hz >= r.minHz && hz <= r.maxHz)
