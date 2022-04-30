<template>
  <div class="pb-3 mb-2 installed-app d-flex flex-column align-items-center">
    <a
      :href="url"
      target="_blank"
      class="d-block mb-3 installed-app-link"
      :class="isUninstalling || isOffline ? 'fade-in-out cursor-wait' : ''"
      :disabled="isUninstalling || isOffline"
      @click="openApp($event)"
      ><img
        class="installed-app-icon app-icon"
        :alt="name"
        :src="`https://runcitadel.github.io/old-apps-gallery/${id}/icon.svg`"
      />
    </a>
    <span
      v-if="isUninstalling"
      class="text-center text-small text-muted text-truncate mb-1"
      >Uninstalling...</span
    >
    <span
      v-else-if="isOffline"
      class="text-center text-small text-muted text-truncate mb-1"
      >Starting...</span
    >
    <span v-else class="text-center text-truncate mb-1">{{ name }}</span>
    <b-button
      v-if="showUninstallButton && !isUninstalling"
      class="uninstall-btn"
      variant="outline-danger"
      size="sm"
      @click="uninstall(name, id)"
      ><small
        ><div class="icon-16px"><TrashIcon /></div>
        Uninstall</small
      ></b-button
    >
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import useAppsStore from '../store/apps';
// @ts-expect-error No type definitions for this yet
import {TrashIcon} from '@bitcoin-design/bitcoin-icons-vue/filled/esm/index.js';

import delay from '../helpers/delay';

export default defineComponent({
  components: {
    TrashIcon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    hiddenService: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      default: '/',
    },
    showUninstallButton: {
      type: Boolean,
      default: false,
    },
    isUninstalling: {
      type: Boolean,
      default: false,
    },
    torOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const appsStore = useAppsStore();
    return {
      appsStore,
    };
  },
  data() {
    return {
      isOffline: false,
      checkIfAppIsOffline: true,
    };
  },
  computed: {
    url: function () {
      if (window.location.origin === 'https://node.runcitadel.space') {
        switch (this.id) {
          case 'ride-the-lightning':
            return 'https://rtl.runcitadel.space';
          case 'lnme':
            return 'https://donate.runcitadel.space';
          case 'nextcloud':
            return 'https://cloud.runcitadel.space';
          case 'btcpay-server':
            return 'https://pay.runcitadel.space';
          case 'lightning-terminal':
            return 'https://ln-terminal.runcitadel.space';
          case 'btc-rpc-explorer-public-fast':
            return 'https://rpc-explorer.runcitadel.space';
          case 'supabase':
            return 'https://supabase-ln.runcitadel.space';
          case 'lightning-addresses':
            return 'https://sats4.me';
        }
        return `https://${this.id}.runcitadel.space`;
      }
      if (window.location.origin.indexOf('.onion') > 0) {
        return `http://${this.hiddenService}${this.path}`;
      } else {
        if (this.torOnly) {
          return '#';
        }
        return `http://${window.location.hostname}:${this.port}${this.path}`;
      }
    },
  },
  created() {
    this.pollOfflineApp();
  },
  beforeUnmount() {
    this.checkIfAppIsOffline = false;
  },
  methods: {
    uninstall(name: string, appId: string) {
      if (
        !window.confirm(
          `Are you sure you want to uninstall ${name}? This is will also delete all of its data.`,
        )
      ) {
        return;
      }
      this.appsStore.uninstall(appId);
    },
    openApp(event: Event) {
      if (this.torOnly && window.location.origin.indexOf('.onion') < 0) {
        event.preventDefault();
        alert(
          `${this.name} can only be used over Tor. Please access your Citadel in a Tor browser on your remote access URL (Settings > Tor > Remote Access URL) to open this app.`,
        );
        return;
      }
      if (this.isUninstalling || this.isOffline) {
        event.preventDefault();
        return;
      }
      return;
    },
    async pollOfflineApp() {
      this.checkIfAppIsOffline = true;
      if (this.id === 'bluewallet') this.checkIfAppIsOffline = false;
      while (this.checkIfAppIsOffline) {
        try {
          await window.fetch(this.url, {mode: 'no-cors'});
          this.isOffline = false;
          this.checkIfAppIsOffline = false;
        } catch (error) {
          this.isOffline = true;
        }
        await delay(1000);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.installed-app {
  width: 200px;
  position: relative;
  .installed-app-link {
    text-decoration: none;
    .installed-app-icon {
      box-shadow: 0px 10px 30px rgba(209, 213, 223, 0.5);
    }
  }
  .uninstall-btn {
    position: absolute;
    bottom: 0;
  }
}
</style>
