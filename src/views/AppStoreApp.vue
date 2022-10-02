<template>
  <div class="p-sm-2">
    <div class="mt-3 mb-1 mb-sm-3 pb-lg-2">
      <router-link
        to="/app-store"
        class="card-link text-muted d-flex align-items-center mb-4"
        ><svg
          width="7"
          height="13"
          viewBox="0 0 7 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="me-1"
        >
          <path
            d="M6.74372 11.4153C7.08543 11.7779 7.08543 12.3659 6.74372 12.7285C6.40201 13.0911 5.84799 13.0911 5.50628 12.7285L0.256283 7.15709C-0.0749738 6.80555 -0.0865638 6.23951 0.229991 5.87303L5.04249 0.301606C5.36903 -0.0764332 5.92253 -0.101971 6.27876 0.244565C6.63499 0.591101 6.65905 1.17848 6.33251 1.55652L2.08612 6.47256L6.74372 11.4153Z"
            fill="#C3C6D1"
          />
        </svg>
        {{ t('apps.store.back') }}</router-link
      >
      <div
        class="d-flex flex-column flex-sm-row justify-content-between align-items-center"
      >
        <div class="d-flex w-xs-100 justify-content-start pe-2">
          <div class="d-block">
            <img
              class="app-icon app-icon-lg me-2 me-sm-3 align-self-top"
              :src="
                app.icon ||
                `https://runcitadel.github.io/old-apps-gallery/${app.id}/icon.svg`
              "
            />
          </div>
          <div>
            <h3 class="d-block font-weight-bold mb-1">
              {{ app.name }}
            </h3>
            <p class="text-muted">{{ app.tagline }}</p>
            <p>
              <small>{{ Object.keys(app.developers)[0] }}</small>
            </p>
          </div>
        </div>
        <div
          v-if="isInstalled && !isUninstalling"
          class="w-xs-100 d-flex flex-column align-items-sm-center"
        >
          <b-button
            v-if="isOffline"
            variant="success"
            size="lg"
            class="px-4 fade-in-out cursor-wait"
            disabled
            >{{ t('apps.store.starting') }}</b-button
          >
          <b-button
            v-else
            variant="primary"
            size="lg"
            class="px-4"
            :href="url"
            target="_blank"
            @click="openApp($event)"
            >{{ t('apps.store.open') }}</b-button
          >
          <div v-if="app.defaultPassword" class="mt-2 text-center">
            <small class="">{{ t('apps.store.default-password') }}</small>
            <input-copy
              size="sm"
              :value="app.defaultPassword"
              class="mt-1"
            ></input-copy>
          </div>
        </div>
        <div v-else class="d-flex flex-column align-items-sm-center w-xs-100">
          <b-button
            v-if="isInstalling"
            variant="success"
            size="lg"
            class="px-4 fade-in-out cursor-wait"
            disabled
            >{{ t('apps.store.installing') }}</b-button
          >
          <b-button
            v-else-if="isUninstalling"
            variant="warning"
            size="lg"
            class="px-4 fade-in-out cursor-wait"
            disabled
            >{{ t('apps.store.uninstalling') }}</b-button
          >
          <b-button
            v-else-if="!app.compatible"
            variant="danger"
            size="lg"
            class="px-4"
            disabled
            >Incompatible</b-button
          >
          <b-button
            v-else
            variant="success"
            size="lg"
            class="px-4"
            @click="installApp"
            >Install</b-button
          >
          <small
            :style="{opacity: isInstalling || isUninstalling ? 1 : 0}"
            class="mt-1 d-block text-muted text-center"
            >This may take a few minutes</small
          >
          <div
            v-if="isInstalling && app.defaultPassword"
            class="mt-2 text-center"
          >
            <small class="">The default password of this app is</small>
            <input-copy
              size="sm"
              :value="app.defaultPassword"
              class="mt-1"
            ></input-copy>
          </div>
        </div>
      </div>
    </div>
    <div class="app-gallery pt-3 pb-4 mb-2 mb-sm-3">
      <img
        v-for="image in app.gallery"
        :key="image"
        class="app-gallery-screen me-3"
        :src="
          image.startsWith('http')
            ? image
            : `https://runcitadel.github.io/old-apps-gallery/${app.id}/${image}`
        "
      />
      <div class="d-block" style="padding: 1px"></div>
    </div>
    <b-row>
      <b-col col cols="12" lg="6" xl="8">
        <card-widget header="About this app">
          <div class="px-3 px-lg-4 pb-4">
            <p class="text-newlines">{{ app?.description }}</p>
          </div>
        </card-widget>
      </b-col>
      <b-col col cols="12" lg="6" xl="4">
        <card-widget header="Information">
          <div class="px-3 px-lg-4 pb-4">
            <table border="0">
              <tr>
                <td>Version</td>
                <td>{{ app.version }}</td>
              </tr>
              <tr>
                <td>Source Code</td>
                <td>
                  <a
                    v-if="typeof app.repo == 'string'"
                    :href="app.repo"
                    target="_blank"
                    >Public</a
                  >
                  <a
                    v-for="(link, name) in app.repo"
                    v-else
                    :key="name"
                    :href="link"
                    >{{ name }}
                  </a>
                </td>
              </tr>
              <tr>
                <td>Developers</td>
                <td>
                  <a
                    v-for="(website, developer) in app.developers"
                    :key="developer"
                    :href="website"
                    target="_blank"
                    >{{ developer }}</a
                  >
                </td>
              </tr>
              <tr>
                <td>Compatibility</td>
                <td>
                  <span v-if="!app.compatible" class="text-danger"
                    >Not compatible</span
                  >
                  <span v-else class="text-success">Compatible</span>
                </td>
              </tr>
            </table>
            <div v-if="app.permissions?.length" class="mb-4">
              <span class="d-block mb-3">Utilizes</span>
              <div
                v-for="dependency in app.permissions"
                :key="dependency.toString()"
              >
                <div
                  v-if="typeof dependency === 'string'"
                  class="d-flex align-items-center justify-content-between w-100 mb-3"
                >
                  <div class="d-flex align-items-center">
                    <img
                      :src="src(dependency)"
                      style="width: 50px; height: 50px; border-radius: 12px"
                      class="me-2"
                    />
                    <span class="text-muted my-0">{{
                      formatDependency(dependency)
                    }}</span>
                  </div>
                  <div v-if="isDependencyInstalled(dependency)">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.3035 10.7643C19.5718 10.4486 20.0451 10.4103 20.3607 10.6785C20.6763 10.9468 20.7147 11.4201 20.4464 11.7357L14.0714 19.2357C13.799 19.5563 13.3162 19.5901 13.0017 19.3105L9.62671 16.3105C9.31712 16.0354 9.28924 15.5613 9.56443 15.2517C9.83962 14.9421 10.3137 14.9142 10.6233 15.1894L13.4251 17.68L19.3035 10.7643Z"
                        fill="#00CD98"
                      />
                    </svg>
                    <small class="text-success">Installed</small>
                  </div>
                  <div v-else>
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#cc3444"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0l12 12a.75.75 0 11-1.06 1.06l-12-12a.75.75 0 010-1.06z"
                        clip-rule="evenodd"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        d="M18.53 5.47a.75.75 0 010 1.06l-12 12a.75.75 0 01-1.06-1.06l12-12a.75.75 0 011.06 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <small class="text-danger">Not installed</small>
                  </div>
                </div>
                <div
                  v-for="realDependency in dependency"
                  v-else
                  :key="realDependency.toString()"
                  class="d-flex align-items-center justify-content-between mb-3 w-100"
                >
                  <div class="d-flex align-items-center">
                    <img
                      :src="src(realDependency)"
                      style="width: 50px; height: 50px; border-radius: 12px"
                      class="me-2"
                    />
                    <span class="text-muted my-0">{{
                      formatDependency(realDependency)
                    }}</span>
                  </div>
                  <div v-if="isDependencyInstalled(realDependency)">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.3035 10.7643C19.5718 10.4486 20.0451 10.4103 20.3607 10.6785C20.6763 10.9468 20.7147 11.4201 20.4464 11.7357L14.0714 19.2357C13.799 19.5563 13.3162 19.5901 13.0017 19.3105L9.62671 16.3105C9.31712 16.0354 9.28924 15.5613 9.56443 15.2517C9.83962 14.9421 10.3137 14.9142 10.6233 15.1894L13.4251 17.68L19.3035 10.7643Z"
                        fill="#00CD98"
                      />
                    </svg>
                    <small class="text-success">Installed</small>
                  </div>
                  <div v-else>
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#cc3444"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0l12 12a.75.75 0 11-1.06 1.06l-12-12a.75.75 0 010-1.06z"
                        clip-rule="evenodd"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        d="M18.53 5.47a.75.75 0 010 1.06l-12 12a.75.75 0 01-1.06-1.06l12-12a.75.75 0 011.06 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <small class="text-danger">Not installed</small>
                  </div>
                </div>
              </div>
            </div>
            <b-link
              :href="app.support"
              target="_blank"
              size="sm"
              class="mb-2 py-1"
              block
              >Get support</b-link
            >
          </div>
        </card-widget>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onBeforeUnmount, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';

