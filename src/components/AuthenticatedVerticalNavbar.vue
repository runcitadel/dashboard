<template>
  <div class="nav-vertical d-flex flex-column justify-content-between">
    <div>
      <div class="balance-container w-100 px-3 pt-4 pb-3 mb-3">
        <p class="text-muted">
          Balance
          <span style="cursor: pointer" @click="toggleBalance">
            <HiddenIcon v-if="state.showBalance" />
            <VisibleIcon v-else />
          </span>
        </p>

        <span v-if="state.showBalance">
          <div v-if="balanceLoaded">
            <h3 class="mb-1">
              <CountUp
                :value="{
                  endVal: walletBalance,
                  decimalPlaces: unit === 'sats' ? 0 : 5,
                }"
              />
            </h3>
            <small class="text-muted"
              >~ {{ $filters.satsToUSD(btcBalance + lightningBalance) }}</small
            >
          </div>
          <span
            v-else
            class="loading-placeholder loading-placeholder-lg w-75"
          ></span>
        </span>
        <h3 v-else>***,***</h3>
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
          <WalletIcon class="me-2" style="width: 24px; height: 24px" />
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
          @click="logout"
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="me-2"
          >
            <path
              d="M19.3845 9.97438H18.6201C18.49 9.54789 18.3187 9.14032 18.1115 8.75306L18.6543 8.21071C19.2839 7.5802 19.2848 6.55735 18.6543 5.92638L18.0736 5.34572C17.7708 5.04293 17.3591 4.87261 16.9308 4.87261C16.5015 4.87261 16.0916 5.04293 15.7874 5.34572L15.2446 5.88807C14.8578 5.68221 14.4503 5.51096 14.0238 5.37941V4.61551C14.0238 3.72282 13.3009 3 12.4083 3H11.5876C10.6949 3 9.97207 3.72282 9.97207 4.61551V5.37941C9.54604 5.50958 9.13801 5.68082 8.75121 5.88807L8.20932 5.34572C7.57835 4.71475 6.55504 4.71475 5.92407 5.34572L5.34526 5.92592C4.71429 6.55643 4.71429 7.57974 5.34526 8.21025L5.88715 8.7526C5.68128 9.14032 5.50958 9.54789 5.37849 9.97392H4.61551C3.72282 9.97392 3 10.6967 3 11.5894V12.4101C3 13.3019 3.72282 14.0256 4.61551 14.0256H5.37895C5.50958 14.4512 5.68082 14.8597 5.88761 15.2465L5.34526 15.7893C4.71475 16.4193 4.71475 17.4426 5.3448 18.0736L5.92546 18.6543C6.22825 18.9562 6.63951 19.1265 7.06785 19.1265H7.06831C7.49712 19.1265 7.90745 18.9562 8.21071 18.6543L8.75352 18.1115C9.13986 18.3178 9.54835 18.489 9.97392 18.6201V19.3845C9.97392 20.2763 10.6967 21 11.5894 21H12.4101C13.3028 21 14.0256 20.2763 14.0256 19.3845V18.6201C14.4521 18.4895 14.8597 18.3183 15.2465 18.1115L15.7898 18.6543C16.0921 18.9571 16.5038 19.1265 16.9326 19.1265C17.3619 19.1265 17.7713 18.9562 18.0759 18.6543L18.6557 18.0736C19.2862 17.4426 19.2857 16.4203 18.6557 15.7893L18.1129 15.2474C18.3192 14.8597 18.4904 14.4512 18.6215 14.0261H19.3859C20.2786 14.0261 21.0014 13.3023 21.0014 12.4106V11.5904C21 10.6981 20.2767 9.97438 19.3845 9.97438ZM12.0002 15.6924C9.96469 15.6924 8.30764 14.0362 8.30764 11.9998C8.30764 9.96377 9.96469 8.30718 12.0002 8.30718C14.0367 8.30718 15.6928 9.96377 15.6928 11.9998C15.6928 14.0362 14.0367 15.6924 12.0002 15.6924Z"
              fill="#C3C6D1"
            />
          </svg>
          Settings
        </b-nav-item>
      </b-nav>
    </div>
    <!-- Preload all app icons to cache them locally  -->
    <div class="d-none">
      <img
        v-for="app in appStore"
        :key="app.id"
        :src="`https://runcitadel.github.io/old-apps-gallery/${app.id}/icon.svg`"
        class="d-none"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { satsToBtc } from "@/helpers/units.js";
import CountUp from "@/components/Utility/CountUp";
import SatsBtcSwitch from "@/components/Utility/SatsBtcSwitch";

import {
  BitcoinIcon,
  GearIcon,
  LightningIcon,
  ShareIcon,
  GridIcon,
  HomeIcon,
  CartIcon,
  WalletIcon,
  VisibleIcon,
  HiddenIcon,
} from "@bitcoin-design/bitcoin-icons-vue/filled";

export default {
  components: {
    CountUp,
    SatsBtcSwitch,
    BitcoinIcon,
    GearIcon,
    LightningIcon,
    ShareIcon,
    GridIcon,
    HomeIcon,
    CartIcon,
    WalletIcon,
    VisibleIcon,
    HiddenIcon,
  },
  props: {
    isMobileMenu: Boolean,
  },
  data() {
    return {
      state: {
        showBalance: true,
      },
    };
  },
  computed: {
    ...mapState({
      btcBalance: (state) => state.bitcoin.balance.total,
      lightningBalance: (state) => state.lightning.balance.total,
      unit: (state) => state.system.unit,
      appStore: (state) => state.apps.store,
    }),
    walletBalance() {
      return this.unit === "sats"
        ? this.btcBalance + this.lightningBalance
        : satsToBtc(this.btcBalance + this.lightningBalance);
    },
    balanceLoaded() {
      return this.btcBalance >= 0 && this.lightningBalance >= 0;
    },
  },
  created() {
    this.$store.dispatch("apps/getInstalledApps");
    this.$store.dispatch("apps/getAppStore");
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
    },
    toggleBalance() {
      return (this.state.showBalance = !this.state.showBalance);
    },
  },
};
</script>

<style lang="scss" scoped>
@media (prefers-color-scheme: dark) {
  :root:not(.prefer-light-mode) {
    .nav-vertical {
      background: transparent !important;
      .nav-item {
        .nav-link {
          color: #dde2ee !important;
          svg {
            path,
            rect {
              fill: #dde2ee !important;
            }
          }
          &:hover,
          &:active,
          &:focus {
            color: #dde2ee !important;
          }
          &.active {
            opacity: 1 !important;
            color: #5351fb !important;
            svg {
              path,
              rect {
                fill: #5351fb !important;
              }
            }
          }
        }
      }
    }
  }
}
.nav-vertical {
  position: sticky;
  background: #fff;
  z-index: 9;
  // width: 280px;
  height: calc(var(--vh100, 100vh) - 82px);
  top: 82px;
  overflow-y: auto;
  .nav-item {
    .nav-link {
      color: #141821;
      opacity: 0.5;
      transition: opacity 0.2s ease;
      svg {
        path,
        rect {
          fill: #141821;
        }
      }
      &:hover,
      &:active,
      &:focus {
        color: #141821;
        opacity: 0.9;
      }
      &.active {
        opacity: 1;
        color: #5351fb;
        svg {
          path,
          rect {
            fill: #5351fb;
          }
        }
      }
    }
  }
}
/*
.balance-container {
  border-top: solid 1px #eeeff3;
  border-bottom: solid 1px #eeeff3;
}*/
</style>
