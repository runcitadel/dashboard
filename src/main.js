import { createApp, configureCompat } from "vue";
import BootstrapVue from "bootstrap-vue/src/index.js";

import App from "./App.vue";
import router from "./router/index.ts";
import store from "./store/index.ts";

import { satsToBtc } from "@/helpers/units.ts";

// import "@/global-styles/designsystem.scss";
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App);

app.use(store);
app.use(router);

app.config.globalProperties.$filters = {
  unit: (value) => {
    if (store.state.system.unit === "sats") {
      return Number(value);
    } else if (store.state.system.unit === "btc") {
      return satsToBtc(value);
    }
  },
  sats: (value) => Number(value),
  btc: (value) => satsToBtc(value),
  formatUnit: (unit) => {
    if (unit === "sats") {
      return "Sats";
    } else if (unit === "btc") {
      return "BTC";
    }
  },
  satsToUSD: (value) => {
    if (isNaN(parseInt(value))) {
      return value;
    } else {
      return (
        "$" +
        Number(
          (satsToBtc(value) * store.state.bitcoin.price).toFixed(2)
        ).toLocaleString()
      );
    }
  },
  localize: n => Number(n).toLocaleString(undefined, { maximumFractionDigits: 8 }),
};

configureCompat({
  INSTANCE_EVENT_EMITTER: true,
  CUSTOM_DIR: true,
  COMPONENT_FUNCTIONAL: true,
  OPTIONS_DATA_MERGE: true,
  GLOBAL_EXTEND: true,
});

app.use(BootstrapVue);
app.mount("#app");
