<template>
  <div>
    <b-navbar type="light" class="nav-horizontal py-1">
      <b-navbar-brand to="/dashboard">
        <img src="@/assets/logo.svg" alt="Citadel" height="50" />
      </b-navbar-brand>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ms-auto">
        <!-- Chain badge -->
        <b-badge
          v-if="bitcoinStore.chain !== 'main'"
          variant="success"
          class="align-self-center me-2 text-capitalize"
          pill
          >{{
            bitcoinStore.chain === 'test' ? 'testnet' : bitcoinStore.chain
          }}</b-badge
        >

        <div
          class="toggle-theme-icon d-flex align-items-center"
          @click="toggleTheme"
        >
          <div v-if="uiStore.userTheme === 'light'" class="icon-24px">
            <MoonIcon />
          </div>
          <div v-if="uiStore.userTheme === 'dark'" class="icon-24px">
            <SunIcon />
          </div>
        </div>

        <div
          class="nav-hamburger-icon d-lg-none d-xl-none ms-3"
          :class="{active: uiStore.isMobileMenuOpen}"
          @click="toggleMobileMenu"
        >
          <div></div>
        </div>

        <b-nav-item-dropdown
          class="d-none d-lg-block d-xl-block ms-2"
          right
          no-caret
        >
          <!-- Using 'button-content' slot -->
          <template #button-content>{{
            userStore.name.split(' ')[0]
          }}</template>
          <b-dropdown-item @click="logout">Log out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>

    <!-- Mobile menu -->
    <transition name="mobile-vertical-menu">
      <div
        v-if="uiStore.isMobileMenuOpen"
        class="mobile-vertical-menu d-lg-none d-xl-none"
      >
        <authenticated-vertical-navbar :is-mobile-menu="true" />
      </div>
    </transition>

    <transition name="mobile-vertical-menu-fader">
      <div
        v-if="uiStore.isMobileMenuOpen"
        class="mobile-vertical-menu-fader d-lg-none d-xl-none"
        @click="toggleMobileMenu"
      ></div>
    </transition>

    <b-row class="mx-0">
      <b-col
        col
        lg="3"
        xl="2"
        class="d-none d-lg-block d-xl-block ps-0 pe-0 pe-xl-2"
      >
        <authenticated-vertical-navbar />
      </b-col>

      <b-col col lg="9" xl="10">
        <b-modal
          v-if="systemStore.availableUpdate.version"
          id="confirm-update-modal"
          v-model="systemStore.showUpdateConfirmationModal"
          size="lg"
          centered
          hide-footer
        >
          <template #modal-header>
            <div class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100">
              <h3>{{ systemStore.availableUpdate.name }}</h3>
              <!-- Emulate built in modal header close button action -->
              <a
                href="#"
                class="align-self-center"
                @click.stop.prevent="hideUpdateConfirmationModal"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.6003 4.44197C13.3562 4.19789 12.9605 4.19789 12.7164 4.44197L9.02116 8.1372L5.32596 4.442C5.08188 4.19792 4.68615 4.19792 4.44207 4.442C4.198 4.68607 4.198 5.0818 4.44207 5.32588L8.13728 9.02109L4.44185 12.7165C4.19777 12.9606 4.19777 13.3563 4.44185 13.6004C4.68592 13.8445 5.08165 13.8445 5.32573 13.6004L9.02116 9.90497L12.7166 13.6004C12.9607 13.8445 13.3564 13.8445 13.6005 13.6004C13.8446 13.3563 13.8446 12.9606 13.6005 12.7165L9.90505 9.02109L13.6003 5.32585C13.8444 5.08178 13.8444 4.68605 13.6003 4.44197Z"
                    fill="#6c757d"
                  />
                </svg>
              </a>
            </div>
          </template>
          <div class="px-2 px-sm-3 pb-2 pb-sm-3">
            <div class>
              <p v-if="systemStore.availableUpdate.notes" class="text-newlines">
                {{ systemStore.availableUpdate.notes }}
              </p>
              <b-button
                block
                variant="success"
                :disabled="isUpdating"
                @click="startUpdate"
                >{{
                  isUpdating ? 'Starting update...' : 'Install now'
                }}</b-button
              >
            </div>
          </div>
        </b-modal>
        <div class="pe-xl-2 content-container">
          <b-alert
            :show="!!systemStore.availableUpdate.version"
            class="mt-4 mb-0 d-flex"
            variant="success"
            dismissible
          >
            <div class="d-flex align-items-center mb-0">
              <div class="icon-24px"><BellIcon /></div>
              <a
                :href="`https://github.com/runcitadel/core/releases/tag/v${systemStore.availableUpdate.version}`"
                target="_blank"
                class="alert-link"
                >{{ systemStore.availableUpdate.name }}</a
              >
              &nbsp;is now available to install.
            </div>
            <b-button
              v-show="!isUpdating"
              variant="primary"
              size="sm"
              :disabled="isUpdating"
              class="ms-auto"
              @click.prevent="confirmUpdate"
              >Install now</b-button
            >
            <div v-if="isUpdating" class="d-flex align-items-center">
              <b-spinner class="me-1" variant="success" small></b-spinner>
              Installing...
            </div>
          </b-alert>
          <b-alert
            v-if="isRunningLowOnRam"
            class="mt-4 mb-0"
            variant="warning"
            show
            dismissible
          >
            <b-icon-exclamation-circle class="me-2" />
            <b>Low RAM:</b> Your Citadel is running low on RAM. Consider
            uninstalling some apps or upgrading your Citadel's hardware.
            <router-link to="/settings#ram" class="alert-link float-right"
              >View usage</router-link
            >
          </b-alert>
          <b-alert
            v-if="isRunningLowOnStorage"
            class="mt-4 mb-0"
            variant="warning"
            show
            dismissible
          >
            <b-icon-exclamation-circle class="me-2" />
            <b>Low storage:</b> Your Citadel only has
            {{
              readableSize(systemStore.storage.total - systemStore.storage.used)
            }}
            of storage left. Consider uninstalling some apps or upgrading to a
            larger drive.
            <router-link to="/settings#storage" class="alert-link float-right"
              >View usage</router-link
            >
          </b-alert>
          <b-alert
            v-if="systemStore.isCitadelOS && isRunningHot"
            class="mt-4 mb-0"
            variant="warning"
            show
            dismissible
          >
            <b-icon-exclamation-circle class="me-2" />
            <b>High temperature:</b> Your Raspberry Pi is running hot. Consider
            using a heatsink, fan or a cooling case.
          </b-alert>
          <router-view v-slot="{Component}">
            <transition name="change-page" mode="out-in">
              <Suspense>
                <component :is="Component" />
                <template #fallback
                  ><div>
                    <h1
                      class="loading-placeholder loading-placeholder-lg w-25 mt-4"
                    ></h1>
                    <p
                      class="loading-placeholder loading-placeholder-sm w-50 d-block mt-2"
                    ></p></div
                ></template>
              </Suspense>
            </transition>
          </router-view>
        </div>

        <!-- Footer -->
        <footer class="d-flex justify-content-end text-muted pe-sm-2 pe-xl-3">
          <p>
            <small> Powered by Citadel </small>
          </p>
        </footer>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import useSystemStore from '../store/system';
