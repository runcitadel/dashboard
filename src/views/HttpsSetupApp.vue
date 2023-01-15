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
      <h4 class="px-3 px-lg-4 pb-3">Configure HTTPS</h4>
      <b-form-radio
        v-model="selectedDomainOption"
        name="domain-type"
        value="runningcitadel"
        :disabled="!userStore.runningCitadelSettings.isSetup"
        >Use
        {{
          userStore.runningCitadelSettings.isSetup
            ? ` ${runningCitadelDomain}`
            : ' a runningcitadel.com subdomain'
        }}
        <a
          v-if="!userStore.runningCitadelSettings.isSetup"
          href="/https/setup-runningcitadel"
          >Configure</a
        >
      </b-form-radio>
      <b-form-radio
        v-model="selectedDomainOption"
        name="domain-type"
        value="custom-domain"
        class="my-1"
        >Use a custom domain</b-form-radio
      >
      <div
        v-if="selectedDomainOption == 'custom-domain'"
        class="px-3 px-lg-4 pb-3 mt-2"
      >
        <b-form-input
          v-model="domain"
          placeholder="Your domain"
          type="text"
          required
        ></b-form-input>
      </div>
      <b-button
        variant="success"
        class="mt-2"
        size="lg"
        type="submit"
        :disabled="
          !selectedDomainOption ||
          (selectedDomainOption == 'custom-domain' && !domain) ||
          (selectedDomainOption == 'runningcitadel' &&
            !userStore.runningCitadelSettings.isSetup)
        "
        @click="showFinishModal = true"
        >Continue</b-button
      >
    </div>

    <b-modal v-model="showFinishModal" @ok="finishSetup">
      <p v-if="selectedDomainOption == 'runningcitadel' && isPublicIp">
        <b-badge variant="warning" pill>Warning</b-badge>
        This will make your node <b>publicly</b> accessible at
        <b>{{ runningCitadelDomain }}</b>
        with the IP address {{ userStore.ipAddr }}. Are you sure you want to
        continue?
      </p>
      <p v-else-if="selectedDomainOption == 'runningcitadel'">
        <b-badge variant="warning" pill>Warning</b-badge>
        This will link the domain
        <b>{{ runningCitadelDomain }}</b>
        with the IP address {{ userStore.ipAddr }}. This IP address is only
        reachable in your local network, and will not make your node publicly
        accessible. Are you sure you want to continue?
      </p>
      <div v-else-if="selectedDomainOption == 'custom-domain'">
        <p>
          <b-badge variant="info">Info</b-badge>
          Please make sure you have enabled port forwarding on your router and
          configured your domain in such a way that your node is accessible at
          {{ domain }}. Port 80 should be accessible with TCP, and port 443
          should be accessible using both TCP and UDP.
        </p>
        <p>
          This needs to be done <b>before</b> continuing here to ensure
          certificates can be generated.
        </p>
      </div>
    </b-modal>
  </div>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import useSdkStore from '../store/sdk';
import useUserStore from '../store/user';
import {useRouter, useRoute} from 'vue-router';
import is_priv_ip from 'private-ip';

const selectedDomainOption = ref();
const domain = ref('');
const showFinishModal = ref(false);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const sdkStore = useSdkStore();

await userStore.getIpAddr();
await userStore.getRunningCitadelSettings();

async function finishSetup() {
  await sdkStore.citadel.auth.addDomain(
    route.params.app as string,
    selectedDomainOption.value == 'runningcitadel'
      ? runningCitadelDomain.value
      : domain.value,
  );
  router.push('/https');
}

const runningCitadelDomain = computed(() => {
  if (route.params.app == 'dashboard') {
    return `${userStore.runningCitadelSettings.subdomain}.runningcitadel.com`;
  } else {
    return `${route.params.app}.${userStore.runningCitadelSettings.subdomain}.runningcitadel.com`;
  }
});

const isPublicIp = computed(() => {
  return userStore.ipAddr && !is_priv_ip(userStore.ipAddr);
});
</script>
