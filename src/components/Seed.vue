<template>
  <div class="px-2 px-sm-3 pb-2 pb-sm-3">
    <div v-if="!seed.length">
      <input-password
        ref="password"
        v-model="password"
        placeholder="Password"
        input-group-class="neu-input-group"
        :input-class="[
          isIncorrectPassword ? 'incorrect-password' : '',
          'form-control form-control-lg neu-input w-100',
        ]"
        :disabled="isLoadingSeed"
      />

      <small
        v-show="isIncorrectPassword"
        class="mt-2 text-danger error float-right"
        >Incorrect password</small
      >

      <b-button
        variant="success"
        class="mt-3 mb-2"
        :disabled="password && isLoadingSeed"
        @click="fetchSeed"
      >
        {{ isLoadingSeed ? "Decrypting Secret Words..." : "View Secret Words" }}
      </b-button>
    </div>

    <div v-else class="d-flex justify-content-center">
      <!-- Seed phrase -->
      <seed v-if="seed.length" :words="seed"></seed>
      <b-spinner v-else></b-spinner>
    </div>
  </div>
</template>

<script lang="ts">
import InputPassword from "./Utility/InputPassword.vue";
import Seed from "./Utility/Seed.vue";
import useUserStore from "../store/user";

import { defineComponent } from "vue";

export default defineComponent({
  components: {
    InputPassword,
    Seed,
  },
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      password: "",
      isIncorrectPassword: false,
      isLoadingSeed: false,
    };
  },
  computed: {
    seed(): string[] {
      return this.userStore.seed;
    },
  },
  methods: {
    showSeed() {
      (this.$refs["seed-modal"] as { show: () => void }).show();
    },
    async fetchSeed() {
      this.isLoadingSeed = true;
      try {
        await this.userStore.getSeed(this.password);
      } catch (error) {
        this.isIncorrectPassword = true;
      }
      this.isLoadingSeed = false;
    },
  },
});
</script>
