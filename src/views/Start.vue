<template>
  <div>
    <div
      class="d-flex flex-column align-items-center justify-content-center min-vh100 p-2"
    >
      <img
        alt="Citadel"
        src="@/assets/logo.svg"
        height="200"
        class="mb-2 logo"
      />
      <h1 class="text-center mb-2">{{ heading }}</h1>
      <p class="text-muted w-75 text-center">{{ text }}</p>

      <div
        class="form-container mt-3 d-flex flex-column form-container w-100 align-items-center"
      >
        <b-form-input
          v-show="currentStep === 1"
          ref="name"
          v-model="name"
          placeholder="Your name"
          class="card-input w-100"
          autofocus
        ></b-form-input>

        <input-password
          v-show="currentStep === 2"
          ref="password"
          v-model="password"
          placeholder="Your password"
          input-class="card-input w-100"
        />

        <input-password
          v-show="currentStep === 3"
          ref="confirmPassword"
          v-model="confirmPassword"
          placeholder="Re-enter your password"
          input-class="card-input w-100"
        />

        <div v-show="currentStep === 5">
          <seed
            v-show="userStore.seed.length && !isRegistering"
            :words="userStore.seed"
            :recover="recover"
            @complete="finishedSeed"
            @incomplete="incompleteRecoverySeed"
            @input="inputRecoverySeed"
          ></seed>
          <b-spinner
            v-show="!userStore.seed.length || isRegistering"
          ></b-spinner>
        </div>

        <input-copy
          v-if="currentStep === 6"
          class="w-100"
          size="sm"
          :value="systemStore.onionAddress"
        ></input-copy>

        <div v-show="currentStep === 7">
          <div class="text-center bg-white p-3 rounded">
            <small class="d-block text-muted text-small text-center mb-3"
              >By clicking next, I agree that:</small
            >
            <span class="d-block text-muted text-small mb-1">
              <b-icon-exclamation-circle-fill
                variant="warning"
                class="me-1"
              />Citadel is in beta and should not be considered secure
            </span>
            <span class="d-block text-muted text-small mb-1">
              <b-icon-exclamation-circle-fill variant="warning" class="me-1" />I
              should not put more funds on my Citadel than I'm prepared to lose
            </span>
          </div>
        </div>

        <div v-show="currentStep === 8" class="text-center">
          <p class="text-muted">
            But you don't have to wait for the sync to complete... You can start
            using Citadel right away!
          </p>
          <a
            v-b-tooltip.hover.bottom
            href="#"
            title="Citadel uses neutrino while the sync is in progress, and automatically switches to Bitcoin Core once it's synced"
          >
            <small>
              <b-icon-exclamation-circle-fill
                icon="exclamation-circle-fill"
                variant="primary"
                class="me-1"
              />How?
            </small>
          </a>
        </div>

        <b-button
          variant="success"
          size="lg"
          :disabled="
            !isStepValid || isRegistering || !lightningStore.operational
          "
          class="mt-3 mx-auto d-block px-4"
          :class="{
            'loading-fade-blink':
              !lightningStore.operational ||
              (currentStep === 8 && !lightningStore.unlocked),
            invisible: currentStep === 5 && recover && !isStepValid,
          }"
          @click="nextStep"
          >{{
            !lightningStore.operational ? 'Loading' : nextButtonText
          }}</b-button
        >
        <b-button
          v-if="currentStep === 4 || (currentStep === 5 && !recover)"
          variant="link"
          size="sm"
          class="mt-3 mx-auto d-block"
          :disabled="isRegistering"
          @click="skipSeed"
          >Note Down Later</b-button
        >
        <b-button
          v-if="currentStep === 4"
          variant="link"
          size="sm"
          class="mt-2 mx-auto d-block"
          @click="recoverFromSeed"
          >Recover</b-button
        >
        <b-button
          v-if="currentStep > 0 && currentStep !== 6 && currentStep !== 8"
          variant="link"
          size="sm"
          class="mt-2 mx-auto d-block text-dark"
          @click="prevStep"
          >Back</b-button
        >
      </div>
      <b-progress
        :value="progress"
        height="1rem"
        class="onboarding-progress"
      ></b-progress>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {DefineComponent, defineComponent} from 'vue';
import useSystemStore from '../store/system';
import useUserStore from '../store/user';
import useBitcoinStore from '../store/bitcoin';
import useLightningStore from '../store/lightning';
import useAppsStore from '../store/apps';
import useSdkStore from '../store/sdk';
import useToast from '../utils/toast';

import delay from '../helpers/delay';

import InputPassword from '../components/Utility/InputPassword.vue';
import Seed from '../components/Utility/Seed.vue';
import InputCopy from '../components/Utility/InputCopy.vue';
import {BIconExclamationCircleFill} from 'bootstrap-vue/src/index.js';

type Step = {
  heading: string;
  text: string;
};

const steps: Step[] = [
  {
    heading: 'welcome to citadel',
    text: 'Your journey to digital freedom starts now.',
  },
  {
    heading: 'what is your name?',
    text: 'Your name stays on your Citadel and is never shared with us or a 3rd party.',
  },
  {
    heading: 'set your password',
    text: "You'll need this password to login to your Citadel.",
  },
  {
    heading: 'confirm your password',
    text: "You'll need this password to login to your Citadel.",
  },
  {
    heading: 'note down your secret words',
    text: "On the next screen you will be shown 24 words. It's recommended that you write them down on a piece of paper and store it in a safe place.",
  },
  {
    heading: 'note down your secret words',
    text: 'Remember, there is no "forgot password" button. You will need these 24 words to recover your Citadel.',
  },
  {
    heading: 'access from anywhere',
    text: "Even when you're not on your home network, you can access your Citadel using Tor Browser on the following URL",
  },
  {
    heading: 'one last thing',
    text: "Don't be too #reckless.",
  },
  {
    heading: "🎉 that's it!",
    text: 'Congratulations! Your Citadel is now set up and synchronizing the Bitcoin blockchain.',
  },
];

