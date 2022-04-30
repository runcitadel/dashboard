<template>
  <span class="d-flex">
    <span ref="number"></span>
    {{ suffix }}
  </span>
</template>

<script lang="ts" setup>
import {CountUp, CountUpOptions} from 'countup.js';
import {PropType, ref, watchEffect} from 'vue';

const typeOf = (type: string) => (object: unknown) =>
  Object.prototype.toString.call(object) === `[object ${type}]`;
const isFunction = typeOf('Function');

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
const number = ref<HTMLSpanElement | null>(null);

watchEffect(() => {
  if (previousValue.value?.decimalPlaces !== props.value.decimalPlaces) {
    destroy();
    startVal.value = 0;
    create();
    previousValue.value = props.value;
  } else {
    if (previousValue.value.endVal !== props.value.endVal) {
      update(props.value.endVal);
      previousValue.value = props.value;
    }
  }
});

function create() {
  if (instance.value) {
    return;
  }
  const dom = number.value as HTMLSpanElement;
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

  const _instance = new CountUp(dom, props.value.endVal, options);
  if (_instance.error) {
    // error
    return;
  }
  instance.value = _instance;
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
  if (instance.value && isFunction(instance.value.update)) {
    return instance.value.update(newEndVal);
  }
}
</script>

<style lang="scss" scoped>
span {
  word-break: break-all;
}
</style>
