export type Lang = 'en' | 'fr'

const en = {
  // App-level
  'app.title': 'Voice Lab',
  'app.tagline': 'Real-time voice training for trans & non-binary voices',
  'app.unsupported': 'Your browser does not support the required audio APIs.',
  'app.unsupportedHint': 'Use a recent Chrome, Edge, or Firefox on HTTPS.',

  // Navigation
  'nav.pitch': 'Pitch',
  'nav.tones': 'Tones',
  'nav.phrases': 'Phrases',
  'nav.record': 'Record',
  'nav.labo': 'Lab',

  // Mic gate
  'gate.title': 'Microphone access required',
  'gate.description':
    'Voice Lab analyses your voice in real time. Nothing is recorded or stored.',
  'gate.button': '🎙 Allow microphone',
  'gate.requesting': 'Requesting permission…',

  // Landing page
  'landing.hero.tagline': 'Train your voice in real time, right in your browser.',
  'landing.hero.audience':
    'Built for trans and non-binary voice work, as a complement to speech-therapy sessions.',
  'landing.cta': 'Get started',
  'landing.privacy.title': 'Your voice never leaves your device',
  'landing.privacy.local': '100% local — nothing is sent anywhere',
  'landing.privacy.noRecord': 'Nothing is recorded or kept',
  'landing.privacy.noTrack': 'No account, no tracking, no ads',
  'landing.privacy.free': 'Free and open-source',
  'landing.features.title': 'Features',
  'landing.features.pitch': 'Visualise your voice pitch live.',
  'landing.features.tones': 'Reference notes and scales for your range.',
  'landing.features.phrases': 'Practice sentences to read aloud.',
  'landing.features.record': 'Record and replay locally — nothing is sent.',
  'landing.features.labo': 'Spectrogram, harmonics and voice quality analysis.',

  // Header
  'header.home': '← Home',

  // Footer
  'footer.privacy': '100% local — no data leaves your device.',
  'footer.disclaimer': 'A practice tool; it does not replace speech therapy.',
  'footer.openSource': 'Open-source on GitHub',

  // Pitch view
  'pitch.title': 'Pitch',
  'pitch.idle': 'Speak to see your pitch',
  'pitch.target': 'Reference:',
  'pitch.targetNone': 'None',
  'pitch.band.low': 'Low (60–150 Hz)',
  'pitch.band.mid': 'Mid (150–250 Hz)',
  'pitch.band.high': 'High (250–500 Hz)',
  'pitch.volume': 'Volume',
  'pitch.targetLabel': 'Frequency reference',

  // Record view
  'record.privacy': 'Nothing leaves your device. The recording is held in RAM only.',
  'record.listen': 'Listen back',
  'record.listenStop': 'Stop',
  'record.clear': 'Clear',
  'record.status.ready': 'Ready',
  'record.title': 'Recording',
  'record.status.initializing': 'Waiting for microphone…',
  'record.audioUnavailable': 'Audio context unavailable',
  'record.status.progress': 'Recording',
  'record.status.cleared': 'Recording cleared',
  'record.start': '⏺ Record',
  'record.stop': '⏹ Stop',
  'record.recorded': 'recorded',

  // Labo view
  'labo.title': 'Acoustic analysis lab',
  'labo.tab.spectrum': 'Spectrum',
  'labo.tab.spectrogram': 'Spectrogram',
  'labo.tab.harmonics': 'Harmonics',
  'labo.tab.stats': 'Statistics',
  'labo.tab.quality': 'Voice quality',
  'labo.navLabel': 'Lab analysis views',

  // Stats
  'stats.reset': 'Reset',
  'stats.noData': 'Speak to start collecting statistics.',
  'stats.title': 'Session statistics',
  'stats.description': 'Speak to build up statistics across the session.',
  'stats.min': 'Minimum',
  'stats.max': 'Maximum',
  'stats.mean': 'Average',
  'stats.range': 'Range',
  'stats.dominant': 'Dominant range',
  'stats.frames': 'Frames analysed',

  // Voice quality
  'quality.title': 'Voice Quality',
  'quality.jitter': 'Jitter',
  'quality.shimmer': 'Shimmer',
  'quality.hnr': 'HNR',
  'quality.sustainedVowel': 'Hold a sustained vowel for a reliable reading.',
  'quality.waiting': 'Waiting for voice signal…',
  'quality.normal': 'Voice quality within normal range.',
  'quality.issues': 'Disturbances detected',
  'quality.warnings': 'Borderline values',
  'quality.monitor': 'Monitor.',
  'quality.level.normal': '✓ Normal',
  'quality.level.borderline': '⚠ Borderline',
  'quality.level.high': '✗ High',
  'quality.level.low': '✗ Low',

  // PWA update toast
  'pwa.updateAvailable': 'A new version is available.',
  'pwa.reload': 'Reload',

  // Error messages
  'error.micPermissionDenied': 'Microphone access denied. Click the mic icon in the address bar to allow.',
  'error.micNoDevice': 'No microphone detected. Plug one in and try again.',
  'error.micInsecureContext': 'This page must be loaded over HTTPS (or localhost) to access the microphone.',
  'error.micUnsupportedBrowser': 'Your browser does not support microphone access. Use a recent Chrome, Firefox or Edge.',
  'error.micUnknown': 'Unexpected error accessing the microphone. Please try again.',

  // Phrases view
  'phrases.title': 'Reading phrases',
  'phrases.subtitle': 'Read these phrases aloud and observe your intonation curve.',
  'phrases.theme': 'Theme',
  'phrases.prev': '← Previous',
  'phrases.next': 'Next →',
  'phrases.random': 'Random',

  // Tones view
  'tones.title': 'Reference tones',
  'tones.description': 'Choose a note and imitate it. The pitch graph will show you if you are in tune.',
  'tones.selectPlaceholder': 'Choose a note',
  'tones.play': '▶ Play',
  'tones.stop': '⏹ Stop',

  // Labo sub-views
  'spectrum.description': 'Real-time frequency spectrum — 0 to 8,000 Hz',
  'spectrogram.description': 'Time × frequency map — colour = intensity (black → blue → pink → white)',
  'harmonics.description': 'Harmonic structure — pink = fundamental (H1), blue = harmonics',
  'harmonics.holdVowel': 'Hold a vowel to see the harmonics.',
  'harmonics.fundamental': 'Fundamental',
  'harmonics.detected': 'harmonics detected',

  // Phrases counter prefix
  'phrases.counter': 'Phrase',

  // Voice quality interpretation fragments
  'quality.issue.highJitter': 'high jitter',
  'quality.issue.highShimmer': 'high shimmer',
  'quality.issue.lowHNR': 'low HNR',
  'quality.warning.borderlineJitter': 'borderline jitter',
  'quality.warning.borderlineShimmer': 'borderline shimmer',
  'quality.warning.borderlineHNR': 'borderline HNR',

  // Record export
  'record.export': '⬇ WAV',
  'record.workletError': 'Recording unavailable: audio worklet failed to load.',

  // Theme labels
  'theme.general': 'General',
  'theme.questions': 'Questions',
  'theme.douceur': 'Gentle voice',
  'theme.quotidien': 'Daily life',
  'theme.respiration': 'Breath control',
  'theme.nature': 'Nature',
  'theme.emotions': 'Emotions',
  'theme.histoires': 'Short stories',
  'theme.virelangues': 'Tongue twisters',

  // Accessibility
  'a11y.skipToContent': 'Skip to content',
  'a11y.switchLanguage': 'Switch to French',
  'a11y.nav': 'Navigation',
  'a11y.modes': 'Modes',

  // Record export filename
  'record.exportFilename': 'voice-recording.wav',

  // Intonation (PhrasesView)
  'intonation.rangeLabel': 'Intonation range',
  'intonation.semitones': 'st',
  'intonation.flat': 'fairly flat',
  'intonation.melodic': 'melodic',
  'intonation.varied': 'very varied',
  'intonation.context': 'No ideal value — context and emotion shape intonation.',
  'intonation.waiting': 'Speak to measure intonation',

  // Volume (PitchView)
  'volume.level.verysoft': 'Very soft',
  'volume.level.soft': 'Soft',
  'volume.level.moderate': 'Moderate',
  'volume.level.loud': 'Loud',
  'volume.level.veryloud': 'Very loud',
} as const

