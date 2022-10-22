const messages = {
  'security-error-iframe':
    'For security reasons, Citadel cannot be embedded in an iframe.',
  'refresh-warning-update':
    'Bitte lade diese Seite nicht neu und schalte dein Node nicht aus, während das Update ausgeführt wird',
  'refresh-warning-shutdown':
    'Bitte lade diese Seite nicht neu und schalte dein Node nicht aus, während es herunterfährt',
  'refresh-warning-reboot':
    'Bitte lade diese Seite nicht neu und schalte dein Node nicht aus, während es neu starter',
  overview: 'Hier ist eine Übersicht deines Nodes',
  greetings: {
    morning: 'Guten Morgen, {username}',
    afternoon: 'Guten Nachmittag, {username}',
    evening: 'Guten Abend, {username}',
    fallback: 'Willkommen zurück, {username}',
  },
  synchronizing: 'Synchronisiert',
  synchronized: 'Synchronisiert',
  running: 'Aktiv',
  manage: 'Verwalten',
  'connected-peers': 'Verbunde Nodes',
  'bitcoin-wallet': 'Bitcoin-Wallet',
  'lightning-wallet': 'Lightning-Wallet',
  'just-now': 'gerade eben',
  transaction: 'Transaktion',
  transactions: 'Transaktionen',
  block: 'Block',
  'no-transactions': 'Keine Transaktionen',
  receive: 'Receive',
  send: 'Send',
  'used-out-of': 'von {storage} genutzt',
  storage: 'Speicher',
  available: '{storage} verfügbar',
  system: 'System',
  'system-including': 'Inklusive Bitcoin Core und LND',
  calculating: 'Wird berechnet...',
  'view-usage': 'Auslastung anzeigen',
  'hide-usage': 'Auslastung ausblenden',
  'storage-full-suggestion':
    'Denke darüber nach, Apps zu deinstallieren oder eine größere SSD zu nutzen.',
  'ram-full-suggestion':
    "'Denke darüber nach, Apps zu deinstallieren oder die Hardware upzugraden.",
  'cpu-temp-warning':
    'Dein Raspberry Pi ist relativ heiß. Denke darüber nach, ihn zu kühlen.',
  'cpu-temp-urgent-warning':
    'Dein Raspberry Pi ist gefährlich heiß. Denke darüber nach, ihn zu kühlen.',

  login: {
    'welcome-back': 'Willkommen zurück',
    'enter-your-password': 'Gib dein Passwort ein, um dich anzumelden',
    'enter-2fa-code': 'Gib dein Zwei-Faktor-Code ein',
    'incorrect-password': 'Falsches Passwort',
    'incorrect-code': 'Incorrect code',
    login: 'Anmelden',
  },
  'lightning-address': {
    name: 'Lightning-Adresse',
    heading: 'Lightning-Adresse',
    subheading: 'Empfange mit deiner Lightning-Addresse Spenden',
    'step-1-part-1': 'Installiere die App "',
    // LnMe link
    'step-1-part-2': '" auf deinem Citadel.',
    'step-2': 'Nun kann jeder dir an diese Adresse Sats senden:',
    'optional-steps':
      'Die folgenden Schritte sind optional, aber wenn du eine kürzere Lighhtning-Adresse, eine Spendenseite und LNUrl möchtest, können wir das auch einrichten.',
    'step-3': 'Du benötigst zuerst mindestens einen Lightning-Channel.',
    'step-4-part-1': '(Optional) Richte die Erweiterung "',
    // Alby link
    'step-4-part-2':
      '" in deinem Browser ein und verbinde sie mit deinem Citadel. Alby wird benötigt, um dich suf unserer Lightning-Adressen-Seite anzumelden. Du kannst stattdessen auch Discord, Twitter oder GitHub zum Login nutzen.',
    'step-5-part-1': 'Besuche',
    // sats4.me link
    'step-5-part-2':
      'und melde dich dort an. Als "LnMe onion URL", gib bitte das hier ein:',
    'placeholder-lnme': 'Noch nicht verfügbar, bitte installiere LnMe.',
  },
  apps: {
    overview: {
      sidebar: 'Apps',
      heading: 'Apps',
      'none-installed': 'Du hast noch keine Apps installiert',
      'go-to-app-store': 'Öffne den App-Store',
      update: 'Update',
      edit: 'Bearbeiten',
      done: 'Fertig',
      'update-running': 'Update läuft...',
    },
    store: {
      sidebar: 'App-Store',
      heading: 'App-Store',
      subheading:
        'Verleihe deinem Citadel mit großartigen selbst gehosteten Apps Superkräfte',
      'search-placeholder': 'Nach Apps suchen',
    },
  },
  bitcoin: {
    'sync-info':
      'Diese Prozentzahl hängt von der Anzahl der Transaktionen in jedem Block ab und ist nur eine Schätzung. Leere Blöcke werden schneller überprüft und tragen weniger zur Gesamtprozentzahl bei',
  },
  setup: {
    'step-1': {
      heading: 'Willkommen zu Citadel',
      text: 'Deine Reise in die digitalen Freiheit startet jetzt.',
    },
    'step-2': {
      heading: 'Was ist dein Name?',
      text: 'Dein Name bleibt auf deinem Node und wird niemals mit uns oder dritten geteilt.',
    },
    'step-3': {
      heading: 'Lege dein Passwort fest',
      text: 'Du brauchst dieses Passwort später, um dich anzumelden.',
    },
    'step-4': {
      heading: 'Bestätige dein Passwort',
      text: 'Du brauchst dieses Passwort später, um dich anzumelden.',
    },
    'step-5': {
      heading: 'Notiere dir deinen Seed',
      text: 'Auf der nächsten Seite werden dir 24 Wörter angezeigt. Schreibe sie dir am besten mit einem Stift auf ein Blatt Papier und lagere es sicher.',
    },
    'step-6': {
      heading: 'Notiere dir deinen Seed',
      text: 'Wenn irgendwas schiefläuft oder du dein Passwort vergisst, brauchst du diese Wörter, um wieder an dein Wallet zu kommen..',
    },
    'step-7': {
      heading: 'Von überall zugreifen',
      text: 'Auch wenn du nicht zuhause bist, kannst du mit dem Tor-Browser dein Citadel jederzeit unter folgender Adresse erreichen:',
    },
    'step-8': {
      heading: 'Eine letzte Sache',
      text: 'Sei nicht zu unvorsichtig',
    },
    'step-9': {
      heading: "🎉 Das war's!",
      text: 'Gratulation! Dein Citadel ist fertig eingerichtet und synct nun die Bitcoin-Blockchain.',
    },
  },
};

export default messages;
