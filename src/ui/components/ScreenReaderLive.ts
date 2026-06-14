import { el } from '../../lib/dom'

export class ScreenReaderLive {
  private readonly region: HTMLElement
  private lastAnnounced = ''
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly throttleMs = 2000) {
    this.region = el('div', {
      class: 'sr-only',
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    })
  }

  announce(text: string): void {
    if (text === this.lastAnnounced || this.timer !== null) return
    this.lastAnnounced = text
    this.region.textContent = text
    this.timer = setTimeout(() => { this.timer = null }, this.throttleMs)
  }

  get element(): HTMLElement { return this.region }
}
