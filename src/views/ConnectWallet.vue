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
            :value="wallet"
            :options="options"
            class="mb-4"
            @change="selectWallet"
          ></b-form-select>
        </b-col>
      </b-row>

      <router-view :urls="urls" @show-qr-modal="showQrModal"></router-view>
    </div>

    <b-modal id="qr-modal" ref="qr-modal" hide-footer size="lg">
      <div class="d-flex w-100 align-items-center justify-content-center">
        <qr-code
          :value="qrModalData.value"
          :size="qrModalData.size"
          class="qr-image mb-5"
          show-logo
        ></qr-code>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import useBitcoinStore from "../store/bitcoin";
import useLightningStore from "../store/lightning";
import QrCode from "../components/Utility/QrCode.vue";

export default defineComponent({
  components: {
    QrCode,
  },
  setup() {
    const bitcoinStore = useBitcoinStore();
    const lightningStore = useLightningStore();
    return { bitcoinStore, lightningStore };
  },
  data() {
    return {
      options: [
        { value: null, text: "Select your wallet", disabled: true },
        { value: "bitboxapp", text: "BitBoxApp" },
        { value: "blockstream-green", text: "Blockstream Green (Android)" },
        { value: "bluewallet", text: "BlueWallet" },
        { value: "electrum-android", text: "Electrum Wallet (Android)" },
        { value: "electrum-desktop", text: "Electrum Wallet (Desktop)" },
        { value: "fully-noded", text: "Fully Noded (iOS)" },
        { value: "lily-wallet", text: "Lily Wallet" },
        { value: "lightning-atm", text: "Lightning ATM (Untested)" },
        { value: "phoenix", text: "Phoenix Wallet" },
        { value: "samourai-wallet", text: "Samourai Wallet" },
        { value: "sparrow", text: "Sparrow" },
        { value: "specter-desktop", text: "Specter Desktop" },
        { value: "wasabi", text: "Wasabi" },
        { value: "zap-android", text: "Zap (Android)" },
        { value: "zap-desktop", text: "Zap (Desktop)" },
        { value: "zap-ios", text: "Zap (iOS)" },
        { value: "zeus", text: "Zeus" },
        {
          label: "Other",
          options: [
            { value: "bitcoin-core-p2p", text: "Bitcoin Core P2P" },
            { value: "bitcoin-core-rpc", text: "Bitcoin Core RPC" },
            { value: "electrum-server", text: "Electrum Server" },
            { value: "lndconnect-grpc-local", text: "lndconnect gRPC (Local)" },
            { value: "lndconnect-grpc-tor", text: "lndconnect gRPC (Tor)" },
            { value: "lndconnect-rest-local", text: "lndconnect REST (Local)" },
            { value: "lndconnect-rest-tor", text: "lndconnect REST (Tor)" },
          ],
        },
      ],
      qrModalData: {
        value: "",
        size: window.innerWidth < 600 ? window.innerWidth - 60 : 500,
      },
    };
  },
  computed: {
    urls(): {
      bitcoin: {
        p2p: { address: string; port: string; connectionString: string };
        electrum: { address: string; port: string; connectionString: string };
        rpc: { address: string; port: string; connectionString: string };
      };
      lnd: {
        restTor: string;
        restLocal: string;
        grpcTor: string;
        grpcLocal: string;
      };
    } {
      return {
        bitcoin: {
          p2p: this.bitcoinStore.p2p,
          electrum: this.bitcoinStore.electrum,
          rpc: this.bitcoinStore.rpc,
        },
        lnd: this.lightningStore.lndConnectUrls,
      };
    },
    wallet() {
      return this.$route.meta.wallet || null;
    },
  },
  created() {
    this.fetchConnectionDetails();
  },
  methods: {
    fetchConnectionDetails() {
      return Promise.all([
        this.lightningStore.getLndConnectUrls(),
        this.bitcoinStore.getP2PInfo(),
        this.bitcoinStore.getElectrumInfo(),
        this.bitcoinStore.getRpcInfo(),
      ]);
    },
    selectWallet(wallet: string) {
      this.$router.push(`/connect/${wallet}`);
    },
    showQrModal(value: string) {
      this.qrModalData.value = value;
      (this.$refs["qr-modal"] as { show: () => void }).show();
    },
  },
});
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
