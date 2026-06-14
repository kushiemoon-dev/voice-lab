import { el } from '../../lib/dom'
import { t } from '../../i18n/strings'
import type { StringKey } from '../../i18n/strings'
import { MODES } from '../../app/modes'

// Descriptions for each mode feature card — English copy via t()
const MODE_DESCRIPTIONS: Record<string, string> = {
  pitch:   t('landing.features.pitch'),
  tones:   t('landing.features.tones'),
  phrases: t('landing.features.phrases'),
  record:  t('landing.features.record'),
  labo:    t('landing.features.labo'),
}

export class LandingView {
  private readonly root: HTMLElement

  constructor(onStart: () => void) {
    // Hero section
    const hero = el('section', { class: 'landing__hero' },
      el('h1', { class: 'landing__title' }, t('app.title')),
      el('p', { class: 'landing__tagline' }, t('landing.hero.tagline')),
      el('p', { class: 'landing__audience' }, t('landing.hero.audience')),
    )

    // CTA button
    const ctaBtn = el('button', { class: 'btn btn--primary btn--lg' }, t('landing.cta')) as HTMLButtonElement
    ctaBtn.addEventListener('click', onStart)
    const ctaSection = el('div', { class: 'landing__cta' }, ctaBtn)

    // Privacy block
    const privacyList = el('ul', { class: 'landing__privacy-list' },
      el('li', {}, t('landing.privacy.local')),
      el('li', {}, t('landing.privacy.noRecord')),
      el('li', {}, t('landing.privacy.noTrack')),
      el('li', {}, t('landing.privacy.free')),
    )
    const privacyBlock = el('div', { class: 'landing__privacy' },
      el('h2', { class: 'landing__privacy-title' }, t('landing.privacy.title')),
      privacyList,
    )

    // Feature grid — 5 cards from MODES
    const featureCards = MODES.map(mode =>
      el('div', { class: 'feature-card' },
        el('h3', { class: 'feature-card__title' }, t(`nav.${mode.id}` as StringKey)),
        el('p', { class: 'feature-card__desc' }, MODE_DESCRIPTIONS[mode.id] ?? ''),
      )
    )
    const featuresSection = el('section', { class: 'landing__features' },
      el('h2', { class: 'landing__features-title' }, t('landing.features.title')),
      el('div', { class: 'landing__features-grid' }, ...featureCards),
    )

    this.root = el('div', { class: 'landing' },
      hero,
      ctaSection,
      privacyBlock,
      featuresSection,
    )
  }

  get element(): HTMLElement { return this.root }
}