const fr: Record<keyof typeof en, string> = {
  // App-level
  'app.title': 'Voice Lab',
  'app.tagline': 'Entraînement vocal en temps réel pour voix trans & non-binaires',
  'app.unsupported': 'Votre navigateur ne supporte pas les API audio requises.',
  'app.unsupportedHint': 'Utilisez une version récente de Chrome, Edge ou Firefox en HTTPS.',

  // Navigation
  'nav.pitch': 'Fréquence',
  'nav.tones': 'Tonalités',
  'nav.phrases': 'Phrases',
  'nav.record': 'Enregistrer',
  'nav.labo': 'Labo',

  // Mic gate
  'gate.title': 'Accès au microphone requis',
  'gate.description': "Voice Lab analyse votre voix en temps réel. Rien n'est enregistré ni stocké.",
  'gate.button': '🎙 Autoriser le microphone',
  'gate.requesting': 'Demande en cours…',

  // Landing page
  'landing.hero.tagline': 'Entraînez votre voix en temps réel, directement dans votre navigateur.',
  'landing.hero.audience': "Conçu pour le travail vocal trans et non-binaire, en complément des séances d'orthophonie.",
  'landing.cta': 'Commencer',
  'landing.privacy.title': 'Votre voix ne quitte jamais votre appareil',
  'landing.privacy.local': "100% local — rien n'est envoyé nulle part",
  'landing.privacy.noRecord': "Rien n'est enregistré ni conservé",
  'landing.privacy.noTrack': 'Pas de compte, pas de tracking, pas de publicités',
  'landing.privacy.free': 'Gratuit et open-source',
  'landing.features.title': 'Fonctionnalités',
  'landing.features.pitch': 'Visualisez votre fréquence vocale en direct.',
  'landing.features.tones': 'Notes de référence et gammes pour votre registre.',
  'landing.features.phrases': "Phrases d'exercice à lire à voix haute.",
  'landing.features.record': "Enregistrez et écoutez localement — rien n'est envoyé.",
  'landing.features.labo': "Spectrogramme, harmoniques et analyse qualité vocale.",

  // Header
  'header.home': '← Accueil',

  // Footer
  'footer.privacy': "100% local — aucune donnée ne quitte votre appareil.",
  'footer.disclaimer': "Un outil d'exercice ; il ne remplace pas un suivi orthophonique.",
  'footer.openSource': 'Open-source sur GitHub',

  // Pitch view
  'pitch.title': 'Fréquence',
  'pitch.idle': 'Parlez pour voir votre fréquence',
  'pitch.target': 'Repère :',
  'pitch.targetNone': 'Aucun',
  'pitch.band.low': 'Graves (60–150 Hz)',
  'pitch.band.mid': 'Médiums (150–250 Hz)',
  'pitch.band.high': 'Aigus (250–500 Hz)',
  'pitch.volume': 'Volume',
  'pitch.targetLabel': 'Repère de fréquence',

  // Record view
  'record.privacy': "Rien ne quitte votre appareil. L'enregistrement est conservé uniquement en RAM.",
  'record.listen': 'Écouter',
  'record.listenStop': 'Arrêter',
  'record.clear': 'Effacer',
  'record.status.ready': 'Prêt',
  'record.title': 'Enregistrement',
  'record.status.initializing': 'Attente du microphone…',
  'record.audioUnavailable': 'Contexte audio indisponible',
  'record.status.progress': 'Enregistrement en cours',
  'record.status.cleared': 'Enregistrement effacé',
  'record.start': '⏺ Enregistrer',
  'record.stop': '⏹ Arrêter',
  'record.recorded': 'enregistrées',

  // Labo view
  "labo.title": "Laboratoire d'analyse acoustique",
  'labo.tab.spectrum': 'Spectre',
  'labo.tab.spectrogram': 'Spectrogramme',
  'labo.tab.harmonics': 'Harmoniques',
  'labo.tab.stats': 'Statistiques',
  'labo.tab.quality': 'Qualité vocale',
  'labo.navLabel': "Vues d'analyse du labo",

  // Stats
  'stats.reset': 'Réinitialiser',
  'stats.noData': 'Parlez pour commencer à collecter des statistiques.',
  'stats.title': 'Statistiques de session',
  'stats.description': 'Parlez pour accumuler des statistiques au fil de la session.',
  'stats.min': 'Minimum',
  'stats.max': 'Maximum',
  'stats.mean': 'Moyenne',
  'stats.range': 'Étendue',
  'stats.dominant': 'Registre dominant',
  'stats.frames': 'Trames analysées',

  // Voice quality
  'quality.title': 'Qualité vocale',
  'quality.jitter': 'Jitter',
  'quality.shimmer': 'Shimmer',
  'quality.hnr': 'HNR',
  'quality.sustainedVowel': 'Maintenez une voyelle tenue pour une mesure fiable.',
  'quality.waiting': 'En attente du signal vocal…',
  'quality.normal': 'Qualité vocale dans la plage normale.',
  'quality.issues': 'Perturbations détectées',
  'quality.warnings': 'Valeurs limites',
  'quality.monitor': 'Surveiller.',
  'quality.level.normal': '✓ Normal',
  'quality.level.borderline': '⚠ Limite',
  'quality.level.high': '✗ Élevé',
  'quality.level.low': '✗ Faible',

  // PWA update toast
  'pwa.updateAvailable': 'Une nouvelle version est disponible.',
  'pwa.reload': 'Recharger',

  // Error messages
  'error.micPermissionDenied': "Accès au microphone refusé. Cliquez sur l'icône micro dans la barre d'adresse pour l'autoriser.",
  'error.micNoDevice': 'Aucun microphone détecté. Branchez-en un et réessayez.',
  'error.micInsecureContext': 'Cette page doit être chargée en HTTPS (ou localhost) pour accéder au microphone.',
  'error.micUnsupportedBrowser': "Votre navigateur ne supporte pas l'accès au microphone. Utilisez une version récente de Chrome, Firefox ou Edge.",
  'error.micUnknown': "Erreur inattendue lors de l'accès au microphone. Veuillez réessayer.",

  // Phrases view
  'phrases.title': 'Phrases à lire',
  'phrases.subtitle': 'Lisez ces phrases à voix haute et observez la courbe de votre intonation.',
  'phrases.theme': 'Thème',
  'phrases.prev': '← Précédente',
  'phrases.next': 'Suivante →',
  'phrases.random': 'Aléatoire',

  // Tones view
  'tones.title': 'Tons de référence',
  'tones.description': 'Choisissez une note et imitez-la. Le graphe de hauteur vous montrera si vous êtes dans le ton.',
  'tones.selectPlaceholder': 'Choisir une note',
  'tones.play': '▶ Jouer',
  'tones.stop': '⏹ Arrêter',

  // Labo sub-views
  'spectrum.description': 'Spectre de fréquences en temps réel — 0 à 8 000 Hz',
  'spectrogram.description': 'Carte temps × fréquence — couleur = intensité (noir → bleu → rose → blanc)',
  'harmonics.description': 'Structure harmonique — rose = fondamentale (H1), bleu = harmoniques',
  'harmonics.holdVowel': 'Tenez une voyelle pour voir les harmoniques.',
  'harmonics.fundamental': 'Fondamentale',
  'harmonics.detected': 'harmoniques détectées',

  // Phrases counter prefix
  'phrases.counter': 'Phrase',

  // Voice quality interpretation fragments
  'quality.issue.highJitter': 'jitter élevé',
  'quality.issue.highShimmer': 'shimmer élevé',
  'quality.issue.lowHNR': 'HNR faible',
  'quality.warning.borderlineJitter': 'jitter limite',
  'quality.warning.borderlineShimmer': 'shimmer limite',
  'quality.warning.borderlineHNR': 'HNR limite',

  // Record export
  'record.export': '⬇ WAV',
  'record.workletError': 'Enregistrement indisponible : le worklet audio n\'a pas pu être chargé.',

  // Theme labels
  'theme.general': 'Général',
  'theme.questions': 'Questions',
  'theme.douceur': 'Voix douce',
  'theme.quotidien': 'Quotidien',
  'theme.respiration': 'Souffle',
  'theme.nature': 'Nature',
  'theme.emotions': 'Émotions',
  'theme.histoires': 'Histoires courtes',
  'theme.virelangues': 'Virelangues',

  // Accessibility
  'a11y.skipToContent': 'Aller au contenu',
  'a11y.switchLanguage': 'Passer en anglais',
  'a11y.nav': 'Navigation',
  'a11y.modes': 'Modes',

  // Record export filename
  'record.exportFilename': 'voix-enregistrement.wav',

  // Intonation (PhrasesView)
  'intonation.rangeLabel': "Étendue d'intonation",
  'intonation.semitones': 'st',
  'intonation.flat': 'plutôt plate',
  'intonation.melodic': 'mélodieuse',
  'intonation.varied': 'très variée',
  'intonation.context': "Pas de valeur idéale — le contexte et l'émotion font tout.",
  'intonation.waiting': "Parlez pour mesurer l'intonation",

  // Volume (PitchView)
  'volume.level.verysoft': 'Très douce',
  'volume.level.soft': 'Douce',
  'volume.level.moderate': 'Modérée',
  'volume.level.loud': 'Forte',
  'volume.level.veryloud': 'Très forte',
}

export type StringKey = keyof typeof en

const catalogs: Record<Lang, Record<StringKey, string>> = { en, fr }

function detectLang(): Lang {
  try {
    return navigator.language.startsWith('fr') ? 'fr' : 'en'
  } catch {
    return 'en'
  }
}

const stored = (typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null) as Lang | null
let current: Lang = stored ?? detectLang()

export function getLang(): Lang {
  return current
}

export function setLang(l: Lang): void {
  current = l
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lang', l)
  }
}

export function t(key: StringKey): string {
  return catalogs[current][key]
}
