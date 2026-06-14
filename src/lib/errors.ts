import { t } from '../i18n/strings'

export type MicErrorKind =
  | 'permission-denied'
  | 'no-device'
  | 'insecure-context'
  | 'unsupported-browser'
  | 'unknown'

export interface MicError {
  readonly kind: MicErrorKind
  readonly message: string
}

const MESSAGES: Record<MicErrorKind, string> = {
  'permission-denied':   t('error.micPermissionDenied'),
  'no-device':           t('error.micNoDevice'),
  'insecure-context':    t('error.micInsecureContext'),
  'unsupported-browser': t('error.micUnsupportedBrowser'),
  'unknown':             t('error.micUnknown'),
}

export const micError = (kind: MicErrorKind): MicError => ({ kind, message: MESSAGES[kind] })

export const mapDomException = (e: unknown): MicError => {
  if (e instanceof DOMException) {
    if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') return micError('permission-denied')
    if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') return micError('no-device')
  }
  return micError('unknown')
}
