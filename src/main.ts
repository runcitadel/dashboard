// @ts-expect-error configureCompat is actually exported by @vue/compat
import {createApp, configureCompat} from 'vue';
import BootstrapVue from 'bootstrap-vue/src/index.js';
import {createPinia} from 'pinia';
import {createI18n} from 'vue-i18n';
import Toast, {PluginOptions, POSITION} from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router/index';
import {satsToBtc} from './helpers/units';
import type useBitcoinStore from './store/bitcoin';
import type useSystemStore from './store/system';
import en from './i18n/en';
import de from './i18n/de';

const i18n = createI18n({
  // Todo: safe check if a variant with the full name exists, otherwise use the short name
  locale: navigator.language.split('-')[0],
  fallbackLocale: 'en',
  messages: {de, en},
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.config.globalProperties.$filters = {
  unit: (value: number | string, store: ReturnType<typeof useSystemStore>) => {
    store.getUnit();
    if (store.unit === 'sats') {
      return Number(value);
    } else if (store.unit === 'btc') {
      return satsToBtc(Number(value));
    }
  },
  sats: (value: number | string) => Number(value),
  btc: (value: number | string) => satsToBtc(Number(value)),
  formatUnit: (unit: 'sats' | 'btc') => {
    if (unit === 'sats') {
      return 'Sats';
    } else if (unit === 'btc') {
      return 'BTC';
    }
  },
  satsToUSD: (
    value: string | number,
    store: ReturnType<typeof useBitcoinStore>,
  ) => {
    if (isNaN(parseInt(value.toString()))) {
      return value;
    } else {
      return (
        '$' +
        Number(
          (satsToBtc(parseInt(value.toString())) * store.price).toFixed(2),
        ).toLocaleString()
      );
    }
  },
  localize: (n: number | string) =>
    Number(n).toLocaleString(undefined, {maximumFractionDigits: 8}),
};

configureCompat({
  INSTANCE_EVENT_EMITTER: true,
  CUSTOM_DIR: true,
  COMPONENT_FUNCTIONAL: true,
  OPTIONS_DATA_MERGE: true,
  GLOBAL_EXTEND: true,
  MODE: 2,
});

app.use(BootstrapVue);

const toastOptions: PluginOptions = {
  position: POSITION['BOTTOM_RIGHT'],
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  newestOnTop: true,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
};

app.use(Toast, toastOptions);

app.mount('#app');
