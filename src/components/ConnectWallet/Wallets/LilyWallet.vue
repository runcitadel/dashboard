<template>
  <connection-details name="Lily Wallet" requires="bitcoind">
    <step-list>
      <step>
        Make sure Tor is up and running on your system.
        <b-link @click.prevent="$emit('showTorModal')">Click here</b-link> for
        instructions.
      </step>
      <step>
        Open Lily Wallet, click the green circle in the top right corner, and
        then
        <span class="font-weight-bold">"Network settings"</span>.
      </step>
      <step>
        Click the and click
        <span class="font-weight-bold">"Change Data Source"</span> option and
        then <span class="font-weight-bold">"Connect to Custom Node"</span> to
        bring up the connection modal.
      </step>
      <step>
        For <span class="font-weight-bold">"Host"</span> enter
        <input-copy
          class="my-1"
          :value="`http://${urls.bitcoin.rpc.address}:${urls.bitcoin.rpc.port}`"
          auto-width
        ></input-copy>
      </step>
      <step>
        For <span class="font-weight-bold">"Username"</span> enter
        <input-copy
          class="my-1"
          :value="urls.bitcoin.rpc.rpcuser"
          auto-width
        ></input-copy>
      </step>
      <step>
        For <span class="font-weight-bold">"Password"</span> enter
        <input-copy
          class="my-1"
          :value="urls.bitcoin.rpc.rpcpassword"
          auto-width
        ></input-copy>
      </step>
      <step>
        Click <span class="font-weight-bold">"Connect to Node"</span> to verify
        if Lily Wallet is able to connect to your Citadel.
      </step>
      <step>
        Congratulations! You have successfully connected Lily Wallet to your
        Citadel.
      </step>
    </step-list>

    <b-alert class="my-4 px-2 py-3" variant="info" show
      >Note: After connecting Lily Wallet to Citadel, your accounts in Lily will
      need to sync which may take some time. <br /><br />
      For detailed instructions with pictures, check out
      <b-link
        target="_blank"
        href="https://docs.lily-wallet.com/connect-to-node/umbrel"
        >Lily's documentation</b-link
      >. If you get stuck, reach out to
      <b-link target="_blank" href="https://lily-wallet.com/support"
        >Lily's Support Team</b-link
      >.
    </b-alert>
  </connection-details>
</template>

<script lang="ts" setup>
import ConnectionDetails from '../ConnectionDetails.vue';
import StepList from '../StepList.vue';
import Step from '../Step.vue';
import InputCopy from '../../Utility/InputCopy.vue';

defineProps({
  urls: {
    type: Object,
    required: true,
  },
});

defineEmits(['showTorModal']);
</script>
<style lang="scss" scoped></style>
