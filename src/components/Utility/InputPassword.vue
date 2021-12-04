<template>
  <b-input-group :class="inputGroupClass">
    <!-- Todo: make it work with b-form-input + v-model -->
    <input
      :class="inputClass"
      :placeholder="placeholder"
      :type="showPassword ? 'text' : 'password'"
      :value="value"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
    />
    <b-input-group-append>
      <b-button :disabled="disabled" @click="togglePassword">
        <HiddenIcon v-if="showPassword" />
        <VisibleIcon v-else />
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import {
  HiddenIcon,
  VisibleIcon,
} from "@bitcoin-design/bitcoin-icons-vue/filled";
export default {
  components: {
    HiddenIcon,
    VisibleIcon,
  },
  props: {
    value: String,
    inputClass: [String, Array],
    inputGroupClass: {
      type: String,
      default: "card-input-group",
    },
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["input"],
  data() {
    return {
      state: {
        showPassword: false,
      },
    };
  },
  computed: {
    showPassword() {
      return this.state.showPassword;
    },
  },
  methods: {
    togglePassword() {
      return (this.state.showPassword = !this.state.showPassword);
    },
  },
};
</script>

<style lang="scss" scoped></style>
