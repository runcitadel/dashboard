<template>
  <div class="p-sm-2">
    <div class="my-3 pb-2">
      <h1 class="text-lowercase">
        {{ greeting
        }}{{ userStore.name ? `, ${userStore.name.split(' ')[0]}` : '' }}
      </h1>
      <p class="text-muted">Here's an overview of your Citadel</p>
    </div>
    <b-row>
      <b-col col cols="12" md="6" xl="4">
        <lightning-wallet></lightning-wallet>
      </b-col>
      <b-col col cols="12" md="6" xl="4">
        <card-widget
          header="Bitcoin Core"
          :status="{
            text: bitcoinStore.percent < 100 ? 'Synchronizing' : 'Running',
            variant: 'success',
            blink: false,
          }"
          sub-title="Synchronized"
          icon="icon-app-bitcoin.svg"
          :loading="
            lightningStore.percent < 100 || bitcoinStore.blocks.length === 0
          "
        >
          <template #title>
            <CountUp
              v-if="bitcoinStore.percent !== -1"
              :value="{
                endVal:
                  bitcoinStore.percent >= 99.99 ? 100 : bitcoinStore.percent,
                decimalPlaces: bitcoinStore.percent >= 99.99 ? 0 : 2,
              }"
              suffix="%"
            />
            <span
              v-else
              class="loading-placeholder loading-placeholder-lg"
              style="width: 140px"
            ></span>
          </template>
          <div class>
            <div class="d-flex w-100 justify-content-between px-3 px-lg-4">
              <p class="mb-1">Connected Peers</p>
              <p>
                {{ bitcoinStore.stats.peers }}
              </p>
            </div>
            <blockchain></blockchain>
            <div class="px-3 px-lg-4 py-3">
              <router-link to="/bitcoin" class="card-link">Manage</router-link>
            </div>
          </div>
        </card-widget>
      </b-col>
      <b-col col cols="12" xl="4">
        <b-row>
          <b-col col cols="12" md="6" xl="12">
            <card-widget
              header="Bitcoin Wallet"
              :status="{
                text: lightningStore.percent < 100 ? 'Synchronizing' : 'Active',
                variant: 'success',
                blink: false,
              }"
              :sub-title="$filters.formatUnit(systemStore.unit)"
              icon="icon-app-bitcoin.svg"
              :loading="lightningStore.percent < 100"
            >
              <template #title>
                <div
                  v-if="btcBalance !== -1 && uiStore.showBalance"
                  v-b-tooltip.hover.right
                  :title="
                    $filters
                      .satsToUSD(bitcoinStore.balance.total, bitcoinStore)
                      .toString()
                  "
                >
                  <CountUp
                    :value="{
                      endVal: btcBalance,
                      decimalPlaces: systemStore.unit === 'sats' ? 0 : 5,
                    }"
                  />
                </div>
                <div v-else-if="!uiStore.showBalance">
                  <span class="d-flex"> ***,*** </span>
                </div>

                <span
                  v-else
                  class="loading-placeholder loading-placeholder-lg"
                  style="width: 140px"
                ></span>
              </template>
              <div class="px-3 px-lg-4 pt-2 pb-3">
                <router-link to="/bitcoin" class="card-link"
                  >Manage</router-link
                >
              </div>
            </card-widget>
          </b-col>
          <b-col col cols="12" md="6" xl="12">
            <storage-widget></storage-widget>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import useSystemStore from '../store/system';
import useUserStore from '../store/user';
import useBitcoinStore from '../store/bitcoin';
import useLightningStore from '../store/lightning';
import useUiStore from '../store/ui';

import {defineComponent} from 'vue';
import {satsToBtc} from '../helpers/units';

import CountUp from '../components/Utility/CountUp.vue';
import CardWidget from '../components/CardWidget.vue';
import Blockchain from '../components/Blockchain.vue';
import LightningWallet from '../components/LightningWallet.vue';
import StorageWidget from '../components/Widgets/StorageWidget.vue';

export default defineComponent({
  components: {
    CountUp,
    CardWidget,
    Blockchain,
    LightningWallet,
    StorageWidget,
  },
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    const bitcoinStore = useBitcoinStore();
    const lightningStore = useLightningStore();
    const uiStore = useUiStore();

    return {
      userStore,
      systemStore,
      bitcoinStore,
      lightningStore,
      uiStore,
    };
  },
  data() {
    return {
      interval: null,
    } as {
      interval: null | number;
    };
  },
  computed: {
    btcBalance() {
      //skip if still loading
      if (this.bitcoinStore.balance.total === -1) {
        return -1;
      }
      if (this.systemStore.unit === 'btc') {
        return satsToBtc(this.bitcoinStore.balance.total);
      }
      return this.bitcoinStore.balance.total;
    },
    greeting: () => {
      const currentHour = new Date().getHours();

      const greetingMessage =
        currentHour >= 4 && currentHour < 12 // after 4:00AM and before 12:00PM
          ? 'Good morning'
          : currentHour >= 12 && currentHour <= 16 // after 12:00PM and before 5:00PM
          ? 'Good afternoon'
          : currentHour > 16 || currentHour < 4 // after 5:00PM or before 4:00AM (to accommodate our fellow hackers)
          ? 'Good evening'
          : 'Welcome back'; // if for some reason the calculation didn't work

      return greetingMessage;
    },
  },
  created() {
    this.interval = window.setInterval(() => {
      this.bitcoinStore.getStats();
    }, 30000);
  },
  beforeUnmount() {
    window.clearInterval(this.interval as number);
  },
  methods: {},
});
</script>