import useUserStore from '../store/user';
import useUiStore from '../store/ui';
import useBitcoinStore from '../store/bitcoin';
import useLightningStore from '../store/lightning';
import useAppsStore from '../store/apps';

import {readableSize} from '../helpers/size';
import useToast from '../utils/toast';
import AuthenticatedVerticalNavbar from '../components/AuthenticatedVerticalNavbar.vue';

import {
  BellIcon,
  SunIcon,
  MoonIcon,
  // @ts-expect-error No type definitions for this yet
} from '@bitcoin-design/bitcoin-icons-vue/filled/esm/index.js';
import {BIconExclamationCircle} from 'bootstrap-icons-vue';
import {defineComponent} from 'vue';

export default defineComponent({
  components: {
    AuthenticatedVerticalNavbar,
    BellIcon,
    SunIcon,
    MoonIcon,
    BIconExclamationCircle,
  },
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    const uiStore = useUiStore();
    const bitcoinStore = useBitcoinStore();
    const lightningStore = useLightningStore();
    const appsStore = useAppsStore();
    const toast = useToast();
    return {
      appsStore,
      userStore,
      uiStore,
      systemStore,
      bitcoinStore,
      lightningStore,
      toast,
    };
  },
  data() {
    return {
      isUpdating: false,
      interval: undefined,
      otherInterval: undefined,
      pollUpdateStatus: undefined,
    } as {
      isUpdating: boolean;
      interval: number | undefined;
      otherInterval: number | undefined;
      pollUpdateStatus: number | undefined;
    };
  },
  computed: {
    isRunningLowOnRam(): boolean {
      // over 95% RAM used
      if (this.systemStore.ram && this.systemStore.ram.total) {
        return this.systemStore.ram.used / this.systemStore.ram.total > 0.95;
      }
      return false;
    },
    isRunningLowOnStorage(): boolean {
      // less than 1GB remaining
      if (this.systemStore.storage && this.systemStore.storage.total) {
        return (
          this.systemStore.storage.total - this.systemStore.storage.used <
          1000000000
        );
      }
      return false;
    },
    isRunningHot(): boolean {
      // over 80'C
      if (this.systemStore.cpuTemperature) {
        return this.systemStore.cpuTemperature > 80;
      }
      return false;
    },
  },
  created() {
    //load this data once:
    this.userStore.getInfo();
    this.systemStore.getIsCitadelOS();
    // Preload this so when the user switches to th Lightning page, it can be displayed immediately
    this.lightningStore.getVersionInfo();
    if (
      window.localStorage &&
      window.localStorage.getItem('lightmode') === 'true'
    ) {
      document.querySelector(':root')?.classList?.add('prefer-light-mode');
    }

    //refresh this data every 20s:
    this.fetchData();
    this.interval = window.setInterval(this.fetchData, 20000);
    // This data is't changing as much and fetching it every 5 minutes is enough
    this.fetchLessChangingData();
    this.otherInterval = window.setInterval(
      this.fetchLessChangingData,
      60 * 5 * 1000,
    );
  },
  beforeUnmount() {
    window.clearInterval(this.interval);
    window.clearInterval(this.otherInterval);
    if (this.pollUpdateStatus) {
      window.clearInterval(this.pollUpdateStatus);
    }
  },
  methods: {
    toggleTheme() {
      const theme = this.uiStore.userTheme === 'light' ? 'dark' : 'light';
      this.uiStore.setTheme(theme);
    },
    logout() {
      //close mobile menu
      if (this.uiStore.isMobileMenuOpen) {
        this.toggleMobileMenu();
      }
      this.userStore.logout();
    },
    fetchData() {
      this.systemStore.getUnit();
      this.bitcoinStore.getSync();
      this.bitcoinStore.getBalance();
      this.bitcoinStore.getTransactions();
      this.lightningStore.getSync();
      this.lightningStore.getTransactions();
    },
    fetchLessChangingData() {
      this.lightningStore.getChannels();
      this.bitcoinStore.getPrice();
      this.systemStore.getAvailableUpdate();
      this.systemStore.getRam();
      this.systemStore.getStorage();
      this.systemStore.getCpuTemperature();
    },
    toggleMobileMenu() {
      this.uiStore.isMobileMenuOpen = !this.uiStore.isMobileMenuOpen;
    },
    hideUpdateConfirmationModal() {
      this.systemStore.hideUpdateConfirmationModal();
    },
    confirmUpdate() {
      this.systemStore.confirmUpdate();
    },
    async startUpdate() {
      try {
        await this.systemStore.startUpdate();
        this.isUpdating = true;
        // poll update status every 2s until the update process begins
        // because after it's updated, the loading view will take over
        this.pollUpdateStatus = window.setInterval(async () => {
          await this.systemStore.getUpdateStatus();
          if (this.systemStore.updateStatus.state === 'installing') {
            window.clearInterval(this.pollUpdateStatus);
          }
        }, 2 * 1000);
      } catch (error) {
        this.toast.error('Error', 'Unable to start the update process');
      }
    },
    readableSize(n: number) {
      return readableSize(n);
    },
  },
});
</script>

