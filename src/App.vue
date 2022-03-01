<template>
  <div id="app">
    <transition name="loading" mode>
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
      <loading v-else-if="updating" :progress="updateStatus.progress">
        <div class="text-center">
          <small class="text-muted d-block">{{
            `${updateStatus.description}...`
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
        v-else-if="hasShutdown || shuttingDown || rebooting"
        :has-shutdown="hasShutdown"
        :shutting-down="shuttingDown"
        :rebooting="rebooting"
      >
        <div v-if="shuttingDown || rebooting" class="text-center">
          <b-alert class="system-alert" variant="warning" show>
            <small
              >Please do not refresh this page or turn off your Citadel while it
              is {{ shuttingDown ? "shutting down" : "rebooting" }}</small
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

<script>
import { mapState } from "vuex";
import delay from "@/helpers/delay.ts";
import Shutdown from "@/components/Shutdown.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "App",
  components: {
    Loading,
    Shutdown,
  },
  data() {
    return {
      isIframe: window.self !== window.top,
      loading: true,
      loadingProgress: 0,
      loadingPollInProgress: false,
    };
  },
  computed: {
    ...mapState({
      hasShutdown: (state) => state.system.hasShutdown,
      shuttingDown: (state) => state.system.shuttingDown,
      rebooting: (state) => state.system.rebooting,
      isManagerApiOperational: (state) => state.system.managerApi.operational,
      isApiOperational: (state) => state.system.api.operational,
      jwt: (state) => state.user.jwt,
      updateStatus: (state) => state.system.updateStatus,
    }),
    updating() {
      return this.updateStatus.state === "installing";
    },
  },
  watch: {
    loading: {
      handler: function (isLoading) {
        window.clearInterval(this.loadingInterval);
        //if loading, check loading status every two seconds
        if (isLoading) {
          this.loadingInterval = window.setInterval(
            this.getLoadingStatus,
            2000
          );
        } else {
          //else check every 20s
          this.loadingInterval = window.setInterval(
            this.getLoadingStatus,
            20000
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
            this.$store.dispatch("system/getUpdateStatus");
          }, 2 * 1000);
        } else {
          //else check every minute
          this.updateStatusInterval = window.setInterval(() => {
            this.$store.dispatch("system/getUpdateStatus");
          }, 60 * 1000);

          // if it just finished updating, then show success/failure toast
          if (wasUpdating) {
            const toastOptions = {
              title: "Update successful",
              autoHideDelay: 2000,
              variant: "success",
              solid: true,
              toaster: "b-toaster-bottom-right",
            };

            if (this.updateStatus.state === "failed") {
              toastOptions.title = "Update failed";
              toastOptions.variant = "danger";
            } else {
              this.$store.dispatch("system/getAvailableUpdate");
            }

            this.$bvToast.toast(this.updateStatus.description, toastOptions);

            //refresh window to fetch latest code of dashboard
            delay(2000).then(() => {
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
    this.$store.dispatch("system/getUpdateStatus");

    //for 100vh consistency
    this.updateViewPortHeightCSS();
    window.addEventListener("resize", this.updateViewPortHeightCSS);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateViewPortHeightCSS);
    window.clearInterval(this.loadingInterval);
    window.clearInterval(this.updateStatusInterval);
  },
  methods: {
    //TODO: move this to the specific layout that needs this 100vh fix
    updateViewPortHeightCSS() {
      return document.documentElement.style.setProperty(
        "--vh100",
        `${window.innerHeight}px`
      );
    },
    async getLoadingStatus() {
      // Skip if previous poll in progress or if system is updating
      if (this.loadingPollInProgress || this.updating) {
        return;
      }

      this.loadingPollInProgress = true;

      // First check if manager api is up
      if (this.loadingProgress <= 50) {
        this.loadingProgress = 50;
        await this.$store.dispatch("system/getManagerApi");
        if (!this.isManagerApiOperational) {
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
      if (this.loadingProgress <= 95 && this.jwt) {
        this.loadingProgress = 95;
        try {
          await this.$store.dispatch("user/refreshJWT");
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
};
</script>

<style lang="scss">
@import "@/global-styles/design-system.scss";
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