import delay from '../helpers/delay';
import useAppsStore from '../store/apps';
import useLightningStore from '../store/lightning';

import CardWidget from '../components/CardWidget.vue';
import InputCopy from '../components/Utility/InputCopy.vue';
import { app } from '@runcitadel/sdk';

const appsStore = useAppsStore();
const lightningStore = useLightningStore();
const route = useRoute();
const {t} = useI18n();

const isOffline = ref(false);
const checkIfAppIsOffline = ref(true);

const app = computed(() => {
  return appsStore.store.find((app) => app.id === route.params.id) as app;
});
const isInstalled = computed(() => {
  const installedAppIndex = appsStore.installed.findIndex(
    (_app) => _app.id === app.value.id,
  );
  return installedAppIndex !== -1;
});
const isInstalling = computed(() => {
  const index = appsStore.installing.findIndex(
    (appId) => appId === app.value.id,
  );
  return index !== -1;
});
const isUninstalling = computed(() => {
  const index = appsStore.uninstalling.findIndex(
    (appId) => appId === app.value.id,
  );
  return index !== -1;
});
const url = computed(() => {
  if (window.location.origin.indexOf('.onion') > 0) {
    const installedApp = appsStore.installed.find(
      (_app) => _app.id === app.value.id,
    );
    return `http://${installedApp?.hiddenService || ''}${app.value.path}`;
  } else {
    if (app.value.torOnly) {
      return '#';
    }
    // @ts-expect-error Types need fixing
    return `http://${window.location.hostname}:${app.value.port}${app.value.path}`;
  }
});
onMounted(async () => {
  await appsStore.getAppStore();
  if (isInstalled.value) {
    pollOfflineApp();
  }
  await lightningStore.getVersionInfo();
  if (!appsStore.hasElectrum) {
    await appsStore.getHasElectrum();
  }
});
onBeforeUnmount(() => {
  checkIfAppIsOffline.value = false;
});
function formatDependency(dependency: string) {
  switch (dependency) {
    case 'bitcoind':
      return 'Bitcoin Core';
    case 'lnd':
      return 'LND';
    case 'electrum':
      return 'Electrum Server';
    default:
      return dependency;
  }
}
function isDependencyInstalled(dependency: string) {
  const allInstalled = ['bitcoind', lightningStore.implementation, ...appsStore.installed.map((app) => app.id as string)];
  if (appsStore.hasElectrum) allInstalled.push("electrum");
  return allInstalled.includes(dependency);
}
function src(dependency: string) {
  return new URL(
    `../assets/app-store/dependencies/${dependency}.svg`,
    import.meta.url,
  ).href;
}
function installApp() {
  if (!app.value.compatible) return;
  appsStore.install(app.value.id as string);
  isOffline.value = true;
  pollOfflineApp();
}
function openApp(event: Event) {
  if (app.value.id === 'bluewallet') checkIfAppIsOffline.value = false;
  if (app.value.torOnly && window.location.origin.indexOf('.onion') < 0) {
    event.preventDefault();
    alert(
      `${app.value.name} can only be used over Tor. Please access your Citadel in a Tor browser on your remote access URL (Settings > Tor > Remote Access URL) to open this app.`,
    );
  }
  return;
}
const skipCheckApps = ['bluewallet', 'ringtools'];
async function pollOfflineApp() {
  checkIfAppIsOffline.value = true;
  if (skipCheckApps.includes(app.value.id as string)) checkIfAppIsOffline.value = false;
  while (checkIfAppIsOffline.value) {
    try {
      await window.fetch(url.value, {mode: 'no-cors'});
      isOffline.value = false;
      checkIfAppIsOffline.value = false;
    } catch (error) {
      isOffline.value = true;
    }
    await delay(1000);
  }
}
</script>

<style lang="scss" scoped>
td {
  padding: 0.5rem;
  padding-left: 0;
  padding-right: 2rem;
  &:nth-child(2) {
    width: 100%;
    text-align: right;
    padding-right: 0;
  }
}
</style>