<style lang="scss" scoped>
html[data-bs-theme='dark'] {
  .nav-horizontal {
    background: #2a3244 !important;
  }
  .mobile-vertical-menu {
    background: #2a3244 !important;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.4);
  }
}

.nav-horizontal {
  background: #fff;
  position: sticky;
  z-index: 9;
}

.nav-horizontal {
  top: 0;
}

.content-container {
  min-height: calc(100vh - 150px);
}

/*
.input-search-form {
  form {
    position: relative;
  }
  .input-search {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    width: calc(100vw - 200px);
    max-width: 600px;
    font-size: 1rem;
    margin-left: 1rem;
  }
  .input-search-icon {
    content: url("~@/assets/icon-search.svg");
    position: absolute;
    top: calc(50% - 0.625rem);
    left: -0.25rem;
    height: 1.25rem;
    width: auto;
  }
}*/

::placeholder {
  color: #c3c6d1;
}

.toggle-theme-icon {
  cursor: pointer;
}

.nav-hamburger-icon {
  width: 24px;
  cursor: pointer;
  &:before,
  &:after,
  div {
    background-color: #c3c6d1;
    border-radius: 3px;
    content: '';
    display: block;
    height: 4px;
    width: 100%;
    margin: 5px 0;
    transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  div {
    width: 20px;
    margin-left: 4px;
  }
  &.active {
    &:before {
      transform: translateY(9px) rotate(135deg);
    }
    &:after {
      transform: translateY(-9px) rotate(-135deg);
    }
    div {
      transform: scale(0);
    }
  }
}

.mobile-vertical-menu {
  position: fixed;
  z-index: 9;
  top: 84px;
  right: 0;
  width: 80vw;
  max-width: 280px;
  height: calc(var(--vh100, 100vh) - 84px);
  background: #fff;
  box-shadow: var(--card-shadow);
  transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
}

.mobile-vertical-menu-enter-from {
  // opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.mobile-vertical-menu-enter-to {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
.mobile-vertical-menu-leave {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
.mobile-vertical-menu-leave-to {
  // opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.mobile-vertical-menu-fader {
  position: fixed;
  height: var(--vh100, 100vh);
  width: 100vw;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 8;
  opacity: 0.1;
  transition: opacity 0.6s ease-in-out;
}

.mobile-vertical-menu-fader-enter-from {
  opacity: 0;
}
.mobile-vertical-menu-fader-enter-to {
  opacity: 0.1;
}
.mobile-vertical-menu-fader-leave {
  opacity: 0.1;
}
.mobile-vertical-menu-fader-leave-to {
  opacity: 0;
}

// Page changing transitions
.change-page-enter-active,
.change-page-leave-active {
  transition: transform 0.4s, opacity 0.4s ease;
}
.change-page-enter-from {
  transform: translate3d(-40px, 0, 0);
  opacity: 0;
}
.change-page-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.change-page-leave {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.change-page-leave-to {
  transform: translate3d(40px, 0, 0);
  opacity: 0;
}
</style>
