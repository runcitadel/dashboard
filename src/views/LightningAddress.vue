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
    <card-widget header="Here's how to get your Lightning address">
      <div class="px-3 px-lg-4 pb-3">
        <step-list>
          <step>
            Install the
            <b-link to="/app-store/lnme">LnMe</b-link> app on your Citadel.
          </step>
          <step>
            You can now sent tips to this address:

            <input-copy class="my-1" :value="lnAddress"></input-copy>
          </step>
          <step>
            The following steps are optional, but if you want a shorter
            Lightning address, a tipping page and a LNUrl, you can also set that
            up.
          </step>
          <step> First, you need at least one open lightning channel. </step>
          <step>
            Then, you need to set up the
            <a href="https://getalby.com/">Alby</a> extension and connect it to
            your node</step
          >
          <step>
            Now, you can visit <a href="https://sats4.me/">sats4me</a> and sign
            up there. As LnMe onion URL, please enter this:

            <input-copy class="my-1" :value="lnmeAddress" />
          </step>
          <step>
            We'll get back to you with a new Lightning address soon.
          </step>
        </step-list>
      </div>
    </card-widget>
  </div>
</template>

<script lang="ts" setup>
import StepList from '../components/ConnectWallet/StepList.vue';
import Step from '../components/ConnectWallet/Step.vue';
import InputCopy from '../components/Utility/InputCopy.vue';
import useAppsStore from '../store/apps';
import {computed, onMounted} from 'vue';

const appsStore = useAppsStore();
const lnAddress = computed(() => {
  try {
    // Get the app from state.apps.installed where the ID is lnme
    return (
      'tips@' +
        appsStore.installed.find((app) => app.id === 'lnme')?.hiddenService ||
      'None yet, please install LnMe first.'
    );
  } catch {
    return 'None yet, please install LnMe first.';
  }
});

const lnmeAddress = computed(() => {
  try {
    // Get the app from state.apps.installed where the ID is lnme
    return (
      appsStore.installed.find((app) => app.id === 'lnme')?.hiddenService ||
      'None yet, please install LnMe first.'
    );
  } catch {
    return 'None yet, please install LnMe first.';
  }
});

onMounted(() => {
  appsStore.getInstalledApps();
});
</script>
