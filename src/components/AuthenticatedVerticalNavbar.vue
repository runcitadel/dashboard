<template>
  <div class="nav-vertical d-flex flex-column justify-content-between">
    <div>
      <div class="balance-container w-100 px-3 pt-4 pb-3 mb-3">
        <p class="text-muted">
          Balance
          <span
            class="icon-container"
            style="cursor: pointer"
            @click="uiStore.toggleBalance"
          >
            <HiddenIcon
              v-if="uiStore.showBalance"
              style="width: 24px; height: 24px"
            />
            <VisibleIcon v-else style="width: 24px; height: 24px" />
          </span>
        </p>

        <span v-if="uiStore.showBalance">
          <div v-if="balanceLoaded">
            <h3 class="mb-1">
              <CountUp
                :value="{
                  endVal: walletBalance,
                  decimalPlaces: systemStore.unit === 'sats' ? 0 : 5,
                }"
              />
            </h3>
            <small class="text-muted"
              >~
              {{
                satsToUSD(btcBalance + lightningBalance)
              }}</small
            >
          </div>
          <span
            v-else
            class="loading-placeholder loading-placeholder-lg w-75"
          ></span>
        </span>
        <div v-else>
          <h3>***,***</h3>
          <small class="text-muted">~ $***</small>
        </div>
        <sats-btc-switch class="mt-3" size="md"></sats-btc-switch>
      </div>
      <!-- <div class="py-2"></div> -->
      <b-nav vertical class="px-1">
        <b-nav-item to="/dashboard" class="my-1" active-class="active">
          <HomeIcon class="me-2" style="width: 24px; height: 24px" />
          Home
        </b-nav-item>
        <b-nav-item to="/bitcoin" class="my-1" active-class="active">
          <BitcoinIcon class="me-2" style="width: 24px; height: 24px" />
          Bitcoin
        </b-nav-item>
        <b-nav-item to="/lightning" class="my-1" active-class="active">
          <LightningIcon class="me-2" style="width: 24px; height: 24px" />
          Lightning
        </b-nav-item>

        <b-nav-item to="/lightning-address" class="my-1" active-class="active">
          <ShareIcon class="me-2" style="width: 24px; height: 24px" />
          Lightning Address
        </b-nav-item>

        <b-nav-item to="/connect" class="my-1" exact-active-class="active">
          <SharedWalletIcon class="me-2" style="width: 24px; height: 24px" />
          Connect Wallet
        </b-nav-item>

        <b-nav-item to="/apps" class="my-1" active-class="active">
          <GridIcon class="me-2" style="width: 24px; height: 24px" />
          Apps
        </b-nav-item>

        <b-nav-item to="/app-store" class="my-1" active-class="active">
          <CartIcon class="me-2" style="width: 24px; height: 24px" />
          App Store
        </b-nav-item>

        <b-nav-item to="/donate" class="my-1" active-class="active">
          <ContactsIcon class="me-2" style="width: 24px; height: 24px" />
          Donate
        </b-nav-item>

        <b-nav-item
          v-if="isMobileMenu"
          to="/settings"
          class="my-1"
          active-class="active"
        >
          <GearIcon class="me-2" style="width: 24px; height: 24px" />
          Settings
        </b-nav-item>
      </b-nav>
    </div>
    <div>
      <b-nav vertical class="px-1">
        <b-nav-item
          v-if="isMobileMenu"
          class="my-1"
          active-class="active"
          @click="userStore.logout"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="me-2"
          >
            <path
              d="M15.2499 12.7499C14.8352 12.7499 14.4999 13.0859 14.4999 13.4998V16.4999C14.4999 16.9131 14.1639 17.2498 13.7499 17.2498H11.4999V5.99993C11.4999 5.35943 11.0919 4.78719 10.4784 4.57419L10.2564 4.4999H13.7499C14.1639 4.4999 14.4999 4.83662 14.4999 5.24998V7.49996C14.4999 7.91387 14.8352 8.24991 15.2499 8.24991C15.6646 8.24991 15.9998 7.91387 15.9998 7.49996V5.24998C15.9998 4.0095 14.9903 3 13.7499 3H5.68748C5.65892 3 5.63502 3.01277 5.60728 3.01648C5.57117 3.01346 5.5367 3 5.50003 3C4.67277 3 4 3.67263 4 4.4999V17.9998C4 18.6403 4.408 19.2125 5.02144 19.4255L9.53499 20.9301C9.68797 20.9773 9.84013 20.9998 9.99998 20.9998C10.8272 20.9998 11.4999 20.3271 11.4999 19.4998V18.7499H13.7499C14.9903 18.7499 15.9998 17.7404 15.9998 16.4999V13.4998C15.9998 13.0859 15.6646 12.7499 15.2499 12.7499V12.7499Z"
              fill="#C3C6D1"
            />
            <path
              d="M21.7802 9.96963L18.7802 6.96971C18.5658 6.7552 18.2432 6.69066 17.9628 6.80684C17.6831 6.92315 17.5 7.19685 17.5 7.49993V9.74991H14.5001C14.086 9.74991 13.75 10.0858 13.75 10.4999C13.75 10.9139 14.086 11.2498 14.5001 11.2498H17.5V13.4998C17.5 13.8029 17.6831 14.0766 17.9628 14.1929C18.2432 14.309 18.5658 14.2445 18.7802 14.0301L21.7802 11.0301C22.0734 10.7369 22.0734 10.2628 21.7802 9.96963V9.96963Z"
              fill="#C3C6D1"
            />
          </svg>
          Log out
        </b-nav-item>
        <b-nav-item v-else to="/settings" class="my-1" active-class="active">
          <GearIcon class="me-2" style="width: 24px; height: 24px" />
          Settings
        </b-nav-item>
      </b-nav>
    </div>
    <!-- Preload all app icons to cache them locally  -->
    <div class="d-none">
      <img
        v-for="app in appsStore.store"
        :key="app.id"
        :src="`https://runcitadel.github.io/old-apps-gallery/${app.id}/icon.svg`"
        class="d-none"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {satsToBtc} from '../helpers/units';
