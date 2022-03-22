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

type Option = {
  value: string | null;
  text: string;
  disabled?: boolean;
  requires?: string[];
};

const defaultOptions: (Option | { label: string; options: Option[] })[] = [
  { value: null, text: "Select your wallet", disabled: true },
  { value: "bitboxapp", text: "BitBoxApp", requires: ["electrum"] },
  {
    value: "blockstream-green",
    text: "Blockstream Green (Android)",
    requires: ["bitcoin"],
  },
  { value: "bluewallet", text: "BlueWallet", requires: ["electrum"] },
  {
    value: "electrum-android",
    text: "Electrum Wallet (Android)",
    requires: ["electrum"],
  },
  {
    value: "electrum-desktop",
    text: "Electrum Wallet (Desktop)",
    requires: ["electrum"],
  },
  { value: "fully-noded", text: "Fully Noded (iOS)", requires: ["bitcoin"] },
  { value: "lily-wallet", text: "Lily Wallet", requires: ["bitcoin"] },
  {
    value: "lightning-atm",
    text: "Lightning ATM (Untested)",
    requires: ["lnd"],
  },
  { value: "phoenix", text: "Phoenix Wallet", requires: ["electrum"] },
  { value: "samourai-wallet", text: "Samourai Wallet", requires: ["bitcoin"] },
  { value: "sparrow", text: "Sparrow", requires: ["electrum"] },
  { value: "specter-desktop", text: "Specter Desktop", requires: ["bitcoin"] },
  { value: "wasabi", text: "Wasabi", requires: ["bitcoin"] },
  { value: "zap-android", text: "Zap (Android)", requires: ["lnd"] },
  { value: "zap-desktop", text: "Zap (Desktop)", requires: ["lnd"] },
  { value: "zap-ios", text: "Zap (iOS)", requires: ["lnd"] },
  { value: "zeus", text: "Zeus", requires: ["lnd"] },
  {
    label: "Other",
    options: [
      {
        value: "bitcoin-core-p2p",
        text: "Bitcoin Core P2P",
        requires: ["bitcoin"],
      },
      {
        value: "bitcoin-core-rpc",
        text: "Bitcoin Core RPC",
        requires: ["bitcoin"],
      },
      {
        value: "electrum-server",
        text: "Electrum Server",
        requires: ["electrum"],
      },
      {
        value: "lndconnect-grpc-local",
        text: "lndconnect gRPC (Local)",
        requires: ["lnd"],
      },
      {
        value: "lndconnect-grpc-tor",
        text: "lndconnect gRPC (Tor)",
        requires: ["lnd"],
      },
      {
        value: "lndconnect-rest-local",
        text: "lndconnect REST (Local)",
        requires: ["lnd"],
      },
      {
        value: "lndconnect-rest-tor",
        text: "lndconnect REST (Tor)",
        requires: ["lnd"],
      },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/ban-types
function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

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
      qrModalData: {
        value: "",
        size: window.innerWidth < 600 ? window.innerWidth - 60 : 500,
      },
    };
  },
  computed: {
    options() {
      const validateOption = (option: Option) => {
        if (
          this.lightningStore.implementation !== "lnd" &&
          option.requires?.includes("lnd")
        )
          return false;
        if (
          this.lightningStore.implementation !== "c-lightning" &&
          option.requires?.includes("c-lightning")
        )
          return false;
        if (
          !this.bitcoinStore.isInstalled &&
          (option.requires?.includes("bitcoin") ||
            option.requires?.includes("electrum"))
        )
          return false;
        return true;
      };

      let availableOptions: (Option | { label: string; options: Option[] })[] =
        [];
      for (const option of defaultOptions) {
        if (hasOwnProperty(option, "options")) {
          const localOptions = [];
          for (const subOption of option.options) {
            if (validateOption(subOption)) localOptions.push(subOption);
          }
          availableOptions = [...availableOptions, ...localOptions];
        } else {
          if (validateOption(option)) availableOptions.push(option);
        }
      }
      return availableOptions;
    },
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
