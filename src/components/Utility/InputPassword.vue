<template>
  <b-input-group :class="inputGroupClass">
    <!-- Todo: make it work with b-form-input + v-model -->
    <input
      :class="inputClass"
      :placeholder="placeholder"
      :type="showPassword ? 'text' : 'password'"
      :value="value"
      :disabled="disabled"
      @input="$emit('input', ($event as any).target.value)"
    />
    <b-input-group-append>
      <b-button :disabled="disabled" @click="togglePassword">
        <HiddenIcon v-if="showPassword" />
        <VisibleIcon v-else />
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script lang="ts">
import {
  HiddenIcon,
  VisibleIcon,
  // @ts-expect-error No type definitions for this yet
} from '@bitcoin-design/bitcoin-icons-vue/filled/esm/index.js';
import {defineComponent, type PropType} from 'vue';

export default defineComponent({
  components: {
    HiddenIcon,
    VisibleIcon,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    inputClass: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    inputGroupClass: {
      type: String,
      default: 'card-input-group',
    },
    placeholder: {
      type: String,
      default: 'password',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input'],
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
});
</script>
