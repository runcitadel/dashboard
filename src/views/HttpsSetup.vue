<template>
  <div>
    <div class="p-sm-2">
      <div class="my-3">
        <div>
          <h1>https</h1>
          <p>Access your node securely</p>
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-column align-items-center justify-content-center p-2"
    >
      <h4 class="px-3 px-lg-4 pb-3">Get started</h4>
      <div class="px-3 px-lg-4 pb-3">
        This feature is powered by
        <a href="https://letsencrypt.org">Let's Encrypt</a>. To use it, please
        provide your email address and read and agree to their terms of service.
      </div>
      <div class="px-3 px-lg-4 pb-3">
        <form @submit.prevent="finishSetup">
          <b-form-input
            v-model="userStore.letsencryptSettings.email"
            placeholder="Email address"
            class="mb-2"
            type="email"
          ></b-form-input>
          <b-form-checkbox
            v-model="userStore.letsencryptSettings.agreed_lets_encrypt_tos"
            class="mb-4"
            >I have read and agree to Let's Encrypt's
            <a href="https://letsencrypt.org/repository/">terms of service</a>
            and
            <a href="https://letsencrypt.org/privacy/">privacy policy</a
            >.</b-form-checkbox
          >
          <b-button
            variant="success"
            class="mt-2"
            size="lg"
            type="submit"
            :disabled="
              !userStore.letsencryptSettings.agreed_lets_encrypt_tos ||
              !userStore.letsencryptSettings.email
            "
            >Save</b-button
          >
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useUserStore from '../store/user';
import {useRouter} from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

await userStore.getLetsEncryptSettings();
await userStore.getRunningCitadelSettings();

async function finishSetup() {
  await userStore.enableLetsEncrypt();
  router.push('/https');
}
</script>
