<template>
  <div>
    <router-view v-slot="{Component}">
      <transition name="change-page" mode="out-in">
        <KeepAlive>
          <Suspense>
            <!-- main content -->
            <component :is="Component"></component>

            <!-- loading state -->
            <template #fallback><loading :progress="99" /></template>
          </Suspense>
        </KeepAlive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import Loading from '../components/Loading.vue';
</script>

<style lang="scss" scoped>
// Page changing transitions
.change-page-enter-active,
.change-page-leave-active {
  transition: transform 0.4s, opacity 0.4s ease;
}
.change-page-enter-from {
  transform: translate3d(-40px, 0, 0);
  opacity: 0;
}
.change-page-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.change-page-leave {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.change-page-leave-to {
  transform: translate3d(40px, 0, 0);
  opacity: 0;
}
</style>
