<template>
  <div>
    <div class="p-sm-2">
      <div class="my-3">
        <div>
          <h1>lightning address</h1>
          <p>Get a Lightning address to receive tips to your Citadel</p>
        </div>
      </div>
    </div>
    <card-widget :header="`Here's how to get your Lightning address`">
      <div class="px-3 px-lg-4 pb-3">
        <step-list>
          <step>
            Install the
            <b-link to="/app-store/lnme">LnMe</b-link> app on your Citadel.
          </step>
          <step>
            You can now sent tips to this address:

            <input-copy class="my-1" :value="'tips@' + lnmeUrl"></input-copy>
          </step>
          <step>
            The following steps are optional, but if this Lightning address is
            too long for you (and .onion addresses don't work everywhere), you
            can get a free @ln.runcitadel.space address if you're on Twitter.
          </step>
          <step> First, you need a Twitter account. </step>
          <step> Add a 🏰 emoji to your Twitter name.</step>
          <step>
            DM <a href="https://twitter.com/runcitadel">@runcitadel</a> on
            Twitter with your "long" Lightning address and the name you want to
            have for your new one.
          </step>
          <step>
            We'll get back to you with a new Lightning address soon.
          </step>
        </step-list>
      </div>
    </card-widget>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StepList from "@/components/ConnectWallet/StepList";
import Step from "@/components/ConnectWallet/Step";
import InputCopy from "@/components/Utility/InputCopy";

export default {
  computed: {
    ...mapState({
      lnAddress: (state) => {
        try {
          // Get the app from state.apps.installed where the ID is lnme
          return (
            "tips@" +
              state.apps.installed.find((app) => app.id === "lnme")
                .hiddenService || "None yet, please install LnMe first."
          );
        } catch {
          return "None yet, please install LnMe first.";
        }
      },
    }),
  },
  created() {
    this.$store.dispatch("apps/getInstalledApps");
  },
  components: {
    StepList,
    Step,
    InputCopy,
  },
};
</script>
