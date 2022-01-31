<template>
  <connection-details name="Zeus" requires="lnd">
    <step-list>
      <step> Open the Zeus app on your phone. </step>
      <step>
        Tap <span class="font-weight-bold">"Scan lndconnect config"</span>.
      </step>
      <step>
        Scan this QR Code (click to enlarge)
        <qr-code
          :value="urls.lnd.restTor.replace(/cert=(.*)&/gm, '')"
          :size="300"
          class="qr-image mt-2"
          show-logo
          :style="{ cursor: 'pointer' }"
          @click="
            $emit('showQrModal', urls.lnd.restTor.replace(/cert=(.*)&/gm, ''))
          "
        ></qr-code>
      </step>
      <step> Check <span class="font-weight-bold">"Use Tor"</span>. </step>
      <step>
        Tap <span class="font-weight-bold">"Save Node Config"</span>.
      </step>
      <step>
        Tap
        <span class="font-weight-bold">"I understand, save my node config"</span
        >.
      </step>
      <step>
        Congratulations! You have successfully connected Zeus to your Citadel.
      </step>
    </step-list>
    <hr />
    <p class="text-muted">Or manually enter the following details</p>
    <step-list>
      <step>
        In the <span class="font-weight-bold">"Host"</span>, enter
        <input-copy
          :value="
            'https://' +
            urls.lnd.restTor.substring(13).split('.onion')[0] +
            '.onion'
          "
          auto-width
        ></input-copy>
      </step>
      <step>
        In the <span class="font-weight-bold">"REST Port"</span>, enter
        <input-copy class="my-1" value="8080" auto-width></input-copy>
      </step>
      <step>
        In the <span class="font-weight-bold">"Macaroon (Hex format)"</span>,
        enter
        <input-copy class="my-1" :value="macaroonHex"></input-copy>
      </step>
      <step> Check <span class="font-weight-bold">"Use Tor"</span>. </step>
      <step>
        Tap <span class="font-weight-bold">"Save Node Config"</span>.
      </step>
      <step>
        Tap
        <span class="font-weight-bold">"I understand, save my node config"</span
        >.
      </step>
      <step>
        Congratulations! You have successfully connected Zeus to your Citadel.
      </step>
    </step-list>
  </connection-details>
</template>

<script>
import ConnectionDetails from "@/components/ConnectWallet/ConnectionDetails.vue";
import StepList from "@/components/ConnectWallet/StepList.vue";
import Step from "@/components/ConnectWallet/Step.vue";
import InputCopy from "@/components/Utility/InputCopy.vue";
import QrCode from "@/components/Utility/QrCode.vue";
import BufferModule from "buffer/index.js";
const { Buffer } = BufferModule;

export default {
  components: {
    ConnectionDetails,
    StepList,
    Step,
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
  computed: {
    macaroonHex() {
      return Buffer.from(
        Array.from(
          this.urls.lnd.restTor.matchAll(/macaroon=(.*)/gm),
          (m) => m[1]
        )[0],
        "base64"
      ).toString("hex");
    },
  },
};
</script>
