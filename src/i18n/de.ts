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
  'time-ago': 'vor {time}',
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
  'system-including': 'Inklusive Bitcoin Core, LND, und Electrum server',
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
    'step-4-part-1': 'Richte die Erweiterung "',
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
      sidebar: 'App Store',
    },
  },
};

export default messages;
