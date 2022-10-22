<template>
  <span class="d-flex">
    <span ref="numberSpan"></span>
    {{ suffix }}
  </span>
</template>

<script lang="ts" setup>
import {CountUp, type CountUpOptions} from 'countup.js';
import {PropType, ref, watch, onMounted} from 'vue';

const props = defineProps({
  delay: {
    type: Number,
    required: false,
    default: 0,
  },
  value: {
    type: Object as PropType<{decimalPlaces: number; endVal: number}>,
    required: true,
  },
  options: {
    type: Object as PropType<CountUpOptions>,
    required: false,
    default: () => {
      return {};
    },
  },
  suffix: {
    type: String,
    required: false,
    default: '',
  },
  countOnLoad: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['ready']);

const startVal = ref(0);
const instance = ref<CountUp | null>(null);
// Used to decide if animate/count on the first mount
const firstLoad = ref(true);
const previousValue = ref<{decimalPlaces: number; endVal: number} | null>(null);
const numberSpan = ref<HTMLSpanElement | null>(null);

watch([props], () => {
  if (previousValue.value?.decimalPlaces !== props.value.decimalPlaces) {
    destroy();
    startVal.value = 0;
    create();
  } else {
    if (previousValue.value.endVal !== props.value.endVal) {
      update(props.value.endVal);
    }
  }
  previousValue.value = props.value;
});

onMounted(() => {
  instance.value = null;
  firstLoad.value = true;
  create();
});

function create() {
  if (instance.value) {
    return;
  }
  const dom = numberSpan.value as HTMLSpanElement;
  const options = props.options || {};

  if (firstLoad.value) {
    if (props.countOnLoad) {
      startVal.value = 0;
    } else {
      startVal.value = props.value.endVal;
    }
  }
  options.decimalPlaces = props.value.decimalPlaces || 0;

  options.startVal = startVal.value;

  // Get this based on browser locale
  let separator = (12345).toLocaleString().match(/12(.*)345/);
  let decimalSeparator = (12345.6789).toLocaleString().match(/345(.*)67/);
  options.separator = separator?.at(1)?.length === 1 ? separator!.at(1) : ',';
  options.decimal =
    decimalSeparator?.at(1)?.length === 1 ? decimalSeparator!.at(1) : '.';

  instance.value = new CountUp(dom, props.value.endVal, options);

  if (instance.value.error) {
    // error
    return;
  }
  if (props.delay < 0) {
    emit('ready', instance, CountUp);
    return;
  }
  setTimeout(() => {
    instance.value?.start(() => emit('ready', instance, CountUp));
    firstLoad.value = false;
  }, props.delay);
}

function destroy() {
  instance.value = null;
}

function update(newEndVal: number) {
  if (instance.value) {
    return instance.value.update(newEndVal);
  }
}
</script>

<style lang="scss" scoped>
span {
  word-break: break-all;
}
</style>
