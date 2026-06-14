import { el } from '../../lib/dom'
import { SpectrumView } from './SpectrumView'
import { SpectrogramView } from './SpectrogramView'
import { StatsView } from './StatsView'
import { HarmonicsView } from './HarmonicsView'
import { VoiceQualityView } from './VoiceQualityView'
import type { AudioEngine } from '../../audio/AudioEngine'
import { t } from '../../i18n/strings'

type LaboTab = 'spectrum' | 'spectrogram' | 'harmonics' | 'stats' | 'quality'

export class LaboView {
  private readonly root: HTMLElement
  private readonly contentZone: HTMLElement
  private currentTab: LaboTab = 'spectrum'
  private currentSubView: { destroy?(): void } | null = null

  constructor(private readonly engine: AudioEngine) {
    // Construit à l'instanciation (pas au chargement du module) → reflète la langue courante
    const LABO_TABS: { id: LaboTab; label: string }[] = [
      { id: 'spectrum',    label: t('labo.tab.spectrum')    },
      { id: 'spectrogram', label: t('labo.tab.spectrogram') },
      { id: 'harmonics',   label: t('labo.tab.harmonics')   },
      { id: 'stats',       label: t('labo.tab.stats')       },
      { id: 'quality',     label: t('labo.tab.quality')     },
    ]

    this.contentZone = el('div', {
      id: 'labo-panel',
      role: 'tabpanel',
      tabindex: '-1',
      style: 'margin-top: var(--space-4);',
    })

    const tabButtons: HTMLButtonElement[] = []
    const nav = el('div', {
      role: 'tablist',
      'aria-label': t('labo.navLabel'),
      style: 'display:flex;gap:var(--space-2);flex-wrap:wrap;border-bottom:1px solid var(--border);padding-bottom:var(--space-2);',
    })

    for (const tab of LABO_TABS) {
      const isFirst = tab.id === 'spectrum'
      const btn = el('button', {
        role: 'tab',
        id: `labo-tab-${tab.id}`,
        'aria-selected': isFirst ? 'true' : 'false',
        'aria-controls': 'labo-panel',
        tabindex: isFirst ? '0' : '-1',
        style: 'padding:var(--space-2) var(--space-3);border:none;background:none;cursor:pointer;font-size:0.875rem;border-bottom:2px solid transparent;',
      }, tab.label) as HTMLButtonElement

      btn.style.color = isFirst ? 'var(--trans-blue)' : 'var(--text-muted)'
      if (isFirst) btn.style.borderBottomColor = 'var(--trans-blue)'

      btn.addEventListener('click', () => {
        this.switchTab(tab.id, tabButtons, LABO_TABS.map(t => t.id))
      })
      btn.addEventListener('keydown', (e: KeyboardEvent) => {
        this.handleArrowKey(e, tabButtons)
      })
      tabButtons.push(btn)
      nav.append(btn)
    }

    this.root = el('div', { class: 'view-card', style: 'padding:var(--space-6);' },
      el('h2', { style: 'font-size:1rem;margin-bottom:var(--space-4);' }, t('labo.title')),
      nav,
      this.contentZone,
    )
  }

  private handleArrowKey(e: KeyboardEvent, buttons: HTMLButtonElement[]): void {
    const idx = buttons.findIndex(b => b === e.currentTarget)
    if (idx < 0) return
    let next = idx
    if (e.key === 'ArrowRight') next = (idx + 1) % buttons.length
    if (e.key === 'ArrowLeft')  next = (idx - 1 + buttons.length) % buttons.length
    if (next !== idx) {
      e.preventDefault()
      buttons[next]?.click()
      buttons[next]?.focus()
    }
  }

  private switchTab(tabId: LaboTab, buttons: HTMLButtonElement[], ids: LaboTab[]): void {
    this.currentSubView?.destroy?.()
    this.currentTab = tabId

    buttons.forEach((btn, i) => {
      const active = ids[i] === tabId
      btn.setAttribute('aria-selected', active ? 'true' : 'false')
      btn.setAttribute('tabindex', active ? '0' : '-1')
      btn.style.color = active ? 'var(--trans-blue)' : 'var(--text-muted)'
      btn.style.borderBottomColor = active ? 'var(--trans-blue)' : 'transparent'
    })

    this.contentZone.setAttribute('aria-labelledby', `labo-tab-${tabId}`)
    this.contentZone.replaceChildren(this.buildTabContent(tabId))
  }

  private buildTabContent(tabId: LaboTab): HTMLElement {
    if (tabId === 'spectrum') {
      const view = new SpectrumView(this.engine)
      view.mount()
      this.currentSubView = view
      return view.element
    }

    if (tabId === 'spectrogram') {
      const view = new SpectrogramView(this.engine)
      view.mount()
      this.currentSubView = view
      return view.element
    }

    if (tabId === 'stats') {
      const view = new StatsView(this.engine)
      view.mount()
      this.currentSubView = view
      return view.element
    }

    if (tabId === 'harmonics') {
      const view = new HarmonicsView(this.engine)
      view.mount()
      this.currentSubView = view
      return view.element
    }

    // quality
    const view = new VoiceQualityView(this.engine)
    view.mount()
    this.currentSubView = view
    return view.element
  }

  mount(): void {
    this.contentZone.setAttribute('aria-labelledby', 'labo-tab-spectrum')
    this.contentZone.replaceChildren(this.buildTabContent('spectrum'))
  }

  destroy(): void {
    this.currentSubView?.destroy?.()
  }

  get element(): HTMLElement { return this.root }
}
