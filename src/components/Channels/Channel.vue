<template>
  <div class="py-3 px-3 px-lg-4 channel">
    <b-row>
      <b-col col cols="12" xl="3">
        <!-- on large screens -->
        <div class="d-none d-xl-block">
          <status :variant="statusVariant" size="sm">{{
            channel.status
          }}</status>
          <div>
            <span v-if="channel.remoteAlias">{{ channel.remoteAlias }}</span>
            <span
              v-else
              class="loading-placeholder loading-placeholder-sm d-block"
              style="width: 80%; margin-top: 8px"
            ></span>
          </div>
        </div>

        <!-- on small screens -->
        <div
          class="d-xl-none d-flex justify-content-between align-items-center mb-1"
        >
          <status :variant="statusVariant" size="sm">{{
            channel.status
          }}</status>
          <div>
            <small>{{ channel.remoteAlias }}</small>
          </div>
        </div>
      </b-col>
      <b-col col cols="12" xl="9">
        <div class>
          <div class="d-flex justify-content-between">
            <span
              v-tooltip.right="
                $filters
                  .satsToUSD(channel.localBalance, bitcoinStore)
                  .toString()
              "
              class="text-primary font-weight-bold"
              >{{
                $filters.localize(
                  $filters.unit(channel.localBalance, systemStore) as number,
                )
              }}
              {{ $filters.formatUnit(systemStore.unit) }}</span
            >
            <span
              v-tooltip.left="
                $filters
                  .satsToUSD(channel.remoteBalance, bitcoinStore)
                  .toString()
              "
              class="text-success text-end font-weight-bold"
              >{{
                $filters.localize(
                  $filters.unit(channel.remoteBalance, systemStore) as number,
                )
              }}
              {{ $filters.formatUnit(systemStore.unit) }}</span
            >
          </div>
          <bar
            :local="Number(channel.localBalance)"
            :remote="Number(channel.remoteBalance)"
            class="my-1"
          ></bar>
          <div class="d-flex justify-content-between">
            <small class="text-muted font-weight-bold">Max Send</small>
            <small class="text-muted font-weight-bold text-end"
              >Max Receive</small
            >
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

import status from '../Utility/Status.vue';
import Bar from './Bar.vue';
import useSystemStore from '../../store/system';
import useBitcoinStore from '../../store/bitcoin';

const props = defineProps({
  channel: {
    type: Object,
    required: true,
  },
});
const bitcoinStore = useBitcoinStore();
const systemStore = useSystemStore();
const statusVariant = computed(() => {
  switch (props.channel.status) {
    case 'Online':
      return 'success';
    case 'Opening':
      return 'warning';
    case 'Closing':
    case 'unknown':
      return 'danger';
    case 'Offline':
    default:
      return 'default';
  }
});
</script>

<style lang="scss" scoped>
@media (prefers-color-scheme: light) {
  .channel:hover {
    box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.08);
  }
}

.channel {
  transition: box-shadow 0.3s, background 0.3s ease;
  &:hover {
    cursor: pointer;
  }
}
</style>
