import { el } from '../../lib/dom'
import { TabBar } from './TabBar'
import type { Store } from '../../app/store'
import type { AppState } from '../../app/state'
import { navigate } from '../../app/router'
import { t, getLang, setLang } from '../../i18n/strings'

export class AppShell {
  private readonly root: HTMLElement
  private readonly contentZone: HTMLElement
  private readonly tabBar: TabBar
  private readonly homeBtn: HTMLButtonElement
  private unsubscribe: (() => void) | null = null

  constructor(store: Store<AppState>) {
    this.tabBar = new TabBar(store)

    this.homeBtn = el('button', { class: 'header__home' }, t('header.home')) as HTMLButtonElement
    this.homeBtn.addEventListener('click', () => navigate(store, 'landing'))

    const langBtn = el('button', { class: 'lang-toggle', 'aria-label': t('a11y.switchLanguage') },
      getLang() === 'en' ? 'FR' : 'EN',
    ) as HTMLButtonElement
    langBtn.addEventListener('click', () => {
      setLang(getLang() === 'en' ? 'fr' : 'en')
      location.reload()
    })

    const header = el('header', { class: 'header' },
      el('span', { class: 'header__title' }, `🎙 ${t('app.title')}`),
      this.homeBtn,
      langBtn,
    )

    const nav = el('nav', { 'aria-label': t('a11y.nav') })

    this.contentZone = el('main', {
      class: 'content',
      id: 'main-content',
      tabindex: '-1',
    })

    const footer = el('footer', { role: 'contentinfo', class: 'footer' },
      el('p', {}, t('footer.privacy')),
      el('p', {}, t('footer.disclaimer')),
      el('a', {
        href: 'https://github.com/kushiemoon-dev/voice-tools',
        class: 'footer__link',
        target: '_blank',
        rel: 'noopener noreferrer',
      }, t('footer.openSource')),
    )

    const skipLink = el('a', {
      class: 'skip-link',
      href: '#main-content',
    }, t('a11y.skipToContent'))

    this.root = el('div', { class: 'app-shell app-shell--landing' },
      skipLink, header, nav, this.contentZone, footer,
    )

    this.tabBar.mount(nav)

    // Subscribe to store for screen-aware class toggle
    this.unsubscribe = store.subscribe((state) => {
      this.applyScreen(state)
    })
    // Apply initial state
    this.applyScreen(store.getState())
  }

  private firstContent = true

  private applyScreen(state: AppState): void {
    const onTool = state.screen === 'tool'
    this.root.classList.toggle('app-shell--landing', !onTool)
    this.root.classList.toggle('app-shell--tool', onTool)
    if (onTool && state.micStatus === 'granted') {
      this.contentZone.setAttribute('role', 'tabpanel')
      this.contentZone.setAttribute('aria-labelledby', `tab-${state.activeMode}`)
    } else {
      this.contentZone.removeAttribute('role')
      this.contentZone.removeAttribute('aria-labelledby')
    }
  }

  mount(parent: Element): void { parent.append(this.root) }

  setContent(child: Element): void {
    this.contentZone.replaceChildren(child)
    // Focus le tabpanel après navigation (pas au premier rendu)
    if (!this.firstContent) {
      this.contentZone.focus()
    }
    this.firstContent = false
  }

  destroy(): void {
    this.tabBar.destroy()
    this.unsubscribe?.()
  }
}
