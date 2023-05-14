<template>
  <div class="p-sm-2">
    <div v-if="appsStore.installed.length">
      <div class="my-3 pb-3">
        <div class="d-flex justify-content-between align-items-center">
          <h1>{{ t('apps.overview.heading') }}</h1>
          <div>
            <b-button
              variant="outline-primary"
              size="sm"
              @click="startUpdate"
              >{{
                isUpdating
                  ? t('apps.overview.update-running')
                  : t('apps.overview.update')
              }}</b-button
            >
            <b-button variant="outline-primary" size="sm" @click="toggleEdit">{{
              isEditing ? t('apps.overview.done') : t('apps.overview.edit')
            }}</b-button>
          </div>
        </div>
      </div>
      <div class="d-flex flex-wrap justify-content-start apps-container">
        <installed-app
          v-for="app in appsStore.installed"
          :id="app.id"
          :key="app.id"
          :name="app.name"
          :port="app.port"
          :path="app.path"
          :hidden-service="(app.hiddenService as string)"
          :tor-only="app.torOnly"
          :show-uninstall-button="
            isEditing &&
            !['lnd', 'core-ln', 'bitcoin-core', 'bitcoin-knots'].includes(
              app.id,
            )
          "
          :is-uninstalling="appsStore.uninstalling.includes(app.id)"
          :implements="app.implements"
        >
        </installed-app>
      </div>
    </div>
    <div v-else>
      <div class="my-3 pb-3">
        <h1>{{ t('apps.overview.heading') }}</h1>
        <div
          class="d-flex flex-column justify-content-center align-items-center py-5 mb-lg-5"
        >
          <p class="text-body-secondary mb-2">{{ t('apps.overview.none-installed') }}</p>
          <b-button variant="success" class="px-4" :to="'app-store'">{{
            t('apps.overview.go-to-app-store')
          }}</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import InstalledApp from '../components/InstalledApp.vue';
import useAppsStore from '../store/apps';
import useSystemStore from '../store/system';
import {useI18n} from 'vue-i18n';

const appsStore = useAppsStore();
const systemStore = useSystemStore();
const {t} = useI18n();
const isEditing = ref(false);
const isUpdating = ref(false);
appsStore.getInstalledApps();
function toggleEdit() {
  isEditing.value = !isEditing.value;
}
function startUpdate() {
  if (isUpdating.value) return;
  appsStore.updateApps();
  isUpdating.value = true;
  systemStore.getUpdateStatus();
  window.setTimeout(() => {
    isUpdating.value = false;
    systemStore.getUpdateStatus();
  }, 2000);
}
</script>

<style lang="scss" scoped>
.apps-container {
  column-gap: 2rem;
}
</style>
