import { createStore } from './store'
import { initialState } from './state'
import type { ActiveMode, AppState } from './state'
import { AppShell } from '../ui/layout/AppShell'
import { MicPermissionGate } from '../ui/components/MicPermissionGate'
import { createAudioEngine } from '../audio/AudioEngine'
import { detectFeatures, isFullySupported } from '../audio/featureDetect'
import { el } from '../lib/dom'
import { PitchView } from '../ui/views/PitchView'
import { TonesView } from '../ui/views/TonesView'
import { PhrasesView } from '../ui/views/PhrasesView'
import { RecordView } from '../ui/views/RecordView'
import { LaboView } from '../ui/views/LaboView'
import { initRouter, navigate } from './router'
import { LandingView } from '../ui/views/LandingView'
import { t } from '../i18n/strings'

export class App {
  private readonly store = createStore(initialState)
  private readonly shell: AppShell
  private readonly engine = createAudioEngine()
  private currentView: { element: HTMLElement; destroy?(): void } | null = null
  private currentStream: MediaStream | null = null
  private landingView: LandingView | null = null
  private gateActive = false

  constructor(private readonly root: Element) {
    this.shell = new AppShell(this.store)
  }

  start(): void {
    this.shell.mount(this.root)

    const features = detectFeatures()
    if (!isFullySupported(features)) {
      this.shell.setContent(el(
        'div',
        { class: 'view-card', style: 'padding: 2rem; text-align: center;' },
        el('p', { style: 'color: var(--error, #f85149); font-size: 1.1rem;' },
          t('app.unsupported')),
        el('p', { style: 'color: var(--text-muted, #8b949e); font-size: 0.9rem; margin-top: 0.5rem;' },
          t('app.unsupportedHint')),
      ))
      return
    }

    initRouter(this.store)

    let prev = this.store.getState()
    this.store.subscribe((state) => {
      // Update prev BEFORE dispatch so any re-entrant setState sees screenChanged=false
      const before = prev
      prev = state
      this.renderScreen(state, before)
    })

    // Render initial state (initRouter may not have fired subscriber if screen unchanged)
    this.renderScreen(this.store.getState(), prev)
  }

  private renderScreen(state: AppState, prev: AppState): void {
    const screenChanged = state.screen !== prev.screen
    const micChanged = state.micStatus !== prev.micStatus
    const modeChanged = state.activeMode !== prev.activeMode

    if (state.screen === 'landing') {
      if (screenChanged || !this.landingView) {
        // Create/reuse landing view BEFORE any setState (prevents re-entrancy from finding !landingView)
        if (!this.landingView) {
          this.landingView = new LandingView(() => navigate(this.store, 'tool'))
        }

        // Destroy current tool view + stop mic on leaving tool
        if (this.currentView?.destroy) this.currentView.destroy()
        this.currentView = null
        this.gateActive = false

        if (this.currentStream) {
          this.currentStream.getTracks().forEach(track => track.stop())
          this.currentStream = null
        }
        void this.engine.stop()

        this.shell.setContent(this.landingView.element)
        // setState last — with prev updated before dispatch, re-entrant call sees screenChanged=false
        this.store.setState({ micStatus: 'idle', micError: null })
      }
      return
    }

    // screen === 'tool'
    if (state.micStatus !== 'granted') {
      // Only rebuild gate when: entering tool, losing mic access (granted→non-granted), or initial render.
      // Do NOT rebuild on idle→requesting or requesting→error — the gate owns those transitions.
      const lostAccess = micChanged && prev.micStatus === 'granted'
      if (screenChanged || lostAccess || !this.gateActive) {
        if (this.currentView?.destroy) this.currentView.destroy()
        this.currentView = null
        this.gateActive = true
        const gate = new MicPermissionGate(this.store, async (stream) => {
          this.currentStream = stream
          const result = await this.engine.start(stream)
          if (!result.ok) {
            this.store.setState({ micStatus: 'error', micError: result.error })
            return
          }
          this.store.setState({ micStatus: 'granted' })
        })
        this.shell.setContent(gate.element)
      }
      return
    }

    // Mic granted — show/update tool view
    this.gateActive = false
    if ((screenChanged || micChanged || modeChanged) && this.currentStream) {
      this.showView(state.activeMode, this.currentStream)
    }
  }

  private showView(mode: ActiveMode, stream: MediaStream): void {
    if (this.currentView?.destroy) this.currentView.destroy()

    let view: { element: HTMLElement; destroy?(): void }

    // Pour les vues avec mount(parent), on passe un div hors-DOM afin d'initialiser
    // les observers internes ; setContent() prend ensuite view.element directement.
    const offscreen = el('div', {})

    switch (mode) {
      case 'pitch': {
        const pitchView = new PitchView(this.engine)
        pitchView.mount(offscreen)
        view = pitchView
        break
      }
      case 'tones':
        view = new TonesView(this.engine)
        break
      case 'phrases':
        view = new PhrasesView()
        break
      case 'record': {
        const recordView = new RecordView()
        void recordView.mount(offscreen, stream, this.engine)
        view = recordView
        break
      }
      case 'labo': {
        const laboView = new LaboView(this.engine)
        laboView.mount()
        view = laboView
        break
      }
    }

    this.currentView = view
    this.shell.setContent(view.element)
  }
}
