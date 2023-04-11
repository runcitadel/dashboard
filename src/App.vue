<template>
  <div id="app">
    <transition name="loading" mode="default">
      <div v-if="isIframe">
        <div
          class="d-flex flex-column align-items-center justify-content-center min-vh100 p-2"
        >
          <img
            alt="Citadel"
            src="@/assets/logo.svg"
            height="200"
            class="mb-5 logo"
          />
          <span class="text-muted w-75 text-center">
            <small
              >For security reasons, Citadel cannot be embedded in an
              iframe.</small
            >
          </span>
        </div>
      </div>
      <loading
        v-else-if="systemStore.updateStatus.state === 'installing'"
        :progress="systemStore.updateStatus.progress"
      >
        <div class="text-center">
          <small class="text-muted d-block">{{
            `${systemStore.updateStatus.description}...`
          }}</small>
          <b-alert class="system-alert" variant="warning" show>
            <small>{{ t('refresh-warning-update') }}</small>
          </b-alert>
        </div>
      </loading>
      <shutdown
        v-else-if="
          systemStore.hasShutdown ||
          systemStore.shuttingDown ||
          systemStore.rebooting
        "
        :has-shutdown="systemStore.hasShutdown"
        :shutting-down="systemStore.shuttingDown"
        :rebooting="systemStore.rebooting"
      >
        <div
          v-if="systemStore.shuttingDown || systemStore.rebooting"
          class="text-center"
        >
          <b-alert class="system-alert" variant="warning" show>
            <small>{{
              systemStore.shuttingDown
                ? t('refresh-warning-shutdown')
                : t('refresh-warning-reboot')
            }}</small>
          </b-alert>
        </div>
      </shutdown>
      <loading v-else-if="loading" :progress="loadingProgress"> </loading>
      <!-- component matched by the route will render here -->
      <router-view v-else></router-view>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import useSystemStore from './store/system';
import useUserStore from './store/user';
import useUiStore from './store/ui';
import useSdkStore from './store/sdk';
import useToast from './utils/toast';
import delay from './helpers/delay';
import Shutdown from './components/Shutdown.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Loading from './components/Loading.vue';
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {ENABLE_HTTPS} from './utils/feature-flags.js';

const systemStore = useSystemStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const sdkStore = useSdkStore();
const toast = useToast();
const {t} = useI18n();

const isIframe = window.self !== window.top;
const loading = ref(true);
const loadingProgress = ref(0);
const loadingPollInProgress = ref(false);
const loadingInterval = ref<null | number>(null);
const updateStatusInterval = ref<null | number>(null);

const updating = computed(() => {
  return systemStore.updateStatus.state === 'installing';
});

watch(
  loading,
  (isLoading) => {
    window.clearInterval(loadingInterval.value!);
    //if loading, check loading status every two seconds
    if (isLoading) {
      loadingInterval.value = window.setInterval(getLoadingStatus, 2000);
    } else {
      //else check every 20s
      loadingInterval.value = window.setInterval(getLoadingStatus, 20000);
    }
  },
  {
    immediate: true,
  },
);
watch(
  updating,
  (isUpdating, wasUpdating) => {
    window.clearInterval(updateStatusInterval.value!);
    // if updating, check loading status every two seconds
    if (isUpdating) {
      updateStatusInterval.value = window.setInterval(() => {
        systemStore.getUpdateStatus();
      }, 2 * 1000);
    } else {
      //else check every minute
      updateStatusInterval.value = window.setInterval(() => {
        systemStore.getUpdateStatus();
      }, 60 * 1000);

      // if it just finished updating, then show success/failure toast
      if (wasUpdating) {
        if (systemStore.updateStatus.state === 'failed') {
          toast.error('Update failed', systemStore.updateStatus.description);
        } else {
          systemStore.getAvailableUpdate();
        }

        toast.success(
          'Update successful',
          systemStore.updateStatus.description,
        );

        //refresh window to fetch latest code of dashboard
        delay(2000).then(() => {
          // @ts-expect-error The parameter to reload is non-standard, but supported in some browsers
          window.location.reload(true);
        });
      }
    }
  },
  {immediate: true},
);

onMounted(() => {
  //check if system is updating
  systemStore.getUpdateStatus();

  //for 100vh consistency
  updateViewPortHeightCSS();
  window.addEventListener('resize', updateViewPortHeightCSS);

  const initTheme = getThemePreference();
  uiStore.setTheme(initTheme);
  if (new Date().getMonth() == 3 && new Date().getDate() == 1) {
    document.documentElement.setAttribute('data-april-fools', 'today');
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewPortHeightCSS);
  window.clearInterval(loadingInterval.value!);
  window.clearInterval(updateStatusInterval.value!);
});

function getThemePreference() {
  const activeTheme = localStorage.getItem('user-theme') as 'light' | 'dark';
  const hasDarkPreference = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  if (activeTheme) {
    return activeTheme;
  } else {
    if (hasDarkPreference) {
      return 'dark';
    } else {
      return 'light';
    }
  }
}

//TODO: move this to the specific layout that needs this 100vh fix
function updateViewPortHeightCSS() {
  return document.documentElement.style.setProperty(
    '--vh100',
    `${window.innerHeight}px`,
  );
}
async function getLoadingStatus() {
  // Skip if previous poll in progress or if system is updating
  if (
    loadingPollInProgress.value ||
    systemStore.updateStatus.state === 'installing'
  ) {
    return;
  }

  loadingPollInProgress.value = true;

  // First check if manager api is up
  if (loadingProgress.value <= 50) {
    loadingProgress.value = 50;

    try {
      await systemStore.getManagerApi();
      if (!systemStore.managerApi.operational) {
        loading.value = true;
        loadingPollInProgress.value = false;
        return;
      }
    } catch (error) {
      console.error(error);
      loading.value = true;
      loadingPollInProgress.value = false;
      return;
    }
  }

  // Now, check if there's a domain set, and if yes, redirect to it
  // Only redirect if on citadel.local, we can extend this in the future
  if (
    window.location.protocol !== 'https:' &&
    window.location.hostname === 'citadel.local' &&
    ENABLE_HTTPS
  ) {
    try {
      const domain = await sdkStore.citadel.system.domain();
      if (domain) {
        window.location.href = `https://${domain}`;
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Then trigger auth check
  if (loadingProgress.value <= 80 && userStore.jwt) {
    loadingProgress.value = 80;
    try {
      await userStore.refreshJWT();
    } catch (error) {
      // it will error if jwt has expired and automatically redirect the user to login page
      null;
    }
  }

  loadingProgress.value = 100;
  loadingPollInProgress.value = false;

  // Add slight delay so the progress bar makes
  // it to 100% before disappearing
  setTimeout(() => (loading.value = false), 700);
}
</script>

<style lang="scss">
@import '@/global-styles/design-system.scss';
</style>

<style lang="scss" scoped>
// Loading transitions

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.4s ease;
}
.loading-enter-from {
  opacity: 0;
  // filter: blur(70px);
}
.loading-enter-to {
  opacity: 1;
  // filter: blur(0);
}
.loading-leave {
  opacity: 1;
  // filter: blur(0);
}
.loading-leave-to {
  opacity: 0;
  // filter: blur(70px);
}

.system-alert {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
