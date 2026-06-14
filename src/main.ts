import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import { App } from './app/App'
import { el } from './lib/dom'
import { t, getLang } from './i18n/strings'

// Sync <html lang> with persisted/detected language before first render
document.documentElement.lang = getLang()

const root = document.getElementById('app')
if (!root) throw new Error('#app element not found in DOM')

const app = new App(root)
app.start()

// PWA service worker registration + update toast
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      const updateSW = registerSW({
        onNeedRefresh() {
          const toast = el(
            'div',
            {
              role: 'status',
              style:
                'position:fixed;bottom:1rem;right:1rem;z-index:100;background:var(--surface-raised,#21262d);border:1px solid var(--trans-blue,#5bcefa);border-radius:8px;padding:0.75rem 1rem;display:flex;gap:0.75rem;align-items:center;font-size:0.875rem;',
            },
            el('span', {}, t('pwa.updateAvailable')),
          )
          const btn = el('button', { class: 'btn btn--primary', style: 'padding:0.25rem 0.75rem;font-size:0.8rem;' }, t('pwa.reload')) as HTMLButtonElement
          btn.addEventListener('click', () => { void updateSW(true) })
          toast.append(btn)
          document.body.append(toast)
        },
        onOfflineReady() {
          // App ready to work offline — no user-visible notification needed
        },
      })
    })
    .catch(() => {
      // SW registration failed silently — app still works online
    })
}
