<template>
  <connection-details name="Zap (Desktop)" requires="lnd">
    <step-list>
      <step>
        Open Zap Desktop and click
        <span class="font-weight-bold">"Connect"</span> on the welcome screen.
      </step>
      <step>
        In the <span class="font-weight-bold">"Connection String"</span>, enter
        <input-copy
          class="d-block mt-2 mb-1"
          :value="urls.lnd.grpcLocal"
        ></input-copy>
      </step>
      <step>
        Click <span class="font-weight-bold">"Next"</span> two times to confirm.
      </step>
      <step>
        Congratulations! You have successfully connected Zap (Desktop) to your
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
