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

      <label v-if="totpEnabled" class="mt-3 mb-0"
        >Enter your two-factor authentication code</label
      >
      <div class="seed-input-otp-container">
        <input-otp-token
          v-if="totpEnabled"
          :error="isIncorrectTotp"
          :disabled="isLoadingSeed"
          @otp-token="setTotpToken"
        />
      </div>

      <div v-show="isIncorrectPassword" class="mt-3">
        <small class="text-danger error">Incorrect password</small>
      </div>

      <div v-show="isIncorrectTotp" class="mt-2">
        <small class="text-danger error">Incorrect code</small>
      </div>

      <b-button
        variant="success"
        class="mt-3 mb-2"
        :disabled="buttonEnabled"
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
import { defineComponent } from "vue";

import InputPassword from "./Utility/InputPassword.vue";
import InputOtpToken from "./Utility/InputOtpToken.vue";
import Seed from "./Utility/Seed.vue";
import useUserStore from "../store/user";
import delay from "../helpers/delay";

export default defineComponent({
  components: {
    InputPassword,
    InputOtpToken,
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
      totpToken: "",
      isIncorrectPassword: false,
      isIncorrectTotp: false,
      isLoadingSeed: false,
    };
  },
  computed: {
    seed(): string[] {
      return this.userStore.seed;
    },
    totpEnabled(): boolean {
      return this.userStore.totpEnabled;
    },
    buttonEnabled(): boolean {
      return (
        this.isLoadingSeed ||
        !this.password ||
        (this.totpEnabled && (!this.totpToken || this.isIncorrectTotp))
      );
    },
  },
  methods: {
    setTotpToken(totpToken) {
      this.totpToken = totpToken;
    },
    showSeed() {
      (this.$refs["seed-modal"] as { show: () => void }).show();
    },
    async fetchSeed() {
      this.isLoadingSeed = true;
      this.isIncorrectPassword = false;

      try {
        await this.userStore.getSeed({
          password: this.password,
          totpToken: this.totpToken,
        });
      } catch (error) {
        console.error(error);
        const errorString = String(error);
        const isIncorrectPassword = errorString.includes("Incorrect password");
        const isIncorrectTotp = errorString.includes("Incorrect 2FA code");

        this.isIncorrectPassword = isIncorrectPassword;
        this.isIncorrectTotp = isIncorrectTotp;
      }

      this.isLoadingSeed = false;

      // hide TOTP error message after interval
      await delay(3000);
      this.isIncorrectTotp = false;
    },
  },
});
</script>
