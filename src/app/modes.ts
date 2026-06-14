import type { ActiveMode } from './state'
import { t } from '../i18n/strings'

export interface ModeConfig {
  readonly id: ActiveMode
  readonly label: string
  readonly requiresMic: boolean
}

export const MODES: readonly ModeConfig[] = [
  { id: 'pitch',   label: t('nav.pitch'),   requiresMic: true  },
  { id: 'tones',   label: t('nav.tones'),   requiresMic: false },
  { id: 'phrases', label: t('nav.phrases'), requiresMic: false },
  { id: 'record',  label: t('nav.record'),  requiresMic: true  },
  { id: 'labo',    label: t('nav.labo'),    requiresMic: true  },
]
