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
      <h1 class="text-center mb-2">{{ t('login.welcome-back') }}</h1>
      <p v-if="!showTotpInput" class="text-muted w-75 text-center">
        {{ t('login.enter-your-password') }}
      </p>

      <p v-else class="text-muted w-75 text-center">
        {{ t('login.enter-2fa-code') }}
      </p>

      <form
        v-if="!showTotpInput"
        class="form-container mt-3 d-flex flex-column form-container w-100 align-items-center"
        @submit.prevent="authenticateUser"
      >
        <input-password
          ref="password"
          v-model="password"
          autocomplete="current-password"
          placeholder="Password"
          :input-class="[
            isIncorrectPassword ? 'incorrect-password' : '',
            'card-input w-100',
          ]"
          :disabled="isLoggingIn"
        />
        <div class="login-button-container">
          <transition name="fade">
            <small
              v-show="isIncorrectPassword"
              class="mt-2 text-danger error"
              >{{ t('login.incorrect-password') }}</small
            >
          </transition>
          <transition name="slide-up">
            <b-button
              v-show="!!password && !isIncorrectPassword"
              variant="success"
              type="submit"
              size="lg"
              class="px-4 login-button"
              :class="{'loading-fade-blink': isLoggingIn}"
              :disabled="isLoggingIn"
              >Log in</b-button
            >
          </transition>
        </div>
      </form>
      <form
        v-else
        class="form-container mt-3 d-flex flex-column form-container w-100 align-items-center"
        @submit.prevent
      >
        <input-otp-token
          autofocus
          :disabled="isLoggingIn"
          :success="isCorrectTotp"
          :error="isIncorrectTotp"
          @otp-token="authenticateUserWithTotp"
          @keyup="hideTotpError"
        />
        <div class="login-button-container">
          <transition name="fade">
            <small v-show="isIncorrectTotp" class="mt-2 text-danger error">{{
              t('login.incorrect-code')
            }}</small>
          </transition>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import useUserStore from '../store/user';
import InputPassword from '../components/Utility/InputPassword.vue';
import InputOtpToken from '../components/Utility/InputOtpToken.vue';
import delay from '../helpers/delay';
import {useI18n} from 'vue-i18n';

export default defineComponent({
  components: {
    InputPassword,
    InputOtpToken,
  },
  setup() {
    const userStore = useUserStore();
    const {t} = useI18n();
    return {userStore, t};
  },
  data() {
    return {
      loading: true,
      password: '',
      isIncorrectPassword: false,
      isLoggingIn: false,
      totpToken: '',
      showTotpInput: false,
      isCorrectTotp: false,
      isIncorrectTotp: false,
    };
  },
  watch: {
    password: function () {
      // bring up log in button after user retries new password after failed attempt
      this.isIncorrectPassword = false;
    },
  },
  async created() {
    // redirect to dashboard if already logged in
    if (this.userStore.jwt) {
      this.$router.push('/dashboard');
    }

    // redirect to onboarding if the user is not registered
    await this.userStore.getRegistered();
    if (!this.userStore.registered) {
      return this.$router.push('/start');
    } else {
      await this.userStore.getTotpEnabledStatus();
    }

    this.loading = false;
  },
  methods: {
    async authenticateUser() {
      this.isLoggingIn = true;

      try {
        await this.userStore.login({
          password: this.password,
          totpToken: this.totpToken,
        });

        if (this.totpToken) {
          // show ripple animation
          this.isCorrectTotp = true;
          await delay(1000);
        }

        // redirect to dashboard
        return this.$router.push(
          new URL(window.location as unknown as URL).searchParams.get(
            'redirect',
          ) || '/dashboard',
        );
      } catch (error) {
        console.error(error);
        const errorString = String(error);
        const isIncorrectPassword = errorString.includes('Incorrect password');
        const isIncorrectTotp = errorString.includes('Incorrect 2FA code');

        this.isIncorrectPassword = isIncorrectPassword;
        this.isLoggingIn = false;

        if (this.userStore.totpEnabled) {
          if (!isIncorrectPassword) {
            this.showTotpInput = true;
          }

          if (this.totpToken) {
            this.isIncorrectTotp = isIncorrectTotp;
          }
        }

        // hide error message after interval
        await delay(3000);
        this.isIncorrectPassword = false;
      }
    },

    authenticateUserWithTotp(totpToken: string) {
      this.totpToken = totpToken;
      this.authenticateUser();
    },
    hideTotpError() {
      this.isIncorrectTotp = false;
    },
  },
});
</script>

<style lang="scss">
.logo {
  height: 20vh;
  max-height: 200px;
  width: auto;
}
.form-container {
  max-width: 400px;
}
.login-button-container {
  position: relative;
  padding-top: 5rem;
  width: 100%;
  .error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .login-button {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }
}

.incorrect-password {
  animation: shake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
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

.login-button-container {
  .login-button {
    &.slide-up-enter-active,
    &.slide-up-leave-active {
      transition: transform 0.8s, opacity 0.8s ease;
    }
    &.slide-up-enter-from {
      transform: translate3d(-50%, 10px, 0);
      opacity: 0;
    }
    &.slide-up-enter-to {
      transform: translate3d(-50%, 0, 0);
      opacity: 1;
    }
    &.slide-up-leave {
      transform: translate3d(-50%, 0, 0);
      opacity: 1;
    }
    &.slide-up-leave-to {
      transform: translate3d(-50%, 10px, 0);
      opacity: 0;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: transform 0.8s, opacity 0.8s ease;
}
.fade-enter-active {
  transition-delay: 0.4s;
}
.fade-enter,
.fade-leave-to {
  transform: translate3d(0, -20px, 0);
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
</style>
