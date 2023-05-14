<template>
  <connection-details name="Zap (Android)" requires="lnd">
    <step-list>
      <step> Open the Zap app on your phone. </step>
      <step>
        Tap <span class="font-weight-bold">"Connect"</span> on the welcome
        screen.
      </step>
      <step>
        Scan this QR Code (click to enlarge)
        <qr-code
          :value="urls.lnd.grpcTor.replace(/cert=(.*)&/gm, '')"
          :size="300"
          class="qr-image mt-2"
          show-logo
          :style="{cursor: 'pointer'}"
          @click="
            $emit('showQrModal', urls.lnd.grpcTor.replace(/cert=(.*)&/gm, ''))
          "
        ></qr-code>
        <hr />
        <p class="text-body-secondary">Or manually enter the following details</p>
        <ul class="connect-wallet-substeps">
          <li class="connect-wallet-substep">
            Copy
            <input-copy
              class="my-1"
              :value="urls.lnd.grpcTor.replace(/cert=(.*)&/gm, '')"
            ></input-copy>
          </li>
          <li class="connect-wallet-substep">
            Tap <span class="font-weight-bold">"Paste"</span> and
            <span class="font-weight-bold">"Save"</span>.
          </li>
        </ul>
      </step>
      <step>
        Congratulations! You have successfully connected Zap (Android) to your
        Citadel.
      </step>
    </step-list>
  </connection-details>
</template>

<script lang="ts" setup>
import ConnectionDetails from '../ConnectionDetails.vue';
import StepList from '../StepList.vue';
import Step from '../Step.vue';
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