import {satsToUSD} from '../helpers/filters';
import CountUp from './Utility/CountUp.vue';
import SatsBtcSwitch from './Utility/SatsBtcSwitch.vue';
import useSystemStore from '../store/system';
import useUserStore from '../store/user';
import useBitcoinStore from '../store/bitcoin';
import useLightningStore from '../store/lightning';
import useAppsStore from '../store/apps';
import useUiStore from '../store/ui';

import {
  BitcoinIcon,
  GearIcon,
  LightningIcon,
  ShareIcon,
  GridIcon,
  HomeIcon,
  CartIcon,
  SharedWalletIcon,
  VisibleIcon,
  HiddenIcon,
  ContactsIcon,
  // @ts-expect-error No type definitions for this yet
} from '@bitcoin-design/bitcoin-icons-vue/filled/esm/index.js';
import {computed} from 'vue';

defineProps({
  isMobileMenu: Boolean,
});
const systemStore = useSystemStore();
const userStore = useUserStore();
const bitcoinStore = useBitcoinStore();
const lightningStore = useLightningStore();
const appsStore = useAppsStore();
const uiStore = useUiStore();
appsStore.getInstalledApps();
appsStore.getAppStore();

const btcBalance = computed(() => {
  return bitcoinStore.balance.total;
});
const lightningBalance = computed(() => {
  return lightningStore.balance.total;
});
const walletBalance = computed(() => {
  return systemStore.unit === 'sats'
    ? btcBalance.value + lightningBalance.value
    : satsToBtc(btcBalance.value + lightningBalance.value);
});
const balanceLoaded = computed(() => {
  return btcBalance.value >= 0 && lightningBalance.value >= 0;
});
</script>
