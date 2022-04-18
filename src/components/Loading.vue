<template>
  <div
    class="d-flex flex-column align-items-center justify-content-center min-vh100 p-2"
  >
    <img alt="Citadel" src="@/assets/logo.svg" height="200" class="mb-5 logo" />

    <b-progress
      :value="progress"
      class="mb-2 w-25"
      variant="primary"
      :style="{height: '4px'}"
      animated
      striped
    ></b-progress>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  props: {progress: {type: Number, default: 0}},
});
</script>

<style lang="scss">
.logo {
  height: 20vh;
  max-height: 200px;
  width: auto;
}
</style>
