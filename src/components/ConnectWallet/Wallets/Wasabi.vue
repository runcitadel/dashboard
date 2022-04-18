<template>
  <connection-details name="Wasabi" requires="bitcoind">
    <step-list>
      <step>
        Open Wasabi, go to
        <span class="font-weight-bold">Tools > Settings</span>.
      </step>
      <step>
        Under <span class="font-weight-bold">"Bitcoin P2P Endpoint"</span>,
        enter
        <input-copy
          class="my-1"
          :value="`${urls.bitcoin.p2p.address}:${urls.bitcoin.p2p.port}`"
          auto-width
        ></input-copy>
      </step>
      <step> Restart Wasabi </step>
      <step>
        Congratulations! You have successfully connected Wasabi to your Citadel.
      </step>
    </step-list>

    <b-modal id="tor-modal" centered hide-footer>
      <tor-setup></tor-setup>
    </b-modal>
  </connection-details>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import ConnectionDetails from '../ConnectionDetails.vue';
import StepList from '../StepList.vue';
import Step from '../Step.vue';
import TorSetup from '../TorSetup.vue';
import InputCopy from '../../Utility/InputCopy.vue';

export default defineComponent({
  components: {
    ConnectionDetails,
    StepList,
    Step,
    InputCopy,
    TorSetup,
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
