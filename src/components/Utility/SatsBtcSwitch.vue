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
        'toggle-left': unit === 'sats',
        'toggle-right': unit === 'btc',
      }"
    >
      <span v-if="unit === 'sats'" class="text-muted">Sats</span>
      <span v-else-if="unit === 'btc'" class="text-muted">BTC</span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import useSystemStore from '../../store/system';

export default defineComponent({
  props: {
    size: {
      type: String, //sm, md, lg
      default: 'md',
    },
  },
  setup() {
    const systemStore = useSystemStore();
    return {systemStore};
  },
  data() {
    return {};
  },
  computed: {
    unit() {
      return this.systemStore.unit;
    },
  },
  methods: {
    toggleUnit() {
      this.systemStore.changeUnit(this.unit === 'sats' ? 'btc' : 'sats');
    },
  },
});
</script>
