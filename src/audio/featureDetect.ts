export interface FeatureSupport {
  readonly isSecureContext: boolean
  readonly hasMediaDevices: boolean
  readonly hasAudioContext: boolean
  readonly hasAudioWorklet: boolean
}

export const detectFeatures = (): FeatureSupport => ({
  isSecureContext: window.isSecureContext,
  hasMediaDevices: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
  hasAudioContext: 'AudioContext' in window || 'webkitAudioContext' in window,
  hasAudioWorklet: 'AudioWorklet' in window,
})

export const isFullySupported = (f: FeatureSupport): boolean =>
  f.isSecureContext && f.hasMediaDevices && f.hasAudioContext
