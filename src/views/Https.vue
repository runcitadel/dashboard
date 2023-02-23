<template>
  <div>
    <div class="p-sm-2">
      <div class="my-3">
        <div>
          <h1>https</h1>
          <p>Access your node securely</p>
        </div>
      </div>
    </div>
    <div>
      <b-card
        header-tag="header"
        footer-tag="footer"
        no-body
        class="mb-4 card-custom d-flex p-2 d-flex flex-row align-items-center"
      >
        <img
          src="@/assets/logo.svg"
          class="app-icon me-2"
          style="border: none" />
        <span v-if="!apps['dashboard']">Citadel dashboard</span
        ><a
          v-else
          :href="'https://' + userStore.letsencryptSettings.app_domains!['dashboard']"
          >Citadel dashboard</a
        ><ToggleSwitch
          class="ms-auto me-2"
          :is-on-initially="!!apps['dashboard']"
          @toggle-off="toggleOff('dashboard')"
          @toggle-on="toggleOn('dashboard')"
      /></b-card>

      <b-card
        v-for="app in appsStore.installed"
        :key="app.id"
        header-tag="header"
        footer-tag="footer"
        no-body
        class="mb-4 card-custom d-flex p-2 d-flex flex-row align-items-center"
      >
        <img
          :src="`https://runcitadel.github.io/old-apps-gallery/${app.id}/icon.svg`"
          class="app-icon me-2 border-none" />
        <span v-if="!apps[app.id]" class="mb-0">{{ app.name }}</span
        ><a
          v-else
          :href="'https://' + userStore.letsencryptSettings.app_domains![app.id]"
          >{{ app.name }}</a
        >
        <ToggleSwitch
          class="ms-auto me-2"
          :is-on-initially="!!apps[app.id]"
          @toggle-off="toggleOff(app.id)"
          @toggle-on="toggleOn(app.id)"
      /></b-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAppsStore from '../store/apps';
import useUserStore from '../store/user';
import {useRouter} from 'vue-router';
import useSdkStore from '../store/sdk';
import ToggleSwitch from '../components/ToggleSwitch.vue';

const appsStore = useAppsStore();
const userStore = useUserStore();
const sdkStore = useSdkStore();
const router = useRouter();
await userStore.getLetsEncryptSettings();
if (
  !userStore.letsencryptSettings.agreed_lets_encrypt_tos ||
  !userStore.letsencryptSettings.email
) {
  router.push('/https/setup');
}
await userStore.getRunningCitadelSettings();
await appsStore.getInstalledApps();
// Convert appsStore.installed to an object (It's an array, convert it to an object where the key is the app id and the value is wheter userStore.letsEncrypt.appDomains[app.id] is set or not)
const apps = appsStore.installed
  .filter(
    (app) =>
      ![
        'lnd',
        'core-ln',
        'bitcoin-core',
        'bitcoin-knots',
        'electrs',
        'fulcrum',
        'tailscale',
      ].includes(app.id),
  )
  .reduce<Record<string, boolean>>((acc, app) => {
    acc[app.id] = userStore.letsencryptSettings.app_domains
      ? !!userStore.letsencryptSettings.app_domains[app.id]
      : false;
    return acc;
  }, {});

if (userStore.letsencryptSettings.app_domains) {
  apps['dashboard'] = !!userStore.letsencryptSettings.app_domains['dashboard'];
}

function toggleOn(appId: string) {
  router.push('/https/setup/' + appId);
}

async function toggleOff(appId: string) {
  delete userStore.letsencryptSettings.app_domains![appId];
  await sdkStore.citadel.auth.removeDomain(appId);
}
</script>
