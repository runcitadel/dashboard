<template>
  <connection-details name="Lightning ATM" requires="lnd">
    <step-list>
      <step> Start your Lightning ATM </step>
      <step>
        Put your ATM into the "credentials scanning" mode. This can be done by
        pushing the button 3 times.
      </step>
      <step>
        After you pushed the button three times your display should say "Please
        scan your wallet credentials". Now take your mobile phone with this QR
        code and show it to the camera.
      </step>
      <step>
        Scan this QR Code
        <qr-code
          :value="urls.lnd.restLocal.replace(/cert=(.*)&/gm, '')"
          :size="300"
          class="qr-image mt-2"
          show-logo
          :style="{cursor: 'pointer'}"
          @click="
            $emit('showQrModal', urls.lnd.restLocal.replace(/cert=(.*)&/gm, ''))
          "
        ></qr-code>
      </step>
      <step>
        It will now scan your credentials, evaluate its content and safe it to
        the configuration file of the ATM. If you've been successful, your
        screen will say "Success!!" and your LND node is successfully linked
        with your ATM.
      </step>
    </step-list>
  </connection-details>
</template>

<script lang="ts" setup>
import ConnectionDetails from '../ConnectionDetails.vue';
import StepList from '../StepList.vue';
import Step from '../Step.vue';
import QrCode from '../../Utility/QrCode.vue';

defineProps({
  urls: {
    type: Object,
    required: true,
  },
});

defineEmits(['showQrModal']);
</script>
