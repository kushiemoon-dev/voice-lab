export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

export interface Note {
  readonly name: string
  readonly hz: number
  readonly midi: number
}

function buildNotes(): Note[] {
  const notes: Note[] = []
  for (let midi = 24; midi <= 96; midi++) {
    const octave = Math.floor(midi / 12) - 1
    const name = NOTE_NAMES[midi % 12] ?? 'C'
    const hz = 440 * Math.pow(2, (midi - 69) / 12)
    notes.push({ name: `${name}${octave}`, hz, midi })
  }
  return notes
}

export const NOTES: readonly Note[] = buildNotes()

export const hzToNoteName = (hz: number): string => {
  let closest = NOTES[0]
  let minDiff = Infinity
  for (const note of NOTES) {
    const diff = Math.abs(note.hz - hz)
    if (diff < minDiff) { minDiff = diff; closest = note }
  }
  return closest?.name ?? '?'
}
