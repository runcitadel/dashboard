<template>
  <div class="channel-list-container">
    <div class="channel-list">
      <div
        v-if="lightningStore.channels.length === 0"
        class="d-flex align-items-center justify-content-center flex-column"
        style="height: 100%"
      >
        <p class="text-muted w-75 text-center">
          You need to open payment channels with other nodes to transact on the
          Lightning Network.
          <br />When you open a channel, the balance is automatically deducted
          from your Bitcoin wallet and credited to your Lightning wallet.
        </p>
      </div>

      <div
        v-else-if="lightningStore.channels[0]['type'] === 'loading'"
        class="d-flex align-items-center justify-content-center"
        style="height: 100%"
      >
        <b-spinner class="mb-4" variant="dark"></b-spinner>
      </div>

      <transition-group v-else name="list" appear>
        <div
          v-for="channel in lightningStore.channels"
          :key="(channel as {channelPoint: string}).channelPoint"
          @click="$emit('selectchannel', channel)"
        >
          <channel :channel="channel"></channel>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useLightningStore from '../../store/lightning';
import Channel from './Channel.vue';

defineEmits(['selectchannel']);
const lightningStore = useLightningStore();
</script>

<style lang="scss" scoped>
html[data-theme='dark'] {
  .channel-list-container {
    &:before {
      background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        #2a3244
      ) !important;
    }

    &:after {
      background-image: linear-gradient(
        to top,
        rgba(255, 255, 255, 0),
        #2a3244
      ) !important;
    }
  }
}

.channel-list-container {
  overflow: hidden;
  position: relative;

  //bottom fade
  &:before {
    //nice faded white so the discarded blocks don't abruptly cut off
    content: '';
    position: absolute;
    height: 2rem;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 2;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    );
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }

  //top fade
  &:after {
    //nice faded white so the discarded blocks don't abruptly cut off
    content: '';
    position: absolute;
    height: 2rem;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    );
  }
}
.channel-list {
  height: 23rem; //to do: change to max-height
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch; //momentum scroll on iOS
}

.tweet-btn {
  background-color: rgb(29, 161, 242);
  color: #fff;
  &:hover {
    background: #0c7abf;
    color: #fff;
  }
}

//list transitions

.list-enter-active,
.list-leave-active {
  transition: transform 0.8s, opacity 0.8s ease;
}
.list-enter-from {
  transform: translate3d(0, 10px, 0);
  opacity: 0;
}
.list-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.list-leave {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.list-leave-to {
  transform: translate3d(0, 10px, 0);
  opacity: 0;
}
</style>
