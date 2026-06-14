import { el } from '../../lib/dom'

export class Meter {
  private readonly root: HTMLElement
  private readonly fill: HTMLElement

  constructor(label = 'Volume') {
    this.fill = el('div', { class: 'meter__fill', style: 'width: 0%' })
    this.root = el('div', {
      class: 'meter',
      role: 'meter',
      'aria-label': label,
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '0',
    }, this.fill)
  }

  update(normalized: number): void {
    const pct = Math.round(normalized * 100)
    this.fill.style.width = `${pct}%`
    this.root.setAttribute('aria-valuenow', String(pct))
  }

  get element(): HTMLElement { return this.root }
}
