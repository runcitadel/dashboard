import {createApp} from 'vue';
import BootstrapVue3 from 'bootstrap-vue-3';
import {createPinia} from 'pinia';
import {createI18n} from 'vue-i18n';
import Toast, {PluginOptions, POSITION} from 'vue-toastification';
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';
import 'vue-toastification/dist/index.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

import App from './App.vue';
import router from './router/index';
import {satsToBtc} from './helpers/units';
import type useSystemStore from './store/system';
import en from './i18n/en';
import de from './i18n/de';

const i18n = createI18n({
  allowComposition: true,
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
  localize: (n: number | string) =>
    Number(n).toLocaleString(undefined, {maximumFractionDigits: 8}),
};

app.use(BootstrapVue3);

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

app.use(FloatingVue);

app.mount('#app');
