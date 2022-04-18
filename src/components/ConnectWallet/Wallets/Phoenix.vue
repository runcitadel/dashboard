<template>
  <connection-details name="Phoenix Wallet" requires="electrum">
    <step-list>
      <step> Open Phoenix Wallet on your phone. </step>
      <step>
        Go to <span class="font-weight-bold">Settings > Electrum Server</span>.
      </step>
      <step> Tap <span class="font-weight-bold">"Set server..."</span>. </step>
      <step>
        Check <span class="font-weight-bold">"Use a custom server"</span>.
      </step>
      <step>
        For your server address enter
        <input-copy
          :value="`${urls.bitcoin.electrum.address}:${urls.bitcoin.electrum.port}`"
          auto-width
        ></input-copy>
      </step>
      <step> Tap <span class="font-weight-bold">"Confirm"</span> </step>
      <step> Go to <span class="font-weight-bold">Settings > Tor</span>. </step>
      <step> Enable Tor. </step>
      <step>
        Congratulations! You have successfully connected Phoenix Wallet to your
        Citadel.
      </step>
    </step-list>
  </connection-details>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import ConnectionDetails from '../ConnectionDetails.vue';
import StepList from '../StepList.vue';
import Step from '../Step.vue';
import InputCopy from '../../Utility/InputCopy.vue';

export default defineComponent({
  components: {
    ConnectionDetails,
    StepList,
    Step,
    InputCopy,
  },
  props: {
    urls: {
      type: Object,
      required: true,
    },
  },
  emits: ['showQrModal'],
});
</script>
