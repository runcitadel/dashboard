<template>
  <connection-details
    name="any other wallet that supports Electrum Server"
    requires="electrum"
  >
    <div class="d-lg-flex align-items-center justify-content-center pb-3">
      <qr-code
        :value="urls.bitcoin.electrum.connectionString"
        :size="260"
        level="M"
        class="qr-image mx-auto mb-3 mb-lg-0"
        show-logo
        :style="{ cursor: 'pointer' }"
        @click="$emit('showQrModal', urls.bitcoin.electrum.connectionString)"
      ></qr-code>
      <div class="w-100 align-self-center ms-lg-3 connect-wallet-steps">
        <div class="connect-wallet-step">
          <label class="mb-1 d-block"
            ><small class="ms-1 font-weight-bold"
              >Electrum Address</small
            ></label
          >
          <input-copy
            class="my-1"
            :value="urls.bitcoin.electrum.address"
            auto-width
          ></input-copy>
        </div>
        <div class="connect-wallet-step">
          <label class="mb-1 d-block"
            ><small class="ms-1 font-weight-bold">Electrum Port</small></label
          >
          <input-copy
            class="my-1"
            :value="urls.bitcoin.electrum.port"
            auto-width
          ></input-copy>
        </div>
        <div class="connect-wallet-step">
          <label class="mb-1 d-block"
            ><small class="ms-1 font-weight-bold">SSL</small></label
          >
          <small class="ms-1">Disabled</small>
        </div>
      </div>
    </div>
  </connection-details>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ConnectionDetails from "../ConnectionDetails.vue";
import InputCopy from "../../Utility/InputCopy.vue";
import QrCode from "../../Utility/QrCode.vue";

export default defineComponent({
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
});
</script>
