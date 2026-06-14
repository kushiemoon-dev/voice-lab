import type { Store } from '../../app/store'
import type { AppState, ActiveMode } from '../../app/state'
import { MODES } from '../../app/modes'
import { el } from '../../lib/dom'

export class TabBar {
  private readonly root: HTMLElement
  private unsubscribe: (() => void) | null = null

  constructor(private readonly store: Store<AppState>) {
    this.root = el('div', { class: 'tabbar', role: 'tablist', 'aria-label': 'Modes' })
    MODES.forEach(mode => this.root.append(this.buildTab(mode.id, mode.label)))
  }

  private buildTab(id: ActiveMode, label: string): HTMLButtonElement {
    const btn = el('button', {
      class: 'tabbar__tab',
      role: 'tab',
      id: `tab-${id}`,
      'aria-controls': 'main-content',
      'aria-selected': 'false',
      tabindex: '-1',
    }, label)

    btn.addEventListener('click', () => { this.store.setState({ activeMode: id }) })
    btn.addEventListener('keydown', (e: KeyboardEvent) => { this.handleArrowKey(e) })
    return btn
  }

  private handleArrowKey(e: KeyboardEvent): void {
    const tabs = Array.from(this.root.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
    const idx = tabs.findIndex(t => t === e.currentTarget)
    if (idx < 0) return
    let next = idx
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length
    if (e.key === 'ArrowLeft')  next = (idx - 1 + tabs.length) % tabs.length
    if (next !== idx) {
      e.preventDefault()
      tabs[next]?.click()
      tabs[next]?.focus()
    }
  }

  mount(parent: Element): void {
    parent.append(this.root)
    this.unsubscribe = this.store.subscribe(s => this.update(s.activeMode))
    this.update(this.store.getState().activeMode)
  }

  private update(activeMode: ActiveMode): void {
    this.root.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach(tab => {
      const isActive = tab.id === `tab-${activeMode}`
      tab.setAttribute('aria-selected', String(isActive))
      tab.setAttribute('tabindex', isActive ? '0' : '-1')
    })
  }

  destroy(): void { this.unsubscribe?.() }
}
