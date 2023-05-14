<template>
  <div class="toggle" :class="`toggle-${size}`" @click="toggleUnit">
    <div
      class="toggle-bg-text justify-content-center d-flex align-items-center"
    >
      <span class="text-center">Sats</span>
      <span class="text-center">BTC</span>
    </div>
    <div
      class="toggle-switch justify-content-center d-flex align-items-center"
      :class="{
        'toggle-left': systemStore.unit === 'sats',
        'toggle-right': systemStore.unit === 'btc',
      }"
    >
      <span v-if="systemStore.unit === 'sats'" class="text-body-secondary">Sats</span>
      <span v-else-if="systemStore.unit === 'btc'" class="text-body-secondary">BTC</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {PropType} from 'vue';
import useSystemStore from '../../store/system';

defineProps({
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md',
  },
});
const systemStore = useSystemStore();

function toggleUnit() {
  systemStore.changeUnit(systemStore.unit === 'sats' ? 'btc' : 'sats');
}
</script>
