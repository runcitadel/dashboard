<template>
  <div class="px-2 px-sm-3 pb-2 pb-sm-3">
    <!-- <span>Enter your password to view your 24-word seed phrase</span> -->
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

<script>
import InputPassword from "@/components/Utility/InputPassword";
import Seed from "@/components/Utility/Seed";
import { mapState } from "vuex";

export default {
  data() {
    return {
      password: "",
      isIncorrectPassword: false,
      isLoadingSeed: false,
    };
  },
  computed: {
    ...mapState({
      seed: (state) => state.user.seed,
    }),
  },
  components: {
    InputPassword,
    Seed,
  },
  props: { progress: Number },
  created() {},
  methods: {
    showSeed() {
      this.$refs["seed-modal"].show();
    },
    async fetchSeed() {
      this.isLoadingSeed = true;
      try {
        await this.$store.dispatch("user/getSeed", this.password);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data === "Incorrect password"
        ) {
          this.isIncorrectPassword = true;
        }
      }
      this.isLoadingSeed = false;
    },
  },
};
</script>

<style lang="scss"></style>
