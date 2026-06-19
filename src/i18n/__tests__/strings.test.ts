import { describe, it, expect, afterEach } from 'vitest'
import { t, setLang, getLang, type StringKey } from '../strings'

afterEach(() => { setLang('en') })

const allKeys: StringKey[] = [
  'app.title', 'app.tagline', 'app.unsupported', 'app.unsupportedHint',
  'nav.pitch', 'nav.tones', 'nav.phrases', 'nav.record', 'nav.labo',
  'gate.title', 'gate.description', 'gate.button', 'gate.requesting',
  'landing.hero.tagline', 'landing.hero.audience', 'landing.cta',
  'landing.privacy.title', 'landing.privacy.local', 'landing.privacy.noRecord',
  'landing.privacy.noTrack', 'landing.privacy.free',
  'landing.features.title', 'landing.features.pitch', 'landing.features.tones',
  'landing.features.phrases', 'landing.features.record', 'landing.features.labo',
  'header.home',
  'footer.privacy', 'footer.disclaimer', 'footer.openSource',
  'pitch.title', 'pitch.idle', 'pitch.target', 'pitch.targetNone',
  'pitch.band.low', 'pitch.band.mid', 'pitch.band.high',
  'pitch.volume', 'pitch.targetLabel',
  'record.privacy', 'record.listen', 'record.clear',
  'record.status.ready', 'record.title', 'record.status.initializing',
  'record.audioUnavailable', 'record.status.progress', 'record.status.cleared',
  'record.start', 'record.stop', 'record.recorded', 'record.export', 'record.workletError',
  'labo.title', 'labo.tab.spectrum', 'labo.tab.spectrogram', 'labo.tab.harmonics',
  'labo.tab.stats', 'labo.tab.quality', 'labo.navLabel',
  'stats.reset', 'stats.noData', 'stats.title', 'stats.description',
  'stats.min', 'stats.max', 'stats.mean', 'stats.range', 'stats.dominant', 'stats.frames',
  'quality.title', 'quality.jitter', 'quality.shimmer', 'quality.hnr',
  'quality.sustainedVowel', 'quality.waiting', 'quality.normal',
  'quality.issues', 'quality.warnings', 'quality.monitor',
  'quality.level.normal', 'quality.level.borderline', 'quality.level.high', 'quality.level.low',
  'pwa.updateAvailable', 'pwa.reload',
  'error.micPermissionDenied', 'error.micNoDevice', 'error.micInsecureContext',
  'error.micUnsupportedBrowser', 'error.micUnknown',
  'tones.title', 'tones.description', 'tones.selectPlaceholder', 'tones.play', 'tones.stop',
  'spectrum.description', 'spectrogram.description',
  'harmonics.description', 'harmonics.holdVowel', 'harmonics.fundamental', 'harmonics.detected',
  'phrases.title', 'phrases.subtitle', 'phrases.theme',
  'phrases.prev', 'phrases.next', 'phrases.random', 'phrases.counter',
  'quality.issue.highJitter', 'quality.issue.highShimmer', 'quality.issue.lowHNR',
  'quality.warning.borderlineJitter', 'quality.warning.borderlineShimmer', 'quality.warning.borderlineHNR',
  'theme.general', 'theme.questions', 'theme.douceur', 'theme.quotidien',
  'theme.respiration', 'theme.nature', 'theme.emotions', 'theme.histoires', 'theme.virelangues',
  'a11y.skipToContent', 'a11y.switchLanguage', 'a11y.nav', 'a11y.modes',
  'record.exportFilename',
]

describe('strings catalog', () => {
  it('getLang() returns "en" by default', () => {
    expect(getLang()).toBe('en')
  })

  it('setLang() updates current language', () => {
    setLang('fr')
    expect(getLang()).toBe('fr')
    setLang('en')
    expect(getLang()).toBe('en')
  })

  it('t() returns English values when lang is en', () => {
    setLang('en')
    expect(t('app.title')).toBe('Voice Lab')
    expect(t('nav.pitch')).toBe('Pitch')
  })

  it('t() returns French values when lang is fr', () => {
    setLang('fr')
    expect(t('app.title')).toBe('Voice Lab')
    expect(t('nav.pitch')).toBe('Fréquence')
    expect(t('header.home')).toBe('← Accueil')
    expect(t('phrases.random')).toBe('Aléatoire')
    expect(t('theme.general')).toBe('Général')
  })

  it('every key resolves via t() to a non-empty string in EN', () => {
    setLang('en')
    for (const key of allKeys) {
      const value = t(key)
      expect(value, `t('${key}') EN should be non-empty`).toBeTruthy()
      expect(typeof value).toBe('string')
    }
  })

  it('every key resolves via t() to a non-empty string in FR', () => {
    setLang('fr')
    for (const key of allKeys) {
      const value = t(key)
      expect(value, `t('${key}') FR should be non-empty`).toBeTruthy()
      expect(typeof value).toBe('string')
    }
  })
})
