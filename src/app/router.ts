// History API router — two screens: 'landing' (/) and 'tool' (/app).
// location.pathname is the source of truth; store state is derived from it.

import type { Store } from './store'
import type { AppState, Screen } from './state'

export function screenFromPath(pathname: string): Screen {
  return pathname === '/app' ? 'tool' : 'landing'
}

export function pathForScreen(screen: Screen): string {
  return screen === 'tool' ? '/app' : '/'
}

/** Navigate to a screen via pushState + store sync.
 *  pushState does NOT fire popstate, so we update the store directly. */
export function navigate(store: Store<AppState>, screen: Screen): void {
  const path = pathForScreen(screen)
  if (location.pathname !== path) history.pushState({ screen }, '', path)
  store.setState({ screen })
}

/**
 * Initialise the router: set initial screen from current pathname, then listen
 * for popstate events (browser back/forward) and sync the store.
 * Returns a cleanup function that removes the listener.
 */
export function initRouter(store: Store<AppState>): () => void {
  store.setState({ screen: screenFromPath(location.pathname) })

  const handler = (): void => {
    store.setState({ screen: screenFromPath(location.pathname) })
  }
  window.addEventListener('popstate', handler)
  return () => window.removeEventListener('popstate', handler)
}
