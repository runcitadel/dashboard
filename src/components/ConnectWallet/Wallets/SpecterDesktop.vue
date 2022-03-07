<template>
  <connection-details name="Specter Desktop" requires="bitcoind">
    <b-alert class="mb-3" variant="info" show
      >Follow these instructions only if you are using the
      <b-link
        target="_blank"
        href="https://github.com/cryptoadvance/specter-desktop/releases/latest"
        >native Specter Desktop application</b-link
      >. If you're using the
      <b-link to="/app-store/specter-desktop"> Specter Desktop app</b-link> on
      Citadel, you do not need to follow these instructions as Specter
      automatically connects to Bitcoin Core on your Citadel.</b-alert
    >
    <step-list>
      <step>
        Make sure Tor is up and running on your system.
        <b-link v-b-modal.tor-modal>Click here</b-link> for instructions.
      </step>
      <step>
        Open Specter Wallet and click
        <span class="font-weight-bold">"Configure Node"</span>.
      </step>
      <step>
        Disable <span class="font-weight-bold">"Auto-detect"</span>.
      </step>
      <step>
        In the <span class="font-weight-bold">"Username"</span>, enter
        <input-copy
          class="my-1"
          :value="urls.bitcoin.rpc.rpcuser"
          auto-width
        ></input-copy>
      </step>
      <step>
        In the <span class="font-weight-bold">"Password"</span>, enter
        <input-copy
          class="my-1"
          :value="urls.bitcoin.rpc.rpcpassword"
          auto-width
        ></input-copy>
      </step>
      <step>
        In the <span class="font-weight-bold">"Host"</span>, enter
        <input-copy
          class="my-1"
          :value="urls.bitcoin.rpc.address"
          auto-width
        ></input-copy>
      </step>
      <step>
        In the <span class="font-weight-bold">"Port"</span>, enter
        <input-copy
          class="my-1"
          :value="urls.bitcoin.rpc.port"
          auto-width
        ></input-copy>
      </step>
      <step>
        Click <span class="font-weight-bold">"Test"</span> to verify if Specter
        is able to connect to your Citadel.
      </step>
      <step>
        After verifying, click <span class="font-weight-bold">"Save"</span>.
      </step>
      <step>
        Congratulations! You have successfully connected Specter Desktop to your
        Citadel.
      </step>
    </step-list>

    <b-modal id="tor-modal" centered hide-footer>
      <tor-setup></tor-setup>
    </b-modal>
  </connection-details>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ConnectionDetails from "../ConnectionDetails.vue";
import StepList from "../StepList.vue";
import Step from "../Step.vue";
import TorSetup from "../TorSetup.vue";
import InputCopy from "../../Utility/InputCopy.vue";

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
  emits: ["showQrModal"],
});
</script>
<style lang="scss" scoped></style>
