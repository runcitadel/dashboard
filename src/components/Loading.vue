<template>
  <div
    class="d-flex flex-column align-items-center justify-content-center min-vh100 p-2"
  >
    <img alt="Citadel" src="@/assets/logo.svg" height="200" class="mb-5 logo" />

    <!-- <b-spinner class="my-4" variant="primary"></b-spinner> -->
    <b-progress
      :value="progress"
      class="mb-2 w-25"
      variant="primary"
      :style="{ height: '4px' }"
      animated
      striped
    ></b-progress>
    <slot></slot>
  </div>
</template>

<script>
export default {
  components: {},
  props: { progress: Number },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss">
.logo {
  height: 20vh;
  max-height: 200px;
  width: auto;
}
</style>
