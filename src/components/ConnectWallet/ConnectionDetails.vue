<template>
  <b-alert
    v-if="bitcoinStore.percent < 99 && requires === 'bitcoind'"
    variant="warning"
    show
  >
    <svg class="icon-clock icon-clock-warning me-1" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" />
      <line x1="0" y1="0" x2="8" y2="0" class="hour" />
      <line x1="0" y1="0" x2="12" y2="0" class="minute" />
    </svg>
    You will be able to connect {{ name }} to your Citadel after Bitcoin Core
    has synchronized 100%.
  </b-alert>
  <b-alert
    v-else-if="requires === 'electrum' && !appsStore.hasElectrum"
    variant="warning"
    show
  >
    You need to install an Electrum server on your node to connect this wallet.
    We recommend using either
    <b-link to="/app-store/app/electrs">Electrs</b-link> or
    <b-link to="/app-store/app/fulcrum">Fulcrum</b-link>.
  </b-alert>
  <card-widget v-else :header="`Here's how to connect ${name} to your Citadel`">
    <div class="px-3 px-lg-4 pb-3">
      <slot></slot>
      <b-alert v-if="requires === 'electrum'" variant="info" show>
        Unable to connect to {{ name }}? Please check if your Electrum server is
        already synced to 100%.
      </b-alert>
    </div>
  </card-widget>
</template>

<script lang="ts" setup>
import {PropType} from 'vue';

import useAppsStore from '../../store/apps';
import useBitcoinStore from '../../store/bitcoin';
import CardWidget from '../CardWidget.vue';

defineProps({
  name: {
    type: String,
    required: true,
  },
  requires: {
    type: String as PropType<'' | 'electrum' | 'bitcoind' | 'lnd'>,
    default: '',
  },
});
const appsStore = useAppsStore();
const bitcoinStore = useBitcoinStore();
appsStore.getHasElectrum();
</script>

<style lang="scss" scoped></style>
