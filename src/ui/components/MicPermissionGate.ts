import type { Store } from '../../app/store'
import type { AppState } from '../../app/state'
import { el } from '../../lib/dom'
import { requestMicrophone } from '../../audio/microphone'
import { isOk } from '../../lib/result'
import { t } from '../../i18n/strings'

export class MicPermissionGate {
  private readonly root: HTMLElement

  constructor(
    private readonly store: Store<AppState>,
    private readonly onGranted: (stream: MediaStream) => void,
  ) {
    this.root = el('div', {
      class: 'view-card',
      style: 'max-width: 480px; margin: 4rem auto; text-align: center;',
    })
    this.render()
  }

  private render(): void {
    const state = this.store.getState()

    if (state.micStatus === 'error' && state.micError) {
      this.root.replaceChildren(
        el('p', { style: 'color: var(--error); margin-bottom: 1rem;' },
          `⚠ ${state.micError.message}`
        ),
        this.buildButton(),
      )
      return
    }

    if (state.micStatus === 'requesting') {
      this.root.replaceChildren(
        el('p', { style: 'color: var(--text-muted);' }, t('gate.requesting')),
      )
      return
    }

    this.root.replaceChildren(
      el('h2', { style: 'margin-bottom: 1rem; font-size: 1.1rem;' }, t('gate.title')),
      el('p', { style: 'color: var(--text-muted); margin-bottom: 1.5rem;' },
        t('gate.description')
      ),
      this.buildButton(),
    )
  }

  private buildButton(): HTMLButtonElement {
    const btn = el('button', { class: 'btn btn--primary' }, t('gate.button'))
    btn.addEventListener('click', () => { void this.handleClick() })
    return btn
  }

  private async handleClick(): Promise<void> {
    this.store.setState({ micStatus: 'requesting' })
    this.render()
    const result = await requestMicrophone()
    if (isOk(result)) {
      this.onGranted(result.value)
    } else {
      this.store.setState({ micStatus: 'error', micError: result.error })
      this.render()
    }
  }

  get element(): HTMLElement { return this.root }
}
