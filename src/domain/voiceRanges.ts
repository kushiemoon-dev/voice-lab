export interface VoiceRange {
  readonly id: 'masculine' | 'feminine' | 'nonbinary'
  readonly label: string
  readonly minHz: number
  readonly maxHz: number
  readonly color: string
}

export const MIN_DISPLAY_HZ = 60
export const MAX_DISPLAY_HZ = 500

export const VOICE_RANGES: readonly VoiceRange[] = [
  { id: 'masculine', label: 'Voix masculine',          minHz: 85,  maxHz: 180, color: 'rgba(91, 206, 250, 0.18)' },
  { id: 'nonbinary', label: 'Non-binaire / androgyne', minHz: 145, maxHz: 215, color: 'rgba(255, 255, 255, 0.10)' },
  { id: 'feminine',  label: 'Voix féminine',           minHz: 165, maxHz: 255, color: 'rgba(245, 169, 184, 0.18)' },
]

export const getRangesForHz = (hz: number): readonly VoiceRange[] =>
  VOICE_RANGES.filter(r => hz >= r.minHz && hz <= r.maxHz)
