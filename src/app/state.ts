import type { MicError } from '../lib/errors'

export type MicStatus = 'idle' | 'requesting' | 'granted' | 'error'
export type ActiveMode = 'pitch' | 'tones' | 'phrases' | 'record' | 'labo'
export type Screen = 'landing' | 'tool'

export interface AppState {
  readonly micStatus: MicStatus
  readonly micError: MicError | null
  readonly activeMode: ActiveMode
  readonly sampleRate: number
  readonly screen: Screen
}

export const initialState: AppState = {
  micStatus: 'idle',
  micError: null,
  activeMode: 'pitch',
  sampleRate: 48000,
  screen: 'landing',
}
