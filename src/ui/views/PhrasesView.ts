import { el } from '../../lib/dom'
import { getPhrasesByTheme, getRandomPhrase, THEME_LABELS, THEMES } from '../../domain/phrases'
import type { Phrase, PhraseTheme } from '../../domain/phrases'
import { createButton } from '../components/Button'
import { createSelect } from '../components/Select'
import { t } from '../../i18n/strings'

export class PhrasesView {
  private readonly root: HTMLElement
  private readonly textEl: HTMLElement
  private readonly counterEl: HTMLElement
  private currentIndex = 0
  private currentTheme: PhraseTheme = 'general'
  private filtered: readonly Phrase[] = getPhrasesByTheme('general')

  constructor() {
    this.textEl = el('p', {
      style: 'font-size: 1.4rem; line-height: 1.8; font-weight: 500; min-height: 3.6rem;',
      'aria-live': 'polite',
    })
    this.counterEl = el('span', { style: 'color: var(--text-muted); font-size: 0.8rem;' })

    const themeSelect = createSelect(
      THEMES.map(th => ({ value: th, label: THEME_LABELS[th] })),
      (theme) => { this.setTheme(theme) },
      t('phrases.theme'),
    )

    const btnPrev   = createButton(t('phrases.prev'),   () => { this.navigate(-1) })
    const btnNext   = createButton(t('phrases.next'),   () => { this.navigate(1) })
    const btnRandom = createButton(t('phrases.random'), () => { this.showRandom() }, 'primary')

    this.root = el('div', { class: 'view-card' },
      el('h2', { style: 'font-size: 1rem; margin-bottom: var(--space-3);' }, t('phrases.title')),
      el('p', { style: 'color: var(--text-muted); font-size: 0.875rem; margin-bottom: var(--space-3);' },
        t('phrases.subtitle'),
      ),
      el('div', { style: 'margin-bottom: var(--space-4);' }, themeSelect),
      this.textEl,
      el('div', { style: 'display: flex; gap: var(--space-2); margin-top: var(--space-4); flex-wrap: wrap;' },
        btnPrev, btnNext, btnRandom,
      ),
      el('div', { style: 'margin-top: var(--space-3);' }, this.counterEl),
    )

    this.show(0)
  }

  private setTheme(theme: PhraseTheme): void {
    this.currentTheme = theme
    this.filtered = getPhrasesByTheme(theme)
    this.show(0)
  }

  private show(index: number): void {
    this.currentIndex = index
    const phrase = this.filtered[index]
    if (!phrase) return
    this.textEl.textContent = `"${phrase.text}"`
    this.counterEl.textContent = `${t('phrases.counter')} ${index + 1} / ${this.filtered.length}`
  }

  private navigate(delta: number): void {
    const next = (this.currentIndex + delta + this.filtered.length) % this.filtered.length
    this.show(next)
  }

  private showRandom(): void {
    const current = this.filtered[this.currentIndex]
    const phrase = getRandomPhrase(current?.id, this.currentTheme)
    const idx = this.filtered.findIndex(p => p.id === phrase.id)
    if (idx >= 0) this.show(idx)
  }

  get element(): HTMLElement { return this.root }
}
