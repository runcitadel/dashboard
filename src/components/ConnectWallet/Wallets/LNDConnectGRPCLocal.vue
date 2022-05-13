<template>
  <connection-details
    name="any other wallet that supports lndconnect gRPC on local network"
    requires="lnd"
  >
    <div class="d-lg-flex align-items-center justify-content-center pb-3">
      <qr-code
        :value="urls.lnd.grpcLocal"
        :size="260"
        level="M"
        class="qr-image mx-auto mb-3 mb-lg-0"
        show-logo
        :style="{cursor: 'pointer'}"
        @click="$emit('showQrModal', urls.lnd.grpcLocal)"
      ></qr-code>
      <div class="w-100 align-self-center ms-lg-3">
        <label class="mb-1 d-block"
          ><small class="font-weight-bold">lndconnect URL</small></label
        >
        <input-copy class="my-1" :value="urls.lnd.grpcLocal"></input-copy>
      </div>
    </div>
  </connection-details>
</template>

<script lang="ts" setup>
import ConnectionDetails from '../ConnectionDetails.vue';
import InputCopy from '../../Utility/InputCopy.vue';
import QrCode from '../../Utility/QrCode.vue';

defineProps({
  urls: {
    type: Object,
    required: true,
  },
});

defineEmits(['showQrModal']);
</script>
