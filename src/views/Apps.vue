<template>
  <div class="p-sm-2">
    <div v-if="appsStore.installed.length">
      <div class="my-3 pb-3">
        <div class="d-flex justify-content-between align-items-center">
          <h1>apps</h1>
          <div>
            <b-button
              variant="outline-primary"
              size="sm"
              @click="startUpdate"
              >{{
                isUpdating ? 'Update running in the background...' : 'Update'
              }}</b-button
            >
            <b-button variant="outline-primary" size="sm" @click="toggleEdit">{{
              isEditing ? 'Done' : 'Edit'
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
          :show-uninstall-button="isEditing"
          :is-uninstalling="appsStore.uninstalling.includes(app.id)"
        >
        </installed-app>
      </div>
    </div>
    <div v-else>
      <div class="my-3 pb-3">
        <h1>apps</h1>
        <div
          class="d-flex flex-column justify-content-center align-items-center py-5 mb-lg-5"
        >
          <p class="text-muted mb-2">You don't have any apps installed yet</p>
          <b-button variant="success" class="px-4" :to="'app-store'"
            >Go to App Store</b-button
          >
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

const appsStore = useAppsStore();
const systemStore = useSystemStore();
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
