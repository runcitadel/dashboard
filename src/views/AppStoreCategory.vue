<template>
  <div class="p-sm-2">
    <div class="mt-3 mb-4">
      <div class="">
        <h1>{{ t('apps.store.heading') }}</h1>
        <p class="text-muted">
          {{ t('apps.store.subheading') }}
        </p>
      </div>
    </div>
    <b-input
      v-model="searchQuery"
      class="neu-input my-4"
      :placeholder="t('apps.store.search-placeholder')"
      type="text"
      size="lg"
      autofocus
    ></b-input>
    <div class="app-store-card-columns card-columns">
      <card-widget
        v-for="app in foundApps"
        :key="app.id"
        class="pb-2 card-app-list"
      >
        <router-link
          :key="app.id"
          :to="`/app-store/app/${app.id}`"
          class="app-list-app d-flex justify-content-between align-items-center px-3 px-lg-4 py-3"
        >
          <div class="d-flex">
            <div class="d-flex justify-content-center flex-column mx-2">
              <img
                class="app-icon me-2 me-lg-3"
                :src="`https://runcitadel.github.io/old-apps-gallery/${app.id}/icon.svg`"
              />
            </div>
            <div class="d-flex justify-content-center flex-column mt-4">
              <h3 class="app-name font-weight-bolder text-dark mb-1">
                {{ app.name }}
              </h3>
              <h6 class="text-muted mb-2">
                {{ app.tagline }}
              </h6>
              <p class="text-muted mb-0">
                {{
                  truncate(
                    app.description
                      .replaceAll('\n', ' ')
                      .replaceAll('\\n', ' '),
                    200,
                  )
                }}
              </p>
            </div>
          </div>
          <svg
            width="14"
            height="25"
            viewBox="0 0 14 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ms-4 icon-arrow"
          >
            <path
              d="M0.512563 3.0484C-0.170855 2.35104 -0.170855 1.22039 0.512563 0.523023C1.19598 -0.174341 2.30402 -0.174341 2.98744 0.523023L13.4874 11.2373C14.1499 11.9133 14.1731 13.0019 13.54 13.7066L3.91502 24.4209C3.26193 25.1479 2.15494 25.197 1.44248 24.5306C0.730023 23.8642 0.681893 22.7346 1.33498 22.0076L9.82776 12.5537L0.512563 3.0484Z"
              fill="#C3C6D1"
            />
          </svg>
          <!-- Preload gallery images -->
          <div class="d-none">
            <img
              v-for="image in app.gallery"
              :key="app.id + image"
              class="d-none"
              :src="
                image.startsWith('http')
                  ? image
                  : `https://runcitadel.github.io/old-apps-gallery/${app.id}/${image}`
              "
            />
          </div>
        </router-link>
      </card-widget>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import useAppsStore from '../store/apps';
import useSystemStore from '../store/system';
import Fuse from 'fuse.js';

import CardWidget from '../components/CardWidget.vue';

const appsStore = useAppsStore();
const systemStore = useSystemStore();
const {t} = useI18n();
const route = useRoute();

const searchQuery = ref('');

const appsInCategory = computed(() => {
  return appsStore.store.filter(
    (app) =>
      app.category.toLowerCase() ===
      (route.params.category as string).toLowerCase(),
  );
});

const fuse = computed(() => {
  return new Fuse(appsInCategory.value, {keys: ['name', 'tagline']});
});

const foundApps = computed(() => {
  if (!searchQuery.value) return appsInCategory.value;
  let result = fuse.value.search(searchQuery.value).map((val) => val.item);
  return result ? result : appsInCategory.value;
});

// Truncate a string to the given amunt of characters without cutting words
// Add a … at the end
function truncate(text: string, chars: number) {
  if (text.length <= chars) return text;
  const truncated = text.substring(0, chars);
  // eslint-disable-next-line prettier/prettier
  return truncated.substring(0, Math.min(truncated.length, truncated.lastIndexOf(' '))) + '…';
}

appsStore.getAppStore();
systemStore.getUpdateChannel();
</script>

<style lang="scss" scoped>
.app-list-app {
  border-bottom: solid 1px #edf0f7;
  &:first-child {
    padding-top: 0 !important;
  }
  &:last-child {
    border-bottom: none;
  }
  .icon-arrow {
    will-change: tranform;
    transform: translate3d(0, 0, 0);
    transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  &:hover {
    .icon-arrow {
      transform: translate3d(6px, 0, 0);
    }
  }
}

.citadel-dev-note {
  position: relative;
  overflow: visible;
  .rocket {
    font-size: 60px;
    position: absolute;
    top: -30px;
    left: 0;
  }
}
</style>
