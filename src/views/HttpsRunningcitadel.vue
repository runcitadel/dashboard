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
    <div>
      <div class="pb-3">
        Your runningcitadel.com domain can not be set up directly on the
        dashboard. Please visit
        <a href="https://runningcitadel.com/register"
          >runningcitadel.com/register</a
        >, choose a domain and and enter the following data:
      </div>
      <label class="mb-1 mt-2" for="login-id">Login ID:</label>
      <InputCopy
        id="login-id"
        :value="userStore.runningCitadelSettings.username"
      />
      <label class="mb-1 mt-2" for="login-secret">Login secret:</label>
      <InputCopy
        id="login-secret"
        :value="userStore.runningCitadelSettings.password"
      />
      <b-button
        variant="success"
        class="mt-2"
        size="lg"
        type="submit"
        @click="finishSetup"
        >Continue</b-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import useUserStore from '../store/user';
import {useRouter} from 'vue-router';
import InputCopy from '../components/Utility/InputCopy.vue';

const router = useRouter();
const userStore = useUserStore();

await userStore.getLetsEncryptSettings();
await userStore.getRunningCitadelSettings();

async function finishSetup() {
  await userStore.getRunningCitadelSettings();
  if (!userStore.runningCitadelSettings.isSetup) {
    alert(
      'Something went wrong! Please make sure you register on runningcitadel.com',
    );
    return;
  }
  router.back();
}
</script>