export default defineComponent({
  components: {
    InputPassword,
    Seed,
    InputCopy,
    BIconExclamationCircleFill: BIconExclamationCircleFill as DefineComponent,
  },
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    const bitcoinStore = useBitcoinStore();
    const lightningStore = useLightningStore();
    const appsStore = useAppsStore();
    const sdkStore = useSdkStore();
    const toast = useToast();

    return {
      sdkStore,
      appsStore,
      userStore,
      systemStore,
      bitcoinStore,
      lightningStore,
      toast,
    };
  },
  data(): {
    name: string;
    password: string;
    confirmPassword: string;
    currentStep: number;
    notedSeed: boolean;
    isRegistering: boolean;
    recover: boolean;
    recoverySeed: string[];
    lndUnlockInterval: undefined | number;
  } {
    return {
      name: '',
      password: '',
      confirmPassword: '',
      currentStep: 0,
      notedSeed: false,
      isRegistering: false,
      recover: false,
      recoverySeed: [],
      lndUnlockInterval: undefined,
    };
  },
  computed: {
    /*...mapState({
      isLndOperational: (state) => state.lightning.operational,
      registered: (state) => state.user.registered,
      seed: (state) => state.user.seed,
      unlocked: (state) => state.lightning.unlocked,
      onionAddress: (state) => state.system.onionAddress,
    }),*/
    heading(): string {
      if (this.currentStep === 5 && this.recover) {
        return 'recover your citadel';
      }
      return steps[this.currentStep]['heading'];
    },
    text(): string {
      if (this.currentStep === 5 && this.recover) {
        return 'Enter your 24 secret words in the exact order to recover your Citadel.';
      }
      return steps[this.currentStep]['text'];
    },
    nextButtonText(): string {
      if (this.currentStep === 0) {
        return 'Start';
      }
      if (this.currentStep === 8) {
        return 'Go to dashboard';
      }
      return 'Next';
    },
    isStepValid(): boolean {
      if (this.currentStep === 1) {
        return this.name.length > 0;
      }

      if (this.currentStep === 2) {
        return this.password.length > 11;
      }

      if (this.currentStep === 3) {
        if (this.confirmPassword !== this.password) {
          return false;
        }
      }

      if (this.currentStep === 5) {
        return this.notedSeed;
      }

      if (this.currentStep === 8) {
        return this.lightningStore.unlocked;
      }

      return true;
    },
    progress(): number {
      return this.currentStep === 0
        ? 0
        : Math.round((this.currentStep * 100) / (steps.length - 1));
    },
  },
  async created() {
    //redirect to home if the user is already registered
    if (this.userStore.registered) {
      return this.$router.push('/');
    }

    // Wait for LND
    while (!this.lightningStore.operational) {
      await this.lightningStore.getStatus();
      await delay(1000);
    }

    //generate a new seed on load
    this.userStore.getSeed();
  },
  beforeUnmount() {
    window.clearInterval(this.lndUnlockInterval);
  },
  methods: {
    skipSeed(): void {
      if (this.currentStep === 4) {
        this.currentStep = 5;
      }
      this.nextStep();
    },
    recoverFromSeed() {
      this.recover = true;
      this.currentStep++;
    },
    inputRecoverySeed(seed: string[]) {
      this.recoverySeed = seed;
    },
    async nextStep() {
      if (this.currentStep === 4) {
        this.recover = false;
      }

      //Register user and initialize wallet at the end
      if (this.currentStep === 5) {
        this.isRegistering = true;
        const seed = this.recover ? this.recoverySeed : this.userStore.seed;
        try {
          await this.userStore.register({
            name: this.name,
            password: this.password,
            seed,
          });
        } catch (error) {
          this.isRegistering = false;
          if (error) {
            this.toast.error('Error', JSON.stringify(error));
          }
          //return;
        }

        this.isRegistering = false;

        // fetch onion address for the next step
        this.systemStore.getOnionAddress();
      }

      if (this.currentStep === 7) {
        //Wohoo! Time to celebrate!
        /*this.$confetti.start({
          particles: [
            {
              type: "rect",
            },
          ],
        });*/

        this.lndUnlockInterval = window.setInterval(async () => {
          this.lightningStore.getStatus();
          if (this.lightningStore.unlocked) {
            return window.clearInterval(this.lndUnlockInterval);
          }
        }, 1000);

        // TODO: Find the root problem and fix it
        // Refresh page after 60s if LND still hasn't unlocked
        window.setTimeout(() => {
          if (!this.lightningStore.unlocked) {
            window.location.reload();
          }
        }, 60 * 1000);

        //Ok. 3s is more than enough to celebrate.
        /*window.setTimeout(() => {
          this.$confetti.stop();
        }, 3000);*/
      }

      if (this.currentStep === 8) {
        return this.$router.push('/dashboard');
      }

      return (this.currentStep = this.currentStep + 1);
    },
    prevStep() {
      if (this.currentStep === 5) {
        this.notedSeed = false;
      }

      this.currentStep = this.currentStep - 1;
    },
    finishedSeed() {
      this.notedSeed = true;
    },
    incompleteRecoverySeed() {
      this.notedSeed = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.logo {
  height: 20vh;
  max-height: 200px;
  width: auto;
}
.form-container {
  max-width: 500px;
}
.onboarding-progress {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  border-radius: 0;
  background: transparent;
}
.loading-fade-blink {
  animation: loadingFadeBlink 1s infinite linear;
}

@keyframes loadingFadeBlink {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
