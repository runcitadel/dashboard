<template>
  <b-modal
    id="channel-selector-modal"
    ref="mainModal"
    centered
    hide-footer
    scrollable
  >
    <template #modal-header="{close}">
      <div class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100">
        <h3>features</h3>
        <!-- Emulate built in modal header close button action -->
        <a href="#" class="align-self-center" @click.stop.prevent="close">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.6003 4.44197C13.3562 4.19789 12.9605 4.19789 12.7164 4.44197L9.02116 8.1372L5.32596 4.442C5.08188 4.19792 4.68615 4.19792 4.44207 4.442C4.198 4.68607 4.198 5.0818 4.44207 5.32588L8.13728 9.02109L4.44185 12.7165C4.19777 12.9606 4.19777 13.3563 4.44185 13.6004C4.68592 13.8445 5.08165 13.8445 5.32573 13.6004L9.02116 9.90497L12.7166 13.6004C12.9607 13.8445 13.3564 13.8445 13.6005 13.6004C13.8446 13.3563 13.8446 12.9606 13.6005 12.7165L9.90505 9.02109L13.6003 5.32585C13.8444 5.08178 13.8444 4.68605 13.6003 4.44197Z"
              fill="#6c757d"
            />
          </svg>
        </a>
      </div>
    </template>
    <div class="card-grid" :class="columnClass">
      <card-widget
        :highlighted="selected === 'stable'"
        header="Stability: "
        :status="{text: 'Most stable', variant: 'success', blink: false}"
        title="stable"
        sub-title="The most stable features"
      >
        <div class="px-3 px-lg-4 pb-3 channel-info">
          <ul>
            <li>All stable features</li>
            <li>Stable apps with all security updates</li>
            <li>Less bugs</li>
            <li>Mostly stable</li>
          </ul>
          <b-button
            v-if="selected !== 'stable'"
            variant="primary"
            class="channel-button"
            @click="selectChannel('stable')"
            >Select this channel</b-button
          >
          <b-button v-else variant="success" disabled class="channel-button"
            >Current channel</b-button
          >
        </div>
      </card-widget>
      <card-widget
        :highlighted="selected === 'beta'"
        header="Stability: "
        :status="{text: 'Preview', variant: 'primary', blink: false}"
        title="beta"
        sub-title="Early access to new features"
      >
        <div class="px-3 px-lg-4 pb-3 channel-info">
          <ul>
            <li>Latest features</li>
            <li>New apps</li>
            <li>Earlier app updates</li>
            <li>May have more bugs</li>
          </ul>
          <b-button
            v-if="selected !== 'beta'"
            variant="primary"
            class="channel-button"
            @click="selectChannel('beta')"
            >Select this channel</b-button
          >
          <b-button v-else variant="success" disabled class="channel-button"
            >Current channel</b-button
          >
        </div>
      </card-widget>
      <card-widget
        :highlighted="selected === 'core-ln'"
        header="Stability: "
        :status="{text: 'Experimental', variant: 'warning', blink: false}"
        title="core lightning"
        sub-title="An alternative Lightning backend"
      >
        <div class="px-3 px-lg-4 pb-3 channel-info">
          <ul>
            <li>More Lightning-related features like bolt12</li>
            <li>Less available apps</li>
            <li>Unstable, bugs will occur</li>
            <li>Wallet and channels can not be migrated</li>
          </ul>
          <b-button
            v-if="selected !== 'core-ln'"
            variant="primary"
            class="channel-button"
            @click="selectChannel('core-ln')"
            >Select this channel</b-button
          >
          <b-button v-else variant="success" disabled class="channel-button"
            >Current channel</b-button
          >
        </div>
      </card-widget>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import {watch, ref, nextTick, onUpdated} from 'vue';
import CardWidget from './CardWidget.vue';

const mainModal = ref<null | {show: () => void; hide: () => void}>();
const selected = ref<'stable' | 'beta' | 'core-ln'>('stable');
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});

const columnClass = ref('grid-1-column');

const getCorrectSize = () => {
  const width = document.querySelector('#channel-selector-modal .modal-content')
    ?.clientWidth as number;
  console.log(width);
  if (width > 900) {
    columnClass.value = 'grid-3-column';
  } else if (width > 600) {
    columnClass.value = 'grid-2-column';
  } else {
    columnClass.value = 'grid-1-column';
  }
};

watch([props], async () => {
  if (props.showModal) {
    mainModal.value?.show();
    await nextTick();
    await nextTick();
    getCorrectSize();
    window.addEventListener('resize', getCorrectSize);
  } else {
    mainModal.value?.hide();
    window.removeEventListener('resize', getCorrectSize);
  }
});

function selectChannel(channel: 'stable' | 'beta' | 'core-ln') {
  selected.value = channel;
}

onUpdated(() => {
  getCorrectSize();
});
</script>
<style lang="scss" scoped>
.grid-1-column {
  grid-template-columns: 1fr;
}

.grid-2-column {
  grid-template-columns: 1fr 1fr;
}
.grid-3-column {
  grid-template-columns: 1fr 1fr 1fr;
}

.channel-button {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3rem;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.channel-info {
  // 3rem for the button and 1 to leave some more space
  margin-bottom: 4rem;
}
</style>
