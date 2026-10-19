export type Lang = 'en' | 'fr' | 'ko'

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
  'gate.description': 'Voice Lab analyses your voice in real time. Nothing is recorded or stored.',
  'gate.button': '🎙 Allow microphone',
  'gate.requesting': 'Requesting permission…',

  // Landing page
  'landing.hero.tagline': 'Train your voice in real time, right in your browser.',
  'landing.hero.audience':
    'Built for trans and non-binary voice work, as a complement to speech-therapy sessions.',
  'landing.cta': 'Get started',
  'landing.privacy.title': 'Your voice never leaves your device',
  'landing.privacy.local': '100% local: nothing is sent anywhere',
  'landing.privacy.noRecord': 'Nothing is recorded or kept',
  'landing.privacy.noTrack': 'No account, no tracking, no ads',
  'landing.privacy.free': 'Free and open-source',
  'landing.features.title': 'Features',
  'landing.features.pitch': 'Visualise your voice pitch live.',
  'landing.features.tones': 'Reference notes and scales for your range.',
  'landing.features.phrases': 'Practice sentences to read aloud.',
  'landing.features.record': 'Record and replay locally; nothing is sent.',
  'landing.features.labo': 'Spectrogram, harmonics and voice quality analysis.',

  // Header
  'header.home': '← Home',

  // Footer
  'footer.privacy': '100% local: no data leaves your device.',
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
  'error.micPermissionDenied':
    'Microphone access denied. Click the mic icon in the address bar to allow.',
  'error.micNoDevice': 'No microphone detected. Plug one in and try again.',
  'error.micInsecureContext':
    'This page must be loaded over HTTPS (or localhost) to access the microphone.',
  'error.micUnsupportedBrowser':
    'Your browser does not support microphone access. Use a recent Chrome, Firefox or Edge.',
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
  'tones.description':
    'Choose a note and imitate it. The pitch graph will show you if you are in tune.',
  'tones.selectPlaceholder': 'Choose a note',
  'tones.play': '▶ Play',
  'tones.stop': '⏹ Stop',

  // Labo sub-views
  'spectrum.description': 'Real-time frequency spectrum, 0 to 8,000 Hz',
  'spectrogram.description':
    'Time × frequency map: colour = intensity (black → blue → pink → white)',
  'harmonics.description': 'Harmonic structure: pink = fundamental (H1), blue = harmonics',
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
  'a11y.switchLanguage': 'Switch language',
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
  'intonation.context': 'No ideal value; context and emotion shape intonation.',
  'intonation.waiting': 'Speak to measure intonation',

  // Volume (PitchView)
  'volume.level.verysoft': 'Very soft',
  'volume.level.soft': 'Soft',
  'volume.level.moderate': 'Moderate',
  'volume.level.loud': 'Loud',
  'volume.level.veryloud': 'Very loud',

  // Resonance / Formants (LaboView)
  'labo.tab.resonance': 'Resonance',
  'resonance.description': 'Experimental, most reliable on sustained vowels.',
  'resonance.holdVowel': 'Hold a vowel (A, E, I, O, U) for a stable reading.',
  'resonance.aperture': 'Mouth opening',
  'resonance.brightness': 'Resonance',
  'resonance.open': 'open',
  'resonance.mid': 'half-open',
  'resonance.closed': 'closed',
  'resonance.bright': 'bright',
  'resonance.neutral': 'neutral',
  'resonance.dark': 'dark',
  'resonance.waiting': 'Hold a vowel…',
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
  'gate.description':
    "Voice Lab analyse votre voix en temps réel. Rien n'est enregistré ni stocké.",
  'gate.button': '🎙 Autoriser le microphone',
  'gate.requesting': 'Demande en cours…',

  // Landing page
  'landing.hero.tagline': 'Entraînez votre voix en temps réel, directement dans votre navigateur.',
  'landing.hero.audience':
    "Conçu pour le travail vocal trans et non-binaire, en complément des séances d'orthophonie.",
  'landing.cta': 'Commencer',
  'landing.privacy.title': 'Votre voix ne quitte jamais votre appareil',
  'landing.privacy.local': "100% local : rien n'est envoyé nulle part",
  'landing.privacy.noRecord': "Rien n'est enregistré ni conservé",
  'landing.privacy.noTrack': 'Pas de compte, pas de tracking, pas de publicités',
  'landing.privacy.free': 'Gratuit et open-source',
  'landing.features.title': 'Fonctionnalités',
  'landing.features.pitch': 'Visualisez votre fréquence vocale en direct.',
  'landing.features.tones': 'Notes de référence et gammes pour votre registre.',
  'landing.features.phrases': "Phrases d'exercice à lire à voix haute.",
  'landing.features.record': "Enregistrez et écoutez localement ; rien n'est envoyé.",
  'landing.features.labo': 'Spectrogramme, harmoniques et analyse qualité vocale.',

  // Header
  'header.home': '← Accueil',

  // Footer
  'footer.privacy': '100% local : aucune donnée ne quitte votre appareil.',
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
  'record.privacy':
    "Rien ne quitte votre appareil. L'enregistrement est conservé uniquement en RAM.",
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
  'labo.title': "Laboratoire d'analyse acoustique",
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
  'error.micPermissionDenied':
    "Accès au microphone refusé. Cliquez sur l'icône micro dans la barre d'adresse pour l'autoriser.",
  'error.micNoDevice': 'Aucun microphone détecté. Branchez-en un et réessayez.',
  'error.micInsecureContext':
    'Cette page doit être chargée en HTTPS (ou localhost) pour accéder au microphone.',
  'error.micUnsupportedBrowser':
    "Votre navigateur ne supporte pas l'accès au microphone. Utilisez une version récente de Chrome, Firefox ou Edge.",
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
  'tones.description':
    'Choisissez une note et imitez-la. Le graphe de hauteur vous montrera si vous êtes dans le ton.',
  'tones.selectPlaceholder': 'Choisir une note',
  'tones.play': '▶ Jouer',
  'tones.stop': '⏹ Arrêter',

  // Labo sub-views
  'spectrum.description': 'Spectre de fréquences en temps réel, 0 à 8 000 Hz',
  'spectrogram.description':
    'Carte temps × fréquence : couleur = intensité (noir → bleu → rose → blanc)',
  'harmonics.description': 'Structure harmonique : rose = fondamentale (H1), bleu = harmoniques',
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
  'record.workletError': "Enregistrement indisponible : le worklet audio n'a pas pu être chargé.",

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
  'a11y.switchLanguage': 'Changer de langue',
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
  'intonation.context': "Pas de valeur idéale ; le contexte et l'émotion font tout.",
  'intonation.waiting': "Parlez pour mesurer l'intonation",

  // Volume (PitchView)
  'volume.level.verysoft': 'Très douce',
  'volume.level.soft': 'Douce',
  'volume.level.moderate': 'Modérée',
  'volume.level.loud': 'Forte',
  'volume.level.veryloud': 'Très forte',

  // Resonance / Formants (LaboView)
  'labo.tab.resonance': 'Résonance',
  'resonance.description': 'Prototype exploratoire, plus fiable sur les voyelles tenues.',
  'resonance.holdVowel': 'Maintenez une voyelle (A, E, I, O, U) pour une lecture stable.',
  'resonance.aperture': 'Ouverture de bouche',
  'resonance.brightness': 'Résonance',
  'resonance.open': 'ouverte',
  'resonance.mid': 'mi-ouverte',
  'resonance.closed': 'fermée',
  'resonance.bright': 'clair',
  'resonance.neutral': 'neutre',
  'resonance.dark': 'sombre',
  'resonance.waiting': 'Maintenez une voyelle…',
}

