<template>
  <div class="p-sm-2">
    <div class="my-3 pb-2">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-start align-items-center">
          <img
            style="height: auto; width: 12vw; max-width: 100px"
            class="me-2 me-sm-3"
            src="@/assets/icon-app-bitcoin.svg"
          />
          <div>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="4" r="4" fill="#00CD98" />
            </svg>
            <small class="ms-1 text-success">Running</small>
            <h3 class="d-block font-weight-bold mb-1">Bitcoin Core</h3>
            <span class="d-block text-muted"
              >Bitcoin Knots {{ knotsVersion }} (Based on Bitcoin Core
              {{ coreVersion }})</span
            >
          </div>
        </div>
      </div>
    </div>

    <b-row class="row-eq-height">
      <b-col col cols="12" md="6" xl="4">
        <bitcoin-wallet></bitcoin-wallet>
      </b-col>
      <b-col col cols="12" md="6" xl="4">
        <card-widget
          header="Blockchain"
          :loading="
            bitcoinStore.percent !== 100 || bitcoinStore.blocks.length === 0
          "
        >
          <!-- <template v-slot:menu>
            <b-dropdown-item variant="danger" href="#" disabled>Resync Blockchain</b-dropdown-item>
          </template>-->
          <div class>
            <div class="px-3 px-lg-4 mb-3">
              <div class="w-100 d-flex justify-content-between mb-2">
                <span class="align-self-end">Synchronized</span>
                <h3 class="font-weight-normal mb-0">
                  <span v-if="bitcoinStore.percent !== -1">
                    {{
                      bitcoinStore.percent >= 99.99 ? 100 : bitcoinStore.percent
                    }}
                    <small class>%</small>
                  </span>

                  <span
                    v-else
                    class="loading-placeholder loading-placeholder-lg d-block"
                    style="width: 6rem"
                  ></span>
                </h3>
              </div>
              <b-progress
                :value="Math.round(bitcoinStore.percent)"
                class="mb-1"
                variant="success"
                :style="{height: '4px'}"
                animated
                striped
              ></b-progress>
              <small
                v-if="bitcoinStore.currentBlock < bitcoinStore.blockHeight - 1"
                class="text-muted d-block text-end"
              >
                {{ bitcoinStore.currentBlock.toLocaleString() }} of
                {{ bitcoinStore.blockHeight.toLocaleString() }} blocks
                <b-icon-info-circle-fill
                  v-b-tooltip.hover.bottom
                  icon="info-circle-fill"
                  style="opacity: 0.4"
                  variant="dark"
                  class="ms-1"
                  title="This percentage depends on the number of transactions inside each block and is only an estimation. Empty blocks will be verified faster and have less weight in the overall synchronization percentage"
                />
              </small>
            </div>
            <!-- low storage mode  -->
            <!-- <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
              <div>
                <span class="d-block">Low Storage Mode</span>
                <small class="text-muted d-block">Discard old blocks</small>
              </div>
              <toggle-switch class="align-self-center"></toggle-switch>
            </div>-->
            <p class="px-3 px-lg-4 mb-3">Latest Blocks</p>
            <blockchain :num-blocks="3"></blockchain>
            <div class="px-3 px-lg-4 py-2"></div>
          </div>
        </card-widget>
      </b-col>
      <b-col col cols="12" xl="4">
        <card-widget header="Network">
          <div class>
            <div class="px-3 px-lg-4 pb-2">
              <b-row>
                <!-- <b-col col cols="6" md="3" xl="6" v-for="stat in stats" :key="stat.title">
                  <stat
                    :title="stat.title"
                    :value="stat.value"
                    :suffix="stat.suffix"
                    :change="{
                      value: stat.change.value,
                      suffix: stat.change.suffix
                    }"
                  ></stat>
                </b-col>-->
                <b-col col cols="6" md="3" xl="6">
                  <stat
                    title="Connections"
                    :value="bitcoinStore.stats.peers"
                    suffix="Peers"
                    show-numeric-change
                  ></stat>
                </b-col>
                <b-col col cols="6" md="3" xl="6">
                  <stat
                    title="Mempool"
                    :value="abbreviateSize(bitcoinStore.stats.mempool)[0]"
                    :suffix="abbreviateSize(bitcoinStore.stats.mempool)[1]"
                    show-percent-change
                  ></stat>
                </b-col>
                <b-col col cols="6" md="3" xl="6">
                  <stat
                    title="Hashrate"
                    :value="abbreviateHashRate(bitcoinStore.stats.hashrate)[0]"
                    :suffix="abbreviateHashRate(bitcoinStore.stats.hashrate)[1]"
                    show-percent-change
                  ></stat>
                </b-col>
                <b-col col cols="6" md="3" xl="6">
                  <stat
                    title="Blockchain Size"
                    :value="
                      abbreviateSize(bitcoinStore.stats.blockchainSize)[0]
                    "
                    :suffix="
                      abbreviateSize(bitcoinStore.stats.blockchainSize)[1]
                    "
                    show-percent-change
                  ></stat>
                </b-col>
              </b-row>
            </div>
          </div>
        </card-widget>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import CardWidget from '../components/CardWidget.vue';
