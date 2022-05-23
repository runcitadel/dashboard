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
            <small
              >Please do not refresh this page or turn off your Citadel while
              the update is in progress</small
            >
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
            <small
              >Please do not refresh this page or turn off your Citadel while it
              is
              {{
                systemStore.shuttingDown ? 'shutting down' : 'rebooting'
              }}</small
            >
          </b-alert>
        </div>
      </shutdown>
      <loading v-else-if="loading" :progress="loadingProgress"> </loading>
      <!-- component matched by the route will render here -->
      <router-view v-else></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import useSystemStore from './store/system';
import useUserStore from './store/user';
import useUiStore from './store/ui';
import useToast from './utils/toast';
import delay from './helpers/delay';
import Shutdown from './components/Shutdown.vue';
import Loading from './components/Loading.vue';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    Loading,
    Shutdown,
  },
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    const uiStore = useUiStore();
    const toast = useToast();
    return {userStore, systemStore, uiStore, toast};
  },
  data() {
    return {
      isIframe: window.self !== window.top,
      loading: true,
      loadingProgress: 0,
      loadingPollInProgress: false,
      loadingInterval: undefined,
      updateStatusInterval: undefined,
    } as unknown as {
      isIframe: boolean;
      loading: boolean;
      loadingProgress: number;
      loadingPollInProgress: boolean;
      loadingInterval: number;
      updateStatusInterval: number;
    };
  },
  watch: {
    loading: {
      handler: function (isLoading) {
        window.clearInterval(this.loadingInterval);
        //if loading, check loading status every two seconds
        if (isLoading) {
          this.loadingInterval = window.setInterval(
            this.getLoadingStatus,
            2000,
          );
        } else {
          //else check every 20s
          this.loadingInterval = window.setInterval(
            this.getLoadingStatus,
            20000,
          );
        }
      },
      immediate: true,
    },
    updating: {
      handler: function (isUpdating, wasUpdating) {
        window.clearInterval(this.updateStatusInterval);
        // if updating, check loading status every two seconds
        if (isUpdating) {
          this.updateStatusInterval = window.setInterval(() => {
            this.systemStore.getUpdateStatus();
          }, 2 * 1000);
        } else {
          //else check every minute
          this.updateStatusInterval = window.setInterval(() => {
            this.systemStore.getUpdateStatus();
          }, 60 * 1000);

          // if it just finished updating, then show success/failure toast
          if (wasUpdating) {
            if (this.systemStore.updateStatus.state === 'failed') {
              this.toast.error(
                'Update failed',
                this.systemStore.updateStatus.description,
              );
            } else {
              this.systemStore.getAvailableUpdate();
            }

            this.toast.success(
              'Update successful',
              this.systemStore.updateStatus.description,
            );

            //refresh window to fetch latest code of dashboard
            delay(2000).then(() => {
              // @ts-expect-error The parameter to reload is non-standard, but supported in some browsers
              window.location.reload(true);
            });
          }
        }
      },
      immediate: true,
    },
  },
  created() {
    //check if system is updating
    this.systemStore.getUpdateStatus();

    //for 100vh consistency
    this.updateViewPortHeightCSS();
    window.addEventListener('resize', this.updateViewPortHeightCSS);
  },
  mounted() {
    const initTheme = this.getThemePreference();
    this.uiStore.setTheme(initTheme);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateViewPortHeightCSS);
    window.clearInterval(this.loadingInterval);
    window.clearInterval(this.updateStatusInterval);
  },
  methods: {
    getThemePreference() {
      const activeTheme = localStorage.getItem('user-theme');
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
    },
    //TODO: move this to the specific layout that needs this 100vh fix
    updateViewPortHeightCSS() {
      return document.documentElement.style.setProperty(
        '--vh100',
        `${window.innerHeight}px`,
      );
    },
    async getLoadingStatus() {
      // Skip if previous poll in progress or if system is updating
      if (
        this.loadingPollInProgress ||
        this.systemStore.updateStatus.state === 'installing'
      ) {
        return;
      }

      this.loadingPollInProgress = true;

      // First check if manager api is up
      if (this.loadingProgress <= 50) {
        this.loadingProgress = 50;

        try {
          await this.systemStore.getManagerApi();
          if (!this.systemStore.managerApi.operational) {
            this.loading = true;
            this.loadingPollInProgress = false;
            return;
          }
        } catch (error) {
          console.error(error);
          this.loading = true;
          this.loadingPollInProgress = false;
          return;
        }
      }

      // Then check if middleware api is up
      /*if (this.loadingProgress <= 40) {
        this.loadingProgress = 40;
        await this.$store.dispatch("system/getApi");
        if (!this.isApiOperational) {
          this.loading = true;
          this.loadingPollInProgress = false;
          return;
        }
      }*/

      // Then trigger auth check
      if (this.loadingProgress <= 95 && this.userStore.jwt) {
        this.loadingProgress = 95;
        try {
          await this.userStore.refreshJWT();
        } catch (error) {
          // it will error if jwt has expired and automatically redirect the user to login page
          null;
        }
      }

      this.loadingProgress = 100;
      this.loadingPollInProgress = false;

      // Add slight delay so the progress bar makes
      // it to 100% before disappearing
      setTimeout(() => (this.loading = false), 300);
    },
  },
});
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
