<template>
  <div class="channel-bar" :style="style"></div>
</template>

<script lang="ts" setup>
import {PropType, computed} from 'vue';

const props = defineProps({
  local: {
    type: Number,
    required: true,
  },
  remote: {
    type: Number,
    required: true,
  },
  size: {
    type: String as PropType<'sm' | 'lg'>, //sm, lg
    default: 'sm',
  },
});

const style = computed(() => {
  const leftValue = props.local;
  const rightValue = props.remote;
  const leftPercent = Math.round((leftValue * 100) / (leftValue + rightValue));

  let background;
  if (leftPercent === 100) {
    background = `#6891aa`;
  } else if (leftPercent === 0) {
    background = `#00CD98`;
  } else {
    background = `linear-gradient(90deg, #6891aa 0%, #6891aa ${
      leftPercent - 7
    }%, #00CD98 ${leftPercent + 7}%, #00CD98 100%)`;
  }

  let height = '4px';
  let borderRadius = '4px';

  if (props.size === 'lg') {
    height = '8px';
    borderRadius = '8px';
  }

  return {
    background,
    height,
    borderRadius,
  };
});
</script>

<style lang="scss" scoped>
.channel-bar {
  height: 4px;
  border-radius: 4px;
}
</style>
