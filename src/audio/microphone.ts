import type { Result } from '../lib/result'
import type { MicError } from '../lib/errors'
import { ok, err } from '../lib/result'
import { mapDomException, micError } from '../lib/errors'
import { detectFeatures } from './featureDetect'

export const requestMicrophone = async (): Promise<Result<MediaStream, MicError>> => {
  const features = detectFeatures()
  if (!features.isSecureContext) return err(micError('insecure-context'))
  if (!features.hasMediaDevices) return err(micError('unsupported-browser'))

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      video: false,
    })
    return ok(stream)
  } catch (e) {
    return err(mapDomException(e))
  }
}

export const releaseMicrophone = (stream: MediaStream): void => {
  stream.getTracks().forEach(t => t.stop())
}
