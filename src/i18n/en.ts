const messages = {
  'security-error-iframe':
    'For security reasons, Citadel cannot be embedded in an iframe.',
  'refresh-warning-update':
    'Please do not refresh this page or turn off your Citadel while the update is in progress',
  'refresh-warning-shutdown':
    'Please do not refresh this page or turn off your Citadel while it is shutting down',
  'refresh-warning-reboot':
    'Please do not refresh this page or turn off your Citadel while it is rebooting',
  overview: "Here's an overview of your Citadel",
  greetings: {
    morning: 'good morning, {username}',
    afternoon: 'good afternoon, {username}',
    evening: 'good evening, {username}',
    fallback: 'welcome back, {username}',
  },
  synchronizing: 'Synchronizing',
  synchronized: 'Synchronized',
  running: 'Running',
  manage: 'Manage',
  'connected-peers': 'Connected peers',
  'time-ago': '{time} ago',
  'bitcoin-wallet': 'Bitcoin Wallet',
  'lightning-wallet': 'Lightning Wallet',
  'just-now': 'just now',
  transaction: 'transaction',
  transactions: 'transactions',
  block: 'Block',
  'no-transactions': 'No transactions',
  receive: 'Receive',
  send: 'Send',
  'used-out-of': 'used out of {storage}',
  storage: 'Storage',
  available: '{storage} available',
  system: 'System',
  'system-including': 'Including Bitcoin Core and LND',
  calculating: 'Calculating...',
  'view-usage': 'View usage',
  'hide-usage': 'Hide usage',
  'storage-full-suggestion':
    'Consider uninstalling some apps or upgrading to a larger drive.',
  'ram-full-suggestion':
    "Consider uninstalling some apps or upgrading your Citadel's hardware.",
  'cpu-temp-warning':
    'Your Raspberry Pi is running hot. Consider using a heatsink, fan or a cooling case.',
  'cpu-temp-urgent-warning':
    'Your Raspberry Pi is dangerously hot. Consider using a heatsink, fan or a cooling case.',
  login: {
    'welcome-back': 'welcome back',
    'enter-your-password': 'Enter the password to login to your Citadel',
    'enter-2fa-code': 'Enter your two-factor authentication code',
    'incorrect-password': 'Incorrect password',
    'incorrect-code': 'Incorrect code',
    button: 'Log in',
  },
  'lightning-address': {
    name: 'Lightning address',
    heading: 'lightning address',
    subheading: 'Get a Lightning address to receive tips to your Citadel',
    'step-1-part-1': 'Install the app "',
    // LnMe link
    'step-1-part-2': '" on your Citadel.',
    'step-2': 'Anyone can now send tips to this address:',
    'optional-steps':
      'The following steps are optional, but if you want a shorter Lightning address, a tipping page and a LNURL, you can also set that up.',
    'step-3': 'You need at least one open Lightning channel.',
    'step-4-part-1': 'Set up the "',
    // Alby link
    'step-4-part-2':
      '"  extension in your browser and connect it to your node. This will be needed to log into our lightning address site later. You can also use a Discord, Twitter or GitHub account instead.',
    'step-5-part-1': 'Visit',
    // sats4.me link
    'step-5-part-2': 'and sign up there. As LnMe onion URL, please enter this:',
    'placeholder-lnme': 'None yet, please install LnMe first.',
  },
  apps: {
    overview: {
      sidebar: 'Apps',
      heading: 'apps',
      'none-installed': "You don't have any apps installed yet",
      'go-to-app-store': 'Go to app store',
      update: 'Update',
      edit: 'Edit',
      done: 'Done',
      'update-running': 'Update running...',
    },
    store: {
      sidebar: 'App Store',
      heading: 'app store',
      subheading:
        'Add super powers to your Citadel with amazing self-hosted applications',
      'search-placeholder': 'Search for apps',
      back: 'Back',
      starting: 'Starting...',
      installing: 'Installing...',
      uninstalling: 'Uninstalling...',
      open: 'Open',
      'default-password': 'The default password for this app is',
    },
  },
  bitcoin: {
    'sync-info':
      'This percentage depends on the number of transactions inside each block and is only an estimation. Empty blocks will be verified faster and have less weight in the overall synchronization percentage',
  },
  setup: {
    'step-1': {
      heading: 'welcome to citadel',
      text: 'Your journey to digital freedom starts now.',
    },
    'step-2': {
      heading: 'what is your name?',
      text: 'Your name stays on your Citadel and is never shared with us or a 3rd party.',
    },
    'step-3': {
      heading: 'set your password',
      text: "You'll need this password to login to your Citadel.",
    },
    'step-4': {
      heading: 'confirm your password',
      text: "You'll need this password to login to your Citadel.",
    },
    'step-5': {
      heading: 'note down your secret words',
      text: "On the next screen you will be shown 24 words. It's recommended that you write them down on a piece of paper and store it in a safe place.",
    },
    'step-6': {
      heading: 'note down your secret words',
      text: 'Remember, there is no "forgot password" button. You will need these 24 words to recover your Citadel.',
    },
    'step-7': {
      heading: 'access from anywhere',
      text: "Even when you're not on your home network, you can access your Citadel using Tor Browser on the following URL",
    },
    'step-8': {
      heading: 'one last thing',
      text: "Don't be too #reckless.",
    },
    'step-9': {
      heading: "🎉 that's it!",
      text: 'Congratulations! Your Citadel is now set up and synchronizing the Bitcoin blockchain.',
    },
  },
};

export default messages;
