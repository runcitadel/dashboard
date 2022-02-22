<template>
  <span class="d-flex">
    <span ref="number"></span>
    {{ suffix }}
    <!-- <small>{{ endVal }}</small> -->
  </span>
</template>

<script>
import { CountUp } from "countup.js";
const typeOf = (type) => (object) =>
  Object.prototype.toString.call(object) === `[object ${type}]`;
const isFunction = typeOf("Function");
export default {
  components: {},
  props: {
    delay: {
      type: Number,
      required: false,
      default: 0,
    },
    value: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
    suffix: {
      type: String,
      required: false,
      default: "",
    },
    countOnLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      startVal: 0,
      instance: null,
      firstLoad: true, //used to decide if animate/count on the first mount
    };
  },
  computed: {},
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal.decimalPlaces !== oldVal.decimalPlaces) {
          this.destroy();
          this.startVal = 0;
          this.create();
        } else {
          if (newVal.endVal !== oldVal.endVal) {
            this.update(newVal.endVal);
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.create();
  },
  beforeUnmount() {
    this.destroy();
  },
  methods: {
    create() {
      if (this.instance) {
        return;
      }
      const dom = this.$refs.number;
      const options = this.options || {};

      if (this.firstLoad) {
        if (this.countOnLoad) {
          this.startVal = 0;
        } else {
          this.startVal = this.value.endVal;
        }
      }
      options.decimalPlaces = this.value.decimalPlaces || 0;

      options.startVal = this.startVal;

      const instance = new CountUp(dom, this.value.endVal, options);
      if (instance.error) {
        // error
        return;
      }
      this.instance = instance;
      if (this.delay < 0) {
        this.$emit("ready", instance, CountUp);
        return;
      }
      setTimeout(() => {
        instance.start(() => this.$emit("ready", instance, CountUp));
        this.firstLoad = false;
      }, this.delay);
    },
    destroy() {
      this.instance = null;
    },
    printValue(value) {
      if (this.instance && isFunction(this.instance.printValue)) {
        return this.instance.printValue(value);
      }
    },
    start(callback) {
      if (this.instance && isFunction(this.instance.start)) {
        return this.instance.start(callback);
      }
    },
    pauseResume() {
      if (this.instance && isFunction(this.instance.pauseResume)) {
        return this.instance.pauseResume();
      }
    },
    reset() {
      if (this.instance && isFunction(this.instance.reset)) {
        return this.instance.reset();
      }
    },
    update(newEndVal) {
      if (this.instance && isFunction(this.instance.update)) {
        return this.instance.update(newEndVal);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  word-break: break-all;
}
</style>
