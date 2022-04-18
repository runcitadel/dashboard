<template>
  <div
    class="d-flex flex-column align-items-center justify-content-center min-vh100 p-2"
  >
    <img
      alt="Citadel"
      src="@/assets/logo.svg"
      height="200"
      class="mb-5 logo"
      :class="hasShutdown ? 'logo-gray' : ''"
    />
    <span class="text-muted w-75 text-center">
      <small v-if="hasShutdown"
        >Shutdown complete. You can now safely unplug your Citadel from the
        power and internet.</small
      >
      <small v-else-if="shuttingDown">
        <b-spinner small class="me-2"></b-spinner>Shutting down...
      </small>
      <small v-else-if="rebooting">
        <b-spinner small class="me-2"></b-spinner>Rebooting...
      </small>
    </span>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    hasShutdown: Boolean,
    shuttingDown: Boolean,
    rebooting: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.logo {
  height: 20vh;
  max-height: 200px;
  width: auto;
  transition: filter 0.3s ease;
  &.logo-gray {
    filter: grayscale(100%);
  }
}
</style>
