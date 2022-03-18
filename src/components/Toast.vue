<template>
  <div class="custom-toast">
    <div class="title">{{ title }}</div>
    <div class="body">{{ body }}</div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: {
      required: true,
      type: String,
    },
    body: {
      required: false,
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  font-size: 1rem;
  font-weight: bold;
}
.body {
  font-size: 0.9rem;
}
</style>