const ko: Record<keyof typeof en, string> = {
  // App-level
  'app.title': 'Voice Lab',
  'app.tagline': '트랜스·논바이너리 목소리를 위한 실시간 음성 훈련',
  'app.unsupported': '사용 중인 브라우저가 필요한 오디오 API를 지원하지 않아요.',
  'app.unsupportedHint': '최신 판의 Chrome, Edge 또는 Firefox를 HTTPS로 사용해 주세요.',

  // Navigation
  'nav.pitch': '피치',
  'nav.tones': '기준음',
  'nav.phrases': '문장',
  'nav.record': '녹음',
  'nav.labo': '랩',

  // Mic gate
  'gate.title': '마이크 접근 권한이 필요해요',
  'gate.description': 'Voice Lab이 목소리를 실시간으로 분석해요. 녹음하거나 저장하지 않아요.',
  'gate.button': '🎙 마이크 허용',
  'gate.requesting': '권한을 요청하는 중이에요…',

  // Landing page
  'landing.hero.tagline': '브라우저에서 바로 목소리를 실시간으로 훈련해 보세요.',
  'landing.hero.audience':
    '트랜스·논바이너리 음성 워크를 위해 만들어졌으며, 음성 치료 세션을 보완하는 도구예요.',
  'landing.cta': '시작하기',
  'landing.privacy.title': '목소리는 기기를 절대 떠나지 않아요',
  'landing.privacy.local': '100% 로컬: 아무것도 전송되지 않아요',
  'landing.privacy.noRecord': '아무것도 녹음하거나 보관하지 않아요',
  'landing.privacy.noTrack': '계정도, 추적도, 광고도 없어요',
  'landing.privacy.free': '자유 오픈 소스',
  'landing.features.title': '기능',
  'landing.features.pitch': '목소리 피치를 실시간으로 확인해 보세요.',
  'landing.features.tones': '내 음역대에 맞춘 기준음과 음계.',
  'landing.features.phrases': '소리 내어 읽는 연습 문장.',
  'landing.features.record': '로컬에서 녹음하고 다시 들을 수 있어요. 아무것도 전송되지 않아요.',
  'landing.features.labo': '스펙트로그램, 배음, 음질 분석.',

  // Header
  'header.home': '← 홈',

  // Footer
  'footer.privacy': '100% 로컬: 데이터는 기기를 떠나지 않아요.',
  'footer.disclaimer': '연습 도구예요. 음성 치료를 대체하지 않아요.',
  'footer.openSource': 'GitHub에서 오픈 소스로 공개돼요',

  // Pitch view
  'pitch.title': '피치',
  'pitch.idle': '말하면 피치가 표시돼요',
  'pitch.target': '기준:',
  'pitch.targetNone': '없음',
  'pitch.band.low': '저음 (60–150\u00a0Hz)',
  'pitch.band.mid': '중음 (150–250\u00a0Hz)',
  'pitch.band.high': '고음 (250–500\u00a0Hz)',
  'pitch.volume': '음량',
  'pitch.targetLabel': '주파수 기준',

  // Record view
  'record.privacy': '녹음은 기기를 절대 떠나지 않아요. RAM에만 보관돼요.',
  'record.listen': '다시 듣기',
  'record.listenStop': '정지',
  'record.clear': '지우기',
  'record.status.ready': '준비됨',
  'record.title': '녹음',
  'record.status.initializing': '마이크를 기다리는 중…',
  'record.audioUnavailable': '오디오 컨텍스트를 사용할 수 없어요',
  'record.status.progress': '녹음 중',
  'record.status.cleared': '녹음이 지워졌어요',
  'record.start': '⏺ 녹음',
  'record.stop': '⏹ 정지',
  'record.recorded': '녹음됨',

  // Labo view
  'labo.title': '음향 분석 랩',
  'labo.tab.spectrum': '스펙트럼',
  'labo.tab.spectrogram': '스펙트로그램',
  'labo.tab.harmonics': '배음',
  'labo.tab.stats': '통계',
  'labo.tab.quality': '음질',
  'labo.navLabel': '랩 분석 화면',

  // Stats
  'stats.reset': '초기화',
  'stats.noData': '말하면 통계 수집이 시작돼요.',
  'stats.title': '세션 통계',
  'stats.description': '세션 동안 말하면 통계가 쌓여요.',
  'stats.min': '최소',
  'stats.max': '최대',
  'stats.mean': '평균',
  'stats.range': '범위',
  'stats.dominant': '주요 음역대',
  'stats.frames': '분석된 프레임',

  // Voice quality
  'quality.title': '음질',
  'quality.jitter': '지터',
  'quality.shimmer': '시머',
  'quality.hnr': 'HNR',
  'quality.sustainedVowel': '안정적인 측정을 위해 모음을 길게 유지해 주세요.',
  'quality.waiting': '음성 신호를 기다리는 중…',
  'quality.normal': '음질이 정상 범위 안에 있어요.',
  'quality.issues': '교란이 감지됐어요',
  'quality.warnings': '경계선 수치',
  'quality.monitor': '계속 관찰해 주세요.',
  'quality.level.normal': '✓ 정상',
  'quality.level.borderline': '⚠ 경계선',
  'quality.level.high': '✗ 높음',
  'quality.level.low': '✗ 낮음',

  // PWA update toast
  'pwa.updateAvailable': '새 판이 있어요.',
  'pwa.reload': '새로 고침',

  // Error messages
  'error.micPermissionDenied':
    '마이크 접근이 거부됐어요. 주소창의 마이크 아이콘을 눌러 허용해 주세요.',
  'error.micNoDevice': '마이크가 감지되지 않아요. 연결한 뒤 다시 시도해 주세요.',
  'error.micInsecureContext': '마이크를 사용하려면 HTTPS(또는 localhost)로 페이지를 불러와야 해요.',
  'error.micUnsupportedBrowser':
    '사용 중인 브라우저가 마이크 접근을 지원하지 않아요. 최신 판의 Chrome, Firefox 또는 Edge를 사용해 주세요.',
  'error.micUnknown': '마이크 접근 중 예기치 못한 오류가 발생했어요. 다시 시도해 주세요.',

  // Phrases view
  'phrases.title': '읽기 문장',
  'phrases.subtitle': '이 문장들을 소리 내어 읽고 억양 곡선을 살펴보세요.',
  'phrases.theme': '테마',
  'phrases.prev': '← 이전',
  'phrases.next': '다음 →',
  'phrases.random': '무작위',

  // Tones view
  'tones.title': '기준음',
  'tones.description': '음을 하나 고르고 따라 해 보세요. 피치 그래프에 음이 맞는지 표시돼요.',
  'tones.selectPlaceholder': '음 선택',
  'tones.play': '▶ 재생',
  'tones.stop': '⏹ 정지',

  // Labo sub-views
  'spectrum.description': '실시간 주파수 스펙트럼, 0~8,000\u00a0Hz',
  'spectrogram.description': '시간 × 주파수 지도: 색 = 세기 (검정 → 파랑 → 분홍 → 흰색)',
  'harmonics.description': '배음 구조: 분홍 = 기본음(H1), 파랑 = 배음',
  'harmonics.holdVowel': '배음을 보려면 모음을 길게 유지해 주세요.',
  'harmonics.fundamental': '기본음',
  'harmonics.detected': '개의 배음이 감지됐어요',

  // Phrases counter prefix
  'phrases.counter': '문장',

  // Voice quality interpretation fragments
  'quality.issue.highJitter': '높은 지터',
  'quality.issue.highShimmer': '높은 시머',
  'quality.issue.lowHNR': '낮은 HNR',
  'quality.warning.borderlineJitter': '경계선 지터',
  'quality.warning.borderlineShimmer': '경계선 시머',
  'quality.warning.borderlineHNR': '경계선 HNR',

  // Record export
  'record.export': '⬇ WAV',
  'record.workletError': '녹음을 사용할 수 없어요: 오디오 워크릿을 불러오지 못했어요.',

  // Theme labels
  'theme.general': '일반',
  'theme.questions': '질문',
  'theme.douceur': '부드러운 목소리',
  'theme.quotidien': '일상',
  'theme.respiration': '호흡 조절',
  'theme.nature': '자연',
  'theme.emotions': '감정',
  'theme.histoires': '짧은 이야기',
  'theme.virelangues': '혀 꼬인 말',

  // Accessibility
  'a11y.skipToContent': '본문으로 건너뛰기',
  'a11y.switchLanguage': '언어 바꾸기',
  'a11y.nav': '탐색',
  'a11y.modes': '모드',

  // Record export filename
  'record.exportFilename': 'record.wav',

  // Intonation (PhrasesView)
  'intonation.rangeLabel': '억양 범위',
  'intonation.semitones': '반음',
  'intonation.flat': '억양 변화가 적어요',
  'intonation.melodic': '멜로디가 있어요',
  'intonation.varied': '변화가 아주 풍부해요',
  'intonation.context': '정해진 이상적인 수치는 없어요. 상황과 감정에 따라 억양이 달라져요.',
  'intonation.waiting': '말하면 억양을 측정해요',

  // Volume (PitchView)
  'volume.level.verysoft': '아주 작게',
  'volume.level.soft': '작게',
  'volume.level.moderate': '보통',
  'volume.level.loud': '크게',
  'volume.level.veryloud': '아주 크게',

  // Resonance / Formants (LaboView)
  'labo.tab.resonance': '공명',
  'resonance.description': '실험적 기능이에요. 모음을 길게 유지할 때 가장 정확해요.',
  'resonance.holdVowel': '안정적인 측정을 위해 모음(A, E, I, O, U)을 길게 유지해 주세요.',
  'resonance.aperture': '입 벌림',
  'resonance.brightness': '공명',
  'resonance.open': '열림',
  'resonance.mid': '반열림',
  'resonance.closed': '닫힘',
  'resonance.bright': '밝음',
  'resonance.neutral': '중립',
  'resonance.dark': '어두움',
  'resonance.waiting': '모음을 길게 유지해 주세요…',
}

export type StringKey = keyof typeof en

const catalogs: Record<Lang, Record<StringKey, string>> = { en, fr, ko }

function detectLang(): Lang {
  try {
    if (navigator.language.startsWith('fr')) return 'fr'
    if (navigator.language.startsWith('ko')) return 'ko'
    return 'en'
  } catch {
    return 'en'
  }
}

const stored = (
  typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null
) as Lang | null
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
