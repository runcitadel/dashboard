<template>
  <b-input-group :class="inputGroupClass">
    <input
      :class="inputClass"
      :placeholder="placeholder"
      :type="showPassword ? 'text' : 'password'"
      :value="modelValue"
      :disabled="disabled"
      @input="
        $emit('update:modelValue', ($event.target as HTMLOptionElement).value)
      "
    />
    <b-input-group-append>
      <b-button
        class="show-password"
        :disabled="disabled"
        @click="toggleShowPassword"
      >
        <HiddenIcon v-if="showPassword" />
        <VisibleIcon v-else />
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script lang="ts" setup>
import {
  HiddenIcon,
  VisibleIcon,
} from '@bitcoin-design/bitcoin-icons-vue/filled/esm/index.js';
import {type PropType, ref} from 'vue';

const showPassword = ref(false);
defineProps({
  modelValue: {
    type: String,
    required: true,
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
});
defineEmits(['update:modelValue']);
function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
</script>

<style scoped lang="scss">
.show-password {
  position: absolute;
  height: 100%;
  right: 0;
  background: none;
  color: var(--bs-body-color);
  &:hover {
    background: none;
    color: var(--bs-btn-hover-color);
  }
}
</style>
