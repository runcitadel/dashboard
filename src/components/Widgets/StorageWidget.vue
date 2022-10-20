<template>
  <card-widget :header="t('storage')" :status="cardStatus">
    <div class="card-custom-body">
      <div class="card-app-info px-3 px-lg-4">
        <div class="d-flex w-100 justify-content-between mb-4">
          <div>
            <div>
              <h3 class="mb-1">
                <b-badge
                  v-if="systemStore.isNvme"
                  class="bg-success me-1 text-end"
                  >NVMe</b-badge
                >
                {{ readableSize(storage.used) }}
              </h3>
              <p class="text-muted mb-0">
                {{ t('used-out-of', {storage: readableSize(storage.total)}) }}
              </p>
            </div>
          </div>

          <svg
            width="66"
            height="66"
            viewBox="0 0 66 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="66" height="66" rx="12" fill="url(#paint10_linear)" />
            <path
              d="M17.7143 14C16.1762 14 15 15.1762 15 16.7143V49.2857C15 50.8238 16.1762 52 17.7143 52H50.2857C51.8238 52 53 50.8238 53 49.2857V22.3231C53 22.0517 52.9088 21.8714 52.7279 21.6905L45.3095 14.2721C45.1286 14.0912 44.9483 14 44.6769 14H17.7143ZM22.2381 15.8095H43.9524V26.6667C43.9524 27.6619 43.1381 28.4762 42.1429 28.4762H24.0476C23.0524 28.4762 22.2381 27.6619 22.2381 26.6667V15.8095ZM36.7143 18.5238V25.7619H40.3333V18.5238H36.7143ZM24.0476 34.8095H43.9524C44.9476 34.8095 45.7619 35.6238 45.7619 36.619V50.1905H22.2381V36.619C22.2381 35.6238 23.0524 34.8095 24.0476 34.8095ZM17.7143 47.4762H19.5238V49.2857H17.7143V47.4762ZM48.4762 47.4762H50.2857V49.2857H48.4762V47.4762Z"
              fill="white"
            />
            <defs>
              <linearGradient
                v-if="isStorageFull"
                id="paint10_linear"
                x1="0"
                y1="0"
                x2="66"
                y2="66"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#F2766E" />
                <stop offset="1" stop-color="#B63114" />
              </linearGradient>
              <linearGradient
                v-else-if="isRunningLowOnStorage"
                id="paint10_linear"
                x1="0"
                y1="0"
                x2="66"
                y2="66"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#F4E44E" />
                <stop offset="1" stop-color="#F1BB6B" />
              </linearGradient>
              <linearGradient
                v-else
                id="paint10_linear"
                x1="0"
                y1="0"
                x2="66"
                y2="66"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#A0D3D7" />
                <stop offset="1" stop-color="#457281" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div class>
        <div class="px-3 px-lg-4 mb-3">
          <b-progress
            :value="Math.round((storage.used * 100) / storage.total)"
            class="mb-1"
            :style="{height: '5px'}"
            :variant="
              isRunningLowOnStorage
                ? isStorageFull
                  ? 'danger'
                  : 'warning'
                : 'success'
            "
          ></b-progress>
          <div class="text-end">
            <small class="text-muted">{{
              t('available', {
                storage: readableSize(storage.total - storage.used),
              })
            }}</small>
          </div>

          <b-alert
            v-if="isRunningLowOnStorage"
            :variant="isStorageFull ? 'danger' : 'warning'"
            class="mt-3"
            show
          >
            <small>{{ t('storage-full-suggestion') }}</small>
          </b-alert>
        </div>
        <div class="pt-1">
          <a
            class="card-link px-3 px-lg-4"
            @click="
              () => {
                showBreakdown = !showBreakdown;
                return false;
              }
            "
            >{{ showBreakdown ? t('hide-usage') : t('view-usage') }}</a
          >
          <div class="pb-4"></div>
          <b-collapse id="storage-breakdown-collapse" v-model="showBreakdown">
            <ul class="app-stat-list px-3 px-lg-4">
              <li
                v-for="app in storage.breakdown"
                :key="app.id"
                class="app-stat-list-item mb-2"
              >
                <div class="d-flex align-items-center">
                  <img
                    v-if="app.id === 'citadel'"
                    class="app-stat-list-item-icon me-2"
                    :src="src"
                  />
                  <img
                    v-else
                    class="app-stat-list-item-icon me-2"
                    :src="`https://runcitadel.github.io/old-apps-gallery/${app.id}/icon.svg`"
                  />
                  <div class="w-100">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <span v-if="app.id === 'citadel'"
                        >{{ t('system') }}
                        <b-icon-info-circle-fill
                          v-tooltip.bottom="t('system-including')"
                          icon="info-circle-fill"
                          style="opacity: 0.4"
                          variant="dark"
                          class="ms-1"
                        />
                      </span>
                      <span v-else>{{ getAppName(app.id) }}</span>

                      <!-- There's an edge case where a negative value may be returned by the API -->
                      <small v-if="app.used < 0" class="text-muted">{{
                        t('calculating')
                      }}</small>
                      <span v-else>{{ readableSize(app.used) }}</span>
                    </div>
                    <b-progress
                      :value="Math.round((app.used * 100) / storage.used)"
                      class="mt-1"
                      variant="success"
                      :style="{height: '2px'}"
                    ></b-progress>
                  </div>
                </div>
              </li>
              <li class="app-stat-list-item pb-2"></li>
            </ul>
          </b-collapse>
        </div>
      </div>
    </div>
  </card-widget>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';

import {BIconInfoCircleFill} from 'bootstrap-icons-vue';

import {readableSize} from '../../helpers/size';
import CardWidget from '../CardWidget.vue';
import useAppsStore from '../../store/apps';
import useSystemStore from '../../store/system';

const systemStore = useSystemStore();
const appsStore = useAppsStore();
const {t} = useI18n();

const showBreakdown = ref(false);

const storage = computed(
  (): {
    total: number;
    used: number;
    breakdown: {id: string; used: number}[];
  } => {
    return systemStore.storage;
  },
);

const src = computed((): string => {
  return new URL(`../../assets/icon-system.svg`, import.meta.url).href;
});

const isRunningLowOnStorage = computed((): boolean => {
  // less than 1GB remaining
  if (storage.value && storage.value.total) {
    return storage.value.total - storage.value.used < 1000000000;
  }
  return false;
});

const isStorageFull = computed((): boolean => {
  // less than 100MB remaining
  if (storage.value && storage.value.total) {
    return storage.value.total - storage.value.used < 100000000;
  }
  return false;
});
const cardStatus = computed(
  ():
    | {
        text: string;
        variant: 'success' | 'primary' | 'muted' | 'danger' | 'warning';
        blink: boolean;
      }
    | undefined => {
    if (isStorageFull.value) {
      return {
        text: 'No space left',
        variant: 'danger',
        blink: true,
      };
    }
    if (isRunningLowOnStorage.value) {
      return {
        text: 'Low space',
        variant: 'warning',
        blink: true,
      };
    }
    return undefined;
  },
);
// to map app ID's to app names
appsStore.getAppStore();
systemStore.getDiskInfo();
systemStore.getStorage();

function getAppName(appId: string) {
  const appStore = appsStore.store;
  return appStore.find(({id}) => id === appId)?.name || appId;
}
</script>

<style scoped>
a {
  cursor: pointer;
}
</style>
