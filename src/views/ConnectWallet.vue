<template>
  <div>
    <div class="p-sm-2">
      <div class="my-3">
        <div>
          <h1>connect wallet</h1>
          <p>Connect your Bitcoin or Lightning wallet to your Citadel</p>
        </div>
      </div>

      <b-row>
        <b-col cols="12" md="4" xl="3">
          <b-form-select
            :modelValue="wallet"
            :options="options"
            class="mb-4"
            @change="selectWallet"
          ></b-form-select>
        </b-col>
      </b-row>

      <router-view
        :urls="urls"
        @show-qr-modal="(value: string) => {qrModalData.value = value; showQrModal = true;}"
        @show-tor-modal="showTorModal = true"
      ></router-view>
    </div>

    <b-modal id="qr-modal" v-model="showQrModal" hide-footer size="lg">
      <div class="d-flex w-100 align-items-center justify-content-center">
        <qr-code
          :value="qrModalData.value"
          :size="qrModalData.size"
          class="qr-image mb-5"
          show-logo
        ></qr-code>
      </div>
    </b-modal>
    <b-modal id="tor-modal" centered hide-footer v-model="showTorModal">
      <tor-setup></tor-setup>
    </b-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted} from 'vue';

import useBitcoinStore from '../store/bitcoin';
import useLightningStore from '../store/lightning';
import QrCode from '../components/Utility/QrCode.vue';
import TorSetup from '../components/ConnectWallet/TorSetup.vue';
import {useRoute, useRouter} from 'vue-router';

const bitcoinStore = useBitcoinStore();
const lightningStore = useLightningStore();
const route = useRoute();
const router = useRouter();
const options = [
  {value: null, text: 'Select your wallet', disabled: true},
  {value: 'bitboxapp', text: 'BitBoxApp'},
  {value: 'blockstream-green', text: 'Blockstream Green (Android)'},
  {value: 'bluewallet', text: 'BlueWallet'},
  {value: 'electrum-android', text: 'Electrum Wallet (Android)'},
  {value: 'electrum-desktop', text: 'Electrum Wallet (Desktop)'},
  {value: 'fully-noded', text: 'Fully Noded (iOS)'},
  {value: 'lily-wallet', text: 'Lily Wallet'},
  {value: 'lightning-atm', text: 'Lightning ATM (Untested)'},
  {value: 'phoenix', text: 'Phoenix Wallet'},
  {value: 'samourai-wallet', text: 'Samourai Wallet'},
  {value: 'sparrow', text: 'Sparrow'},
  {value: 'specter-desktop', text: 'Specter Desktop'},
  {value: 'wasabi', text: 'Wasabi'},
  {value: 'zap-android', text: 'Zap (Android)'},
  {value: 'zap-desktop', text: 'Zap (Desktop)'},
  {value: 'zap-ios', text: 'Zap (iOS)'},
  {value: 'zeus', text: 'Zeus'},
  {
    label: 'Other',
    options: [
      {value: 'bitcoin-core-p2p', text: 'Bitcoin Core P2P'},
      {value: 'bitcoin-core-rpc', text: 'Bitcoin Core RPC'},
      {value: 'electrum-server', text: 'Electrum Server'},
      {value: 'lndconnect-grpc-local', text: 'lndconnect gRPC (Local)'},
      {value: 'lndconnect-grpc-tor', text: 'lndconnect gRPC (Tor)'},
      {value: 'lndconnect-rest-local', text: 'lndconnect REST (Local)'},
      {value: 'lndconnect-rest-tor', text: 'lndconnect REST (Tor)'},
    ],
  },
];
const qrModalData = ref({
  value: '',
  size: window.innerWidth < 600 ? window.innerWidth - 60 : 500,
});
const showQrModal = ref(false);
const showTorModal = ref(false);
const urls = computed(() => {
  return {
    bitcoin: {
      p2p: bitcoinStore.p2p,
      electrum: bitcoinStore.electrum,
      rpc: bitcoinStore.rpc,
    },
    lnd: lightningStore.lndConnectUrls,
  };
});
const wallet = computed(() => {
  return route.meta.wallet || null;
});
onMounted(() => {
  fetchConnectionDetails();
});
function fetchConnectionDetails() {
  return Promise.all([
    lightningStore.getLndConnectUrls(),
    bitcoinStore.getP2PInfo(),
    bitcoinStore.getElectrumInfo(),
    bitcoinStore.getRpcInfo(),
  ]);
}
function selectWallet(wallet: string) {
  router.push(`/connect/${wallet}`);
}
</script>

<style lang="scss">
@media (min-width: 456px) {
  #qr-modal {
    .modal-dialog {
      max-width: 600px;
      margin: 1.75rem auto;
    }
  }
}
</style>
