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
      class="text-center text-small text-body-secondary text-truncate mb-1"
      >Uninstalling...</span
    >
    <span
      v-else-if="isOffline"
      class="text-center text-small text-body-secondary text-truncate mb-1"
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

<script lang="ts" setup>
import {computed, onBeforeUnmount, ref} from 'vue';
import useAppsStore from '../store/apps';
import {ENABLE_HTTPS} from '../utils/feature-flags.js';
// @ts-expect-error No type definitions for this yet
import {TrashIcon} from '@bitcoin-design/bitcoin-icons-vue/filled/esm/index.js';
import flatten from 'lodash/flatten';

import delay from '../helpers/delay';
import useUserStore from '../store/user';

const skipCheckApps = ['bluewallet', 'ringtools'];

const props = defineProps({
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
  implements: {
    type: String,
    default: '',
  },
});
const appsStore = useAppsStore();
const userStore = useUserStore();

const isOffline = ref(false);
const checkIfAppIsOffline = ref(false);

const url = computed(() => {
  if (window.location.origin.indexOf('.onion') > 0) {
    return `http://${props.hiddenService}${props.path}`;
  } else {
    if (props.torOnly) {
      return '#';
    }
    if (
      ENABLE_HTTPS &&
      userStore.letsencryptSettings.app_domains &&
      userStore.letsencryptSettings.app_domains[props.id]
    ) {
      return `https://${userStore.letsencryptSettings.app_domains[props.id]}`;
    }
    return `http://${window.location.hostname}:${props.port}${props.path}`;
  }
});

onBeforeUnmount(() => {
  checkIfAppIsOffline.value = false;
});

const dependants = computed(() => {
  return appsStore.installed.filter((app) => {
    const permissions = flatten(app.permissions);
    return (
      permissions.includes(props.id) || permissions.includes(props.implements)
    );
  });
});
function uninstall(name: string, appId: string) {
  // The uninstall button shouldn't be shown for these apps, but just for extra safety, do this too
  if (['lnd', 'core-ln', 'bitcoin-core', 'bitcoin-knots'].includes(appId)) {
    alert('This app can not be uninstalled currently');
    return;
  }
  let message = `Are you sure you want to uninstall ${name}? This is will also delete all of its data. `;
  if (props.implements) {
    message += `This app also provides "${props.implements}". If you uninstall it, you will not be able to install or use use any apps that depend on ${props.implements} until you install another app that provides ${props.implements}. `;
    if (dependants.value.length > 0) {
      message += `Apps that need ${props.implements} are ${dependants.value
        .map((app) => app.name)
        .join(', ')}.`;
    }
  }
  if (!window.confirm(message.trim())) {
    return;
  }
  appsStore.uninstall(appId);
}
function openApp(event: Event) {
  if (props.torOnly && window.location.origin.indexOf('.onion') < 0) {
    event.preventDefault();
    alert(
      `${props.name} can only be used over Tor. Please access your Citadel in a Tor browser on your remote access URL (Settings > Tor > Remote Access URL) to open this app.`,
    );
    return;
  }
  if (props.isUninstalling || isOffline.value) {
    event.preventDefault();
    return;
  }
  return;
}
async function pollOfflineApp() {
  if (ENABLE_HTTPS) {
    await userStore.getLetsEncryptSettings();
  }
  checkIfAppIsOffline.value = true;
  if (skipCheckApps.includes(props.id)) {
    isOffline.value = false;
    checkIfAppIsOffline.value = false;
  }
  if (
    window.location.protocol === 'https' &&
    !url.value.startsWith('https://')
  ) {
    isOffline.value = false;
    checkIfAppIsOffline.value = false;
  }
  while (checkIfAppIsOffline.value) {
    try {
      await window.fetch(url.value, {mode: 'no-cors'});
      isOffline.value = false;
      checkIfAppIsOffline.value = false;
    } catch {
      await delay(1000);
      try {
        await window.fetch(url.value);
        isOffline.value = false;
        checkIfAppIsOffline.value = false;
      } catch {
        isOffline.value = true;
      }
    }
    await delay(1000);
  }
}
pollOfflineApp();
</script>

<style lang="scss" scoped>
.installed-app {
  width: 200px;
  position: relative;
  .installed-app-link {
    text-decoration: none;
    .installed-app-icon {
      box-shadow: var(--card-shadow);
    }
  }
  .uninstall-btn {
    position: absolute;
    bottom: 0;
  }
}
</style>
