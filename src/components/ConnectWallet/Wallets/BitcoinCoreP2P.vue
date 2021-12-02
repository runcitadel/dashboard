<template>
  <connection-details
    name="any other wallet that supports Bitcoin Core's P2P"
    requires="bitcoind"
  >
    <div class="d-lg-flex align-items-center justify-content-center pb-3">
      <qr-code
        :value="urls.bitcoin.p2p.connectionString"
        :size="260"
        level="M"
        class="qr-image mx-auto mb-3 mb-lg-0"
        show-logo
        :style="{ cursor: 'pointer' }"
        @click="$emit('showQrModal', urls.bitcoin.p2p.connectionString)"
      ></qr-code>
      <div class="w-100 align-self-center ms-lg-3 connect-wallet-steps">
        <div class="connect-wallet-step">
          <label class="mb-1 d-block"
            ><small class="ms-1 font-weight-bold"
              >Bitcoin Core P2P Address (Host)</small
            ></label
          >
          <input-copy
            class="my-1"
            :value="urls.bitcoin.p2p.address"
            auto-width
          ></input-copy>
        </div>
        <div class="connect-wallet-step">
          <label class="mb-1 d-block"
            ><small class="ms-1 font-weight-bold"
              >Bitcoin Core P2P Port</small
            ></label
          >
          <input-copy
            class="my-1"
            :value="urls.bitcoin.p2p.port"
            auto-width
          ></input-copy>
        </div>
      </div>
    </div>
  </connection-details>
</template>

<script>
import ConnectionDetails from "@/components/ConnectWallet/ConnectionDetails";
import InputCopy from "@/components/Utility/InputCopy";
import QrCode from "@/components/Utility/QrCode";

export default {
  components: {
    ConnectionDetails,
    InputCopy,
    QrCode,
  },
  props: {
    urls: {
      type: Object,
      required: true,
    },
  },
  emits: ["showQrModal"],
};
</script>
