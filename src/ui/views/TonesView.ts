import { el } from '../../lib/dom'
import { TonePlayer } from '../../audio/tones/tonePlayer'
import { NOTES } from '../../domain/noteFrequencies'
import { createSelect } from '../components/Select'
import { createButton } from '../components/Button'
import type { AudioEngine } from '../../audio/AudioEngine'
import { t } from '../../i18n/strings'

const DISPLAY_NOTES = NOTES.filter(n => n.hz >= 80 && n.hz <= 350)

export class TonesView {
  private readonly root: HTMLElement
  private readonly player = new TonePlayer()
  private currentHz = 220
  private playBtn: HTMLButtonElement

  constructor(private readonly engine: AudioEngine) {
    const select = createSelect(
      DISPLAY_NOTES.map(n => ({ value: String(n.hz), label: `${n.name} — ${Math.round(n.hz)} Hz` })),
      (val) => { this.currentHz = parseFloat(val) },
      t('tones.selectPlaceholder'),
    )

    // Sélectionner A3 ≈ 220 Hz par défaut
    const defaultOpt = Array.from(select.options).find(o => Math.abs(parseFloat(o.value) - 220) < 5)
    if (defaultOpt) select.value = defaultOpt.value

    this.playBtn = createButton(t('tones.play'), () => { this.toggle() }, 'primary')

    this.root = el('div', { class: 'view-card' },
      el('h2', { style: 'font-size: 1rem; margin-bottom: var(--space-4);' }, t('tones.title')),
      el('p', { style: 'color: var(--text-muted); font-size: 0.875rem; margin-bottom: var(--space-4);' },
        t('tones.description'),
      ),
      el('div', { style: 'display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;' },
        select,
        this.playBtn,
      ),
    )
  }

  private toggle(): void {
    if (this.player.isPlaying()) {
      this.player.stop()
      this.playBtn.textContent = t('tones.play')
    } else {
      // Réutilise le contexte audio du moteur — évite d'ouvrir un 2e AudioContext
      this.player.play(this.currentHz, this.engine.getContext() ?? undefined)
      this.playBtn.textContent = t('tones.stop')
    }
  }

  get element(): HTMLElement { return this.root }

  destroy(): void { this.player.stop() }
}