import Blockchain from '../components/Blockchain.vue';
import Stat from '../components/Utility/Stat.vue';
import BitcoinWallet from '../components/BitcoinWallet.vue';
import useBitcoinStore from '../store/bitcoin';

import {defineComponent} from 'vue';
import {BIconInfoCircleFill} from 'bootstrap-vue/src/index.js';

export default defineComponent({
  components: {
    CardWidget,
    Blockchain,
    Stat,
    BitcoinWallet,
    BIconInfoCircleFill,
  },
  setup() {
    const bitcoinStore = useBitcoinStore();
    return {bitcoinStore};
  },
  data() {
    return {} as {
      interval?: number;
    };
  },
  /*computed: {
    ...mapState<RootState>({
      syncPercent: (state: RootState) => state.bitcoin.percent,
      blocks: (state: RootState) => state.bitcoin.blocks,
      coreVersion: (state: RootState) =>
        state.bitcoin.version.split("/")[1].split(":")[1],
      knotsVersion: (state: RootState) =>
        state.bitcoin.version.split("/")[2].split(":")[1],
      currentBlock: (state: RootState) => state.bitcoin.currentBlock,
      blockHeight: (state: RootState) => state.bitcoin.blockHeight,
      stats: (state: RootState) => state.bitcoin.stats,
      onionAddress: (state: RootState) => state.bitcoin.onionAddress,
      rpc: (state: RootState) => state.bitcoin.rpc,
    }),
  },*/
  computed: {
    coreVersion(): string {
      return this.bitcoinStore.version.split('/')[1]?.split(':')[1];
    },
    knotsVersion(): string {
      return this.bitcoinStore.version.split('/')[2]?.split(':')[1];
    },
  },
  created() {
    this.bitcoinStore.getVersion();
    this.fetchStats();
    this.interval = window.setInterval(this.fetchStats, 5000);
  },
  beforeUnmount() {
    window.clearInterval(this.interval);
  },
  methods: {
    random(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    abbreviateHashRate(n: number): [number, string] {
      if (n < 1e3) return [Number(n.toFixed(1)), 'H/s'];
      if (n >= 1e3 && n < 1e6) return [Number((n / 1e3).toFixed(1)), 'kH/s'];
      if (n >= 1e6 && n < 1e9) return [Number((n / 1e6).toFixed(1)), 'MH/s'];
      if (n >= 1e9 && n < 1e12) return [Number((n / 1e9).toFixed(1)), 'GH/s'];
      if (n >= 1e12 && n < 1e15) return [Number((n / 1e12).toFixed(1)), 'TH/s'];
      if (n >= 1e15 && n < 1e18) return [Number((n / 1e15).toFixed(1)), 'PH/s'];
      if (n >= 1e18 && n < 1e21) return [Number((n / 1e18).toFixed(1)), 'EH/s'];
      if (n >= 1e21) return [Number(+(n / 1e21).toFixed(1)), 'ZH/s'];
      // Just a fallback to prevent TS errors
      return [Number(n.toFixed(1)), 'H/s'];
    },
    abbreviateSize(n: number): [number, string] {
      if (n < 1e3) return [Number(n.toFixed(1)), 'Bytes'];
      if (n >= 1e3 && n < 1e6) return [Number((n / 1e3).toFixed(1)), 'KB'];
      if (n >= 1e6 && n < 1e9) return [Number((n / 1e6).toFixed(1)), 'MB'];
      if (n >= 1e9 && n < 1e12) return [Number((n / 1e9).toFixed(1)), 'GB'];
      if (n >= 1e12 && n < 1e15) return [Number((n / 1e12).toFixed(1)), 'TB'];
      if (n >= 1e15) return [Number(+(n / 1e15).toFixed(1)), 'PB'];
      // Just a fallback to prevent TS errors
      return [Number(n.toFixed(1)), 'Bytes'];
    },
    fetchStats() {
      this.bitcoinStore.getStats();
    },
  },
});
</script>
