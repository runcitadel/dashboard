<template>
  <connection-details name="Samourai Wallet">
    <step-list>
      <step>
        Install
        <b-link to="/app-store/samourai-server">Samourai Server app</b-link> on
        your Citadel.
      </step>
      <step>
        Open the app and follow instructions to connect Samourai Wallet to your
        Citadel's Dojo.
      </step>
    </step-list>
  </connection-details>
</template>

<script>
import ConnectionDetails from "@/components/ConnectWallet/ConnectionDetails";
import StepList from "@/components/ConnectWallet/StepList";
import Step from "@/components/ConnectWallet/Step";

export default {
  components: {
    ConnectionDetails,
    StepList,
    Step,
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
