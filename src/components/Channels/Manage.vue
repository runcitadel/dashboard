<template>
  <div>
    <div class="mb-4">
      <div class="d-flex justify-content-between">
        <h4
          v-b-tooltip.hover.right
          class="text-primary font-weight-bold"
          :title="
            $filters.satsToUSD(channel.localBalance, bitcoinStore).toString()
          "
        >
          {{ $filters.localize($filters.unit(channel.localBalance, systemStore) as number) }}
          {{ $filters.formatUnit(systemStore.unit) }}
        </h4>
        <h4
          v-b-tooltip.hover.left
          class="text-success font-weight-bold text-end"
          :title="
            $filters.satsToUSD(channel.remoteBalance, bitcoinStore).toString()
          "
        >
          {{ $filters.localize($filters.unit(channel.remoteBalance, systemStore) as number) }}
          {{ $filters.formatUnit(systemStore.unit) }}
        </h4>
      </div>
      <bar
        :local="Number(channel.localBalance)"
        :remote="Number(channel.remoteBalance)"
        size="lg"
        class="my-1"
      ></bar>
      <div class="d-flex justify-content-between">
        <b class="text-muted">Max Send</b>
        <b class="text-muted text-end">Max Receive</b>
      </div>
    </div>

    <transition name="mode-change" mode="out-in">
      <div v-if="!isReviewingChannelClose">
        <div
          class="d-flex justify-content-between align-items-center mt-1 mb-3"
        >
          <span class="text-muted">Status</span>
          <span class="text-capitalize font-weight-bold">{{
            channel.status
          }}</span>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">Channel Type</span>
          <span class="text-capitalize font-weight-bold"
            >{{ channel.private ? 'Private' : 'Public' }} Channel</span
          >
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">Remote Peer Alias</span>
          <div class="w-75 text-end">
            <span class="font-weight-bold" style="overflow-wrap: break-word">{{
              channel.remoteAlias
            }}</span>
          </div>
        </div>

        <div
          v-if="channel.status !== 'Closing'"
          class="d-flex justify-content-between align-items-center mb-3"
        >
          <span class="text-muted">Opened By</span>
          <span class="text-capitalize font-weight-bold">{{
            channel.initiator ? 'Your node' : 'Remote peer'
          }}</span>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">Local Balance</span>
          <span
            v-b-tooltip.hover.left
            :title="
              $filters.satsToUSD(channel.localBalance, bitcoinStore).toString()
            "
            class="text-capitalize font-weight-bold"
          >
            {{ $filters.localize($filters.unit(channel.localBalance, systemStore) as number) }}
            {{ $filters.formatUnit(systemStore.unit) }}
          </span>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">Remote Balance</span>
          <span
            v-b-tooltip.hover.left
            :title="
              $filters.satsToUSD(channel.remoteBalance, bitcoinStore).toString()
            "
            class="text-capitalize font-weight-bold"
          >
            {{ $filters.localize($filters.unit(channel.remoteBalance, systemStore) as number) }}
            {{ $filters.formatUnit(systemStore.unit) }}
          </span>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">Channel Capacity</span>
          <span
            v-b-tooltip.hover.left
            :title="
              $filters.satsToUSD(channel.capacity, bitcoinStore).toString()
            "
            class="text-capitalize font-weight-bold"
          >
            {{
              $filters.localize($filters.unit(channel.capacity, systemStore) as number)
            }}
            {{ $filters.formatUnit(systemStore.unit) }}
          </span>
        </div>

        <div
          v-if="channel.status === 'Online'"
          class="d-flex justify-content-between align-items-center mb-3"
        >
          <span class="text-muted">Withdrawal Timelock</span>
          <span class="text-capitalize font-weight-bold"
            >{{ parseInt(channel.csvDelay).toLocaleString() }} Blocks</span
          >
        </div>

        <div
          v-if="channel.status === 'Online'"
          class="d-flex justify-content-between align-items-center mb-3"
        >
          <span class="text-muted">Commit Fee</span>
          <span class="text-capitalize font-weight-bold">
            {{ $filters.localize($filters.unit(channel.commitFee, systemStore) as number) }}
            {{ $filters.formatUnit(systemStore.unit) }}
          </span>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">Remote Pub Key</span>
          <div class="w-75 text-end">
            <small class="font-weight-bold" style="overflow-wrap: break-word">{{
              channel.remotePubkey
            }}</small>
          </div>
        </div>

        <div v-if="canCloseChannel" class="d-flex justify-content-end">
          <b-button class="mt-2" variant="danger" @click="reviewChannelClose"
            >Close Channel</b-button
          >
        </div>
      </div>

      <div v-else>
        <h3 class="mb-3">Are you sure you want to close this channel?</h3>
        <p>
          Your local channel balance of
          <b>{{ parseInt(channel.localBalance).toLocaleString() }} Sats</b>
          (excluding transaction fee) will be returned to your Bitcoin wallet.
        </p>
        <b-alert variant="warning" show>
          It may take upto 24 hours to close this channel if the remote peer is
          not online. During this time, the peer can dispute the record sent to
          the blockchain and seize the channel funds if this claim is
          fraudulent.
        </b-alert>

        <div class="d-flex justify-content-end">
          <b-button
            class="mt-2"
            variant="danger"
            :disabled="isClosing"
            @click="confirmChannelClose"
            >{{ isClosing ? 'Closing Channel...' : 'Confirm Close' }}</b-button
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed} from 'vue';

import useBitcoinStore from '../../store/bitcoin';
import useSdkStore from '../../store/sdk';
import useSystemStore from '../../store/system';
import useToast from '../../utils/toast';

import Bar from '../Channels/Bar.vue';

const props = defineProps({
  channel: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['channelclose']);
const bitcoinStore = useBitcoinStore();
const sdkStore = useSdkStore();
const systemStore = useSystemStore();
const toast = useToast();
const isReviewingChannelClose = ref(false);
const isClosing = ref(false);

const canCloseChannel = computed(() => {
  if (
    props.channel.status === 'Opening' ||
    props.channel.status === 'Closing'
  ) {
    return false;
  }
  return true;
});
function reviewChannelClose() {
  isReviewingChannelClose.value = true;
}
async function confirmChannelClose() {
  isClosing.value = true;

  try {
    await sdkStore.citadel.middleware.lightning.channel.closeChannel(
      props.channel.channelPoint,
      !props.channel.active, // Avoids force closing if channel is active
    );
    emit('channelclose');
    setTimeout(() => {
      toast.success('Lightning Network', 'Channel closed');
    }, 200);
  } catch (err: unknown) {
    toast.error('Error', JSON.stringify(err));
  }
  isClosing.value = false;
}
</script>

<style lang="scss" scoped>
.mode-change-enter-active,
.mode-change-leave-active {
  transition: transform 0.3s, opacity 0.3s linear;
}

.mode-change-enter-from {
  transform: translate3d(20px, 0, 0);
  opacity: 0;
}

.mode-change-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

.mode-change-leave {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

.mode-change-leave-to {
  transform: translate3d(-20px, 0, 0);
  opacity: 0;
}
</style>
