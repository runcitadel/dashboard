<template>
  <div>
    <div class="p-sm-2">
      <div class="my-3">
        <div>
          <h1>{{ t('lightning-address.heading') }}</h1>
          <p>{{ t('lightning-address.subheading') }}</p>
        </div>
      </div>
    </div>
    <div class="px-3 px-lg-4 pb-3">
      <step-list>
        <step>
          {{ t('lightning-address.step-1-part-1')
          }}<b-link to="/app-store/lnme">LnMe</b-link
          >{{ t('lightning-address.step-1-part-2') }}
        </step>
        <step>
          {{ t('lightning-address.step-2') }}
          <input-copy class="my-1" :value="lnAddress"></input-copy>
        </step>
        <p>
          {{ t('lightning-address.optional-steps') }}
        </p>
        <step>{{ t('lightning-address.step-3') }}</step>
        <step>
          {{ t('lightning-address.step-4-part-1')
          }}<a href="https://getalby.com/">Alby</a
          >{{ t('lightning-address.step-4-part-2') }}</step
        >
        <step>
          {{ t('lightning-address.step-5-part-1') }}
          <a href="https://sats4.me/">sats4me</a>
          {{ t('lightning-address.step-5-part-2') }}

          <input-copy class="my-1" :value="lnmeAddress" />
        </step>
      </step-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StepList from '../components/ConnectWallet/StepList.vue';
import Step from '../components/ConnectWallet/Step.vue';
import InputCopy from '../components/Utility/InputCopy.vue';
import useAppsStore from '../store/apps';
import {computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const appsStore = useAppsStore();
const lnAddress = computed(() => {
  try {
    // Get the app from state.apps.installed where the ID is lnme
    const address = appsStore.installed.find(
      (app) => app.id === 'lnme',
    )?.hiddenService;

    return address
      ? `tips@${address}`
      : t('lightning-address.placeholder-lnme');
  } catch {
    return t('lightning-address.placeholder-lnme');
  }
});

const lnmeAddress = computed(() => {
  try {
    // Get the app from state.apps.installed where the ID is lnme
    return (
      appsStore.installed.find((app) => app.id === 'lnme')?.hiddenService ||
      t('lightning-address.placeholder-lnme')
    );
  } catch {
    return t('lightning-address.placeholder-lnme');
  }
});

onMounted(() => {
  appsStore.getInstalledApps();
});
</script>
