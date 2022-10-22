<template>
  <div class="p-sm-2">
    <div class="my-3 pb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h1>settings</h1>
      </div>
    </div>

    <div class="settings-card-columns">
      <storage-widget id="storage" class="card-app-list"></storage-widget>

      <ram-widget id="ram" class="card-app-list"></ram-widget>

      <temperature-widget
        id="temperature"
        class="card-app-list"
      ></temperature-widget>

      <card-widget
        header="Tor"
        :status="{text: 'Running', variant: 'success', blink: false}"
        title="100%"
        sub-title="Traffic relayed through Tor"
        icon="icon-app-tor.svg"
        class="card-app-list"
      >
        <div class="pt-2">
          <div class="px-3 px-lg-4 mb-4">
            <div class="w-100 mb-3">
              <span class="d-block pb-1">Remote access</span>
              <small class="d-block" style="opacity: 0.4"
                >Remotely access your Citadel from anywhere using a Tor browser
                on this URL</small
              >
            </div>
            <input-copy
              class="w-100"
              size="sm"
              :value="systemStore.onionAddress"
            ></input-copy>
          </div>
          <div class="px-3 px-lg-4 py-1"></div>
        </div>
      </card-widget>

      <card-widget
        header="Account"
        class="card-app-list"
        :loading="isChangingPassword"
      >
        <div class="pt-2">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Secret words</span>
              <small class="d-block" style="opacity: 0.4"
                >Note down your 24 secret words</small
              >
            </div>

            <b-button
              variant="outline-primary"
              size="sm"
              @click="showSeedModal = true"
              >View</b-button
            >

            <b-modal id="seed-modal" centered hide-footer>
              <template #modal-header>
                <div
                  class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100"
                >
                  <h3>secret words</h3>
                  <!-- Emulate built in modal header close button action -->
                  <a
                    href="#"
                    class="align-self-center"
                    @click.stop.prevent="showSeedModal = false"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.6003 4.44197C13.3562 4.19789 12.9605 4.19789 12.7164 4.44197L9.02116 8.1372L5.32596 4.442C5.08188 4.19792 4.68615 4.19792 4.44207 4.442C4.198 4.68607 4.198 5.0818 4.44207 5.32588L8.13728 9.02109L4.44185 12.7165C4.19777 12.9606 4.19777 13.3563 4.44185 13.6004C4.68592 13.8445 5.08165 13.8445 5.32573 13.6004L9.02116 9.90497L12.7166 13.6004C12.9607 13.8445 13.3564 13.8445 13.6005 13.6004C13.8446 13.3563 13.8446 12.9606 13.6005 12.7165L9.90505 9.02109L13.6003 5.32585C13.8444 5.08178 13.8444 4.68605 13.6003 4.44197Z"
                        fill="#6c757d"
                      />
                    </svg>
                  </a>
                </div>
              </template>
              <seed></seed>
            </b-modal>
          </div>
        </div>
        <div class="pt-0">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Password</span>
              <small class="d-block" style="opacity: 0.4"
                >Change your Citadel's password</small
              >
            </div>

            <b-button
              variant="outline-primary"
              size="sm"
              :disabled="isChangingPassword"
              @click="showChangePasswordModal = true"
              >Change</b-button
            >

            <b-modal v-model="showChangePasswordModal" centered hide-footer>
              <template #modal-header>
                <div
                  class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100"
                >
                  <h3>change password</h3>
                  <!-- Emulate built in modal header close button action -->
                  <a
                    href="#"
                    class="align-self-center"
                    @click.stop.prevent="showChangePasswordModal = false"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.6003 4.44197C13.3562 4.19789 12.9605 4.19789 12.7164 4.44197L9.02116 8.1372L5.32596 4.442C5.08188 4.19792 4.68615 4.19792 4.44207 4.442C4.198 4.68607 4.198 5.0818 4.44207 5.32588L8.13728 9.02109L4.44185 12.7165C4.19777 12.9606 4.19777 13.3563 4.44185 13.6004C4.68592 13.8445 5.08165 13.8445 5.32573 13.6004L9.02116 9.90497L12.7166 13.6004C12.9607 13.8445 13.3564 13.8445 13.6005 13.6004C13.8446 13.3563 13.8446 12.9606 13.6005 12.7165L9.90505 9.02109L13.6003 5.32585C13.8444 5.08178 13.8444 4.68605 13.6003 4.44197Z"
                        fill="#6c757d"
                      />
                    </svg>
                  </a>
                </div>
              </template>
              <div class="px-4 pb-2">
                <label class="visually-hidden" for="input-withdrawal-amount"
                  >Current password</label
                >
                <input-password
                  ref="password"
                  v-model="currentPassword"
                  placeholder="current password"
                  input-group-class="neu-input-group"
                  :input-class="[
                    isIncorrectPassword ? 'incorrect-password' : '',
                    'form-control form-control-lg neu-input w-100',
                  ]"
                  :disabled="isChangingPassword"
                />
                <div class="py-2"></div>
                <label class="visually-hidden" for="input-withdrawal-amount"
                  >New password</label
                >
                <input-password
                  ref="password"
                  v-model="newPassword"
                  placeholder="new password"
                  input-group-class="neu-input-group"
                  input-class="form-control form-control-lg neu-input w-100"
                  :disabled="isChangingPassword"
                />
                <div class="py-2"></div>
                <label class="visually-hidden" for="input-withdrawal-amount"
                  >Confirm new password</label
                >
                <input-password
                  ref="password"
                  v-model="confirmNewPassword"
                  placeholder="confirm password"
                  input-group-class="neu-input-group"
                  input-class="form-control form-control-lg neu-input w-100"
                  :disabled="isChangingPassword"
                />

                <div v-if="userStore.totpEnabled">
                  <input-otp-token
                    :disabled="isChangingPassword"
                    :success="isCorrectTotp"
                    :error="isIncorrectTotp"
                    @otp-token="setTotpToken"
                    @keyup="hideOtpError"
                  />
                </div>
                <div class="py-2"></div>
                <b-alert variant="warning" show>
                  <small>
                    ⚠ Remember, there is no "Forgot Password" button. If you
                    lose your password, you will have to recover your Citadel
                    using your 24 secret words and channel backup.
                  </small>
                </b-alert>

                <div v-show="isIncorrectPassword" class="my-2 text-center">
                  <small class="text-danger error">Incorrect password</small>
                </div>

                <div v-show="isIncorrectTotp" class="my-2 text-center">
                  <small class="text-danger error">Incorrect code</small>
                </div>

                <b-button
                  class="w-100"
                  variant="success"
                  size="lg"
                  :disabled="isChangingPassword || !isAllowedToChangePassword"
                  @click="changePassword"
                  >{{
                    isChangingPassword
                      ? 'Changing password...'
                      : 'Change password'
                  }}</b-button
                >
              </div>
            </b-modal>
          </div>
        </div>
        <div class="pt-0">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Two-factor authentication</span>
              <small class="d-block" style="opacity: 0.4"
                >Manage enhanced security measure</small
              >
            </div>

            <b-button
              variant="outline-primary"
              size="sm"
              :disabled="isEnablingTwoFactorAuth"
              @click="openTwoFactorAuthModal"
            >
              <span v-if="!userStore.totpEnabled">Enable</span>
              <span v-else>Disable</span>
            </b-button>

            <b-modal
              id="two-factor-auth-modal"
              ref="two-factor-auth-modal"
              centered
              hide-footer
            >
              <template #modal-header="{close}">
                <div
                  class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100"
                >
                  <h3>Two-factor authentication</h3>

                  <!-- Emulate built in modal header close button action -->
                  <a
                    href="#"
                    class="align-self-center"
                    @click.stop.prevent="close"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.6003 4.44197C13.3562 4.19789 12.9605 4.19789 12.7164 4.44197L9.02116 8.1372L5.32596 4.442C5.08188 4.19792 4.68615 4.19792 4.44207 4.442C4.198 4.68607 4.198 5.0818 4.44207 5.32588L8.13728 9.02109L4.44185 12.7165C4.19777 12.9606 4.19777 13.3563 4.44185 13.6004C4.68592 13.8445 5.08165 13.8445 5.32573 13.6004L9.02116 9.90497L12.7166 13.6004C12.9607 13.8445 13.3564 13.8445 13.6005 13.6004C13.8446 13.3563 13.8446 12.9606 13.6005 12.7165L9.90505 9.02109L13.6003 5.32585C13.8444 5.08178 13.8444 4.68605 13.6003 4.44197Z"
                        fill="#6c757d"
                      />
                    </svg>
                  </a>
                </div>
              </template>
              <div class="px-4 pb-2">
                <div v-if="!userStore.totpEnabled">
                  <p>
                    Scan the code below with your authenticator app or copy the
                    code.
                  </p>
                  <qr-code
                    class="mb-3 mx-auto"
                    :value="authenticatorSecretUri"
                    :size="190"
                    level="M"
                    show-logo
                  ></qr-code>
                  <input-copy
                    class="w-100 mx-auto"
                    size="sm"
                    :value="userStore.totpKey"
                  ></input-copy>

                  <br />
                </div>
                <label class="visually-hidden" for="input-token">
                  Enter the code from your authenticator app to verify and
                  {{ userStore.totpEnabled ? 'disable' : 'enable' }} 2FA.
                </label>
                <b-form-input
                  id="input-token"
                  v-model="authenticatorToken"
                  class="mb-4 neu-input"
                  size="lg"
                  placeholder="6-digit-code"
                ></b-form-input>
                <b-button
                  v-if="!userStore.totpEnabled"
                  class="w-100"
                  variant="success"
                  size="lg"
                  :disabled="
                    isEnablingTwoFactorAuth || !isAllowedToChangeTwoFactorAuth
                  "
                  @click="enableTwoFactorAuth"
                  >{{
                    isEnablingTwoFactorAuth ? 'Enabling 2FA...' : 'Enable 2FA'
                  }}</b-button
                >

                <b-button
                  v-if="userStore.totpEnabled"
                  class="w-100"
                  variant="danger"
                  size="lg"
                  :disabled="
                    isDisablingTwoFactorAuth || !isAllowedToChangeTwoFactorAuth
                  "
                  @click="disableTwoFactorAuth"
                  >{{
                    isDisablingTwoFactorAuth
                      ? 'Disabling 2FA...'
                      : 'Disable 2FA'
                  }}</b-button
                >
              </div>
            </b-modal>
          </div>
        </div>
        <div class="px-3 px-lg-4 py-1"></div>
      </card-widget>

      <card-widget
        header="System"
        class="card-app-list"
        :loading="isCheckingForUpdate || isUpdating"
      >
        <div class="d-block pt-2"></div>

        <div class="pt-0">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Uptime</span>
              <small class="d-block" style="opacity: 0.4"
                >Time since last restart</small
              >
            </div>
            <div class="text-end">
              <span class="d-block">{{ getUptime }}</span>
            </div>
          </div>
        </div>
        <div class="pt-0">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Shutdown</span>
              <small class="d-block" style="opacity: 0.4"
                >Power off your Citadel</small
              >
            </div>
            <b-button variant="outline-danger" size="sm" @click="shutdownPrompt"
              >Shutdown</b-button
            >
          </div>
        </div>
        <div class="pt-0">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Restart</span>
              <small class="d-block" style="opacity: 0.4"
                >Restart your Citadel</small
              >
            </div>

            <b-button variant="outline-danger" size="sm" @click="rebootPrompt"
              >Restart</b-button
            >
            <b-modal
              v-model="showRebootModal"
              title="Are you sure?"
              no-close-on-backdrop
              no-close-on-esc
              @ok.prevent="reboot()"
            >
              <div>
                <p>
                  Your Lightning wallet will not be able to receive any payments
                  while your Citadel is restarting.
                </p>
              </div>
            </b-modal>
          </div>
        </div>
        <div class="pt-0">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Troubleshoot</span>
              <small class="d-block" style="opacity: 0.4"
                >View logs for troubleshooting</small
              >
            </div>
            <b-button
              variant="outline-primary"
              size="sm"
              @click="openDebugModal"
              >Start</b-button
            >
            <b-modal
              ref="debug-modal"
              size="xl"
              scrollable
              header-bg-variant="dark"
              header-text-variant="light"
              footer-bg-variant="dark"
              footer-text-variant="light"
              body-bg-variant="dark"
              body-text-variant="light"
              @close="closeDebugModal"
            >
              <template #modal-header="{close}">
                <div class="px-2 pt-2 d-flex justify-content-between w-100">
                  <h4 v-if="loadingDebug">Generating logs...</h4>
                  <h4 v-else>
                    {{ showDmesg ? 'DMESG logs' : 'Citadel logs' }}
                  </h4>
                  <!-- Emulate built in modal header close button action -->
                  <a
                    href="#"
                    class="align-self-center"
                    @click.stop.prevent="close"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.6003 4.44197C13.3562 4.19789 12.9605 4.19789 12.7164 4.44197L9.02116 8.1372L5.32596 4.442C5.08188 4.19792 4.68615 4.19792 4.44207 4.442C4.198 4.68607 4.198 5.0818 4.44207 5.32588L8.13728 9.02109L4.44185 12.7165C4.19777 12.9606 4.19777 13.3563 4.44185 13.6004C4.68592 13.8445 5.08165 13.8445 5.32573 13.6004L9.02116 9.90497L12.7166 13.6004C12.9607 13.8445 13.3564 13.8445 13.6005 13.6004C13.8446 13.3563 13.8446 12.9606 13.6005 12.7165L9.90505 9.02109L13.6003 5.32585C13.8444 5.08178 13.8444 4.68605 13.6003 4.44197Z"
                        fill="#ffffff"
                      />
                    </svg>
                  </a>
                </div>
              </template>
              <div v-if="debugFailed" class="d-flex justify-content-center">
                Error: Failed to fetch debug data.
              </div>
              <div
                v-else-if="loadingDebug"
                class="d-flex justify-content-center"
              >
                <b-spinner></b-spinner>
              </div>
              <pre class="px-2 text-light">{{ debugContents }}</pre>

              <template #modal-footer="{}">
                <div v-if="loadingDebug"></div>
                <div v-else class="d-flex w-100 justify-content-between px-2">
                  <b-button
                    size="sm"
                    variant="outline-success"
                    @click="showDmesg = !showDmesg"
                  >
                    <div class="me-1"><FlipHorizontalIcon /></div>
                    View
                    {{ !showDmesg ? 'DMESG logs' : 'Citadel logs' }}
                  </b-button>
                  <b-button
                    size="sm"
                    variant="outline-success"
                    @click="downloadTextFile(debugContents, debugFilename)"
                  >
                    <div class="me-2"><ReceiveIcon /></div>
                    Download
                    {{ showDmesg ? 'DMESG logs' : 'Citadel logs' }}
                  </b-button>
                </div>
              </template>
            </b-modal>
          </div>
        </div>
        <div class="px-3 px-lg-4 pb-4">
          <div class="w-100 d-flex justify-content-between mb-1">
            <span class="align-self-end">Citadel Version</span>
            <span class="font-weight-normal mb-0">{{
              systemStore.version
            }}</span>
          </div>
          <div v-show="!isCheckingForUpdate">
            <span v-show="!systemStore.availableUpdate.version">
              <b-icon-check-circle-fill variant="success" />
              <small class="ms-1" style="opacity: 0.4"
                >Your Citadel is on the latest version</small
              >
            </span>
            <div v-show="systemStore.availableUpdate.version">
              <span class="d-flex align-items-center">
                <div class="d-flex align-items-center icon-16px">
                  <BellIcon />
                </div>
                <small class="text-muted ms-1"
                  >{{ systemStore.availableUpdate.name }} is now
                  available</small
                >
                <b-button
                  class="ms-auto"
                  variant="primary"
                  size="sm"
                  :disabled="isUpdating"
                  @click.prevent="confirmUpdate"
                  >Install now</b-button
                >
              </span>
            </div>
          </div>
        </div>
        <b-button
          class="w-100"
          variant="success"
          style="
            border-radius: 0;
            border-bottom-left-radius: 1rem;
            border-bottom-right-radius: 1rem;
            padding-top: 1rem;
            padding-bottom: 1rem;
          "
          :disabled="isCheckingForUpdate || isUpdating"
          @click="checkForUpdate"
        >
          <RefreshIcon
            class="me-2"
            :animation="isCheckingForUpdate ? 'spin' : ''"
          />
          {{ isCheckingForUpdate ? 'Checking for update' : 'Check for update' }}
        </b-button>
      </card-widget>
    </div>
  </div>
</template>

<script lang="ts">
import delay from '../helpers/delay';
import {prettifySeconds} from '../helpers/date';

import CardWidget from '../components/CardWidget.vue';
import StorageWidget from '../components/Widgets/StorageWidget.vue';
import RamWidget from '../components/Widgets/RamWidget.vue';
import TemperatureWidget from '../components/Widgets/TemperatureWidget.vue';
import Seed from '../components/Seed.vue';
import InputPassword from '../components/Utility/InputPassword.vue';
import InputCopy from '../components/Utility/InputCopy.vue';
import InputOtpToken from '../components/Utility/InputOtpToken.vue';
import QrCode from '../components/Utility/QrCode.vue';
import {
  BellIcon,
  ReceiveIcon,
  FlipHorizontalIcon,
  RefreshIcon,
} from '@bitcoin-design/bitcoin-icons-vue/filled/esm/index.js';
import {BIconCheckCircleFill} from 'bootstrap-icons-vue';
import useSdkStore from '../store/sdk';
import useSystemStore from '../store/system';
import useUserStore from '../store/user';
import {defineComponent, DefineComponent} from 'vue';
import useToast from '../utils/toast';

export default defineComponent({
  components: {
    CardWidget,
    StorageWidget,
    RamWidget,
    TemperatureWidget,
    InputPassword,
    InputCopy,
    InputOtpToken,
    Seed,
    QrCode,
    ReceiveIcon: ReceiveIcon as DefineComponent,
    FlipHorizontalIcon: FlipHorizontalIcon as DefineComponent,
    BIconCheckCircleFill,
    BellIcon: BellIcon as DefineComponent,
    RefreshIcon: RefreshIcon as DefineComponent,
  },
  setup() {
    const sdkStore = useSdkStore();
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    const toast = useToast();
    return {sdkStore, systemStore, userStore, toast};
  },
  data() {
    return {
      currentPassword: '',
      isIncorrectPassword: false,
      isCorrectTotp: false,
      isIncorrectTotp: false,
      newPassword: '',
      confirmNewPassword: '',
      totpToken: '',
      isChangingPassword: false,
      isCheckingForUpdate: false,
      isEnablingTwoFactorAuth: false,
      isDisablingTwoFactorAuth: false,
      isUpdating: false,
      loadingDebug: false,
      debugFailed: false,
      showDmesg: false,
      showChangePasswordModal: false,
      showSeedModal: false,
      showTotpModal: false,
      authenticatorToken: '',
      showRebootModal: false,
      increaseUptimeInterval: undefined,
    } as {
      currentPassword: string;
      isIncorrectPassword: boolean;
      isCorrectTotp: boolean;
      isIncorrectTotp: boolean;
      newPassword: string;
      confirmNewPassword: string;
      totpToken: string;
      isChangingPassword: boolean;
      isCheckingForUpdate: boolean;
      isEnablingTwoFactorAuth: boolean;
      isDisablingTwoFactorAuth: boolean;
      isUpdating: boolean;
      loadingDebug: boolean;
      debugFailed: boolean;
      showDmesg: boolean;
      authenticatorToken: string;
      pollUpdateStatus?: number;
      showChangePasswordModal: boolean;
      showSeedModal: boolean;
      showTotpModal: boolean;
      showRebootModal: boolean;
      increaseUptimeInterval?: number;
    };
  },
  computed: {
    authenticatorSecretUri(): string {
      return `otpauth://totp/${encodeURIComponent(
        this.userStore.name,
      )}?secret=${this.userStore.totpKey}&period=30&issuer=Citadel`;
    },
    getUptime(): string {
      return prettifySeconds(this.systemStore.uptime as number);
    },
    debugContents(): string {
      if (typeof this.systemStore.debugStatus === 'string') {
        return 'Error loading data!';
      }
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      return this.showDmesg
        ? this.systemStore.debugStatus.dmesg!
        : this.systemStore.debugStatus.debug!;
    },
    debugFilename(): string {
      const type: string = this.showDmesg ? 'dmesg' : 'debug';
      return `citadel-${Date.now()}-${type}.log`;
    },
    isAllowedToChangeTwoFactorAuth(): boolean {
      return this.authenticatorToken.length >= 6;
    },
    isAllowedToChangePassword(): boolean {
      if (!this.currentPassword) {
        return false;
      }
      if (this.newPassword.length < 12) {
        return false;
      }
      if (this.newPassword !== this.confirmNewPassword) {
        return false;
      }
      if (this.currentPassword === this.newPassword) {
        return false;
      }
      return true;
    },
  },
  watch: {
    currentPassword: function () {
      this.isIncorrectPassword = false;
    },
  },
  created() {
    this.systemStore.getOnionAddress();
    this.systemStore.getVersion();
    this.systemStore.getUptime();
    this.userStore.getTotpEnabledStatus();
    this.increaseUptimeInterval = window.setInterval(() => {
      // @ts-expect-error This could be null
      this.systemStore.uptime++;
    }, 1000);
  },
  beforeUnmount() {
    if (this.pollUpdateStatus) {
      window.clearInterval(this.pollUpdateStatus);
    }
    if (this.increaseUptimeInterval) {
      window.clearInterval(this.increaseUptimeInterval);
    }
  },
  methods: {
    setTotpToken(totpToken: string) {
      this.totpToken = totpToken;
    },
    async enableTwoFactorAuth() {
      this.isEnablingTwoFactorAuth = true;

      try {
        await this.sdkStore.citadel.manager.auth.enableTotp(
          this.authenticatorToken,
        );

        this.toast.success(
          '2FA enabled',
          "You've successfully enabled two-factor authentication",
        );

        this.showTotpModal = false;

        // set optimistic
        this.userStore.totpEnabled = true;
        // wait for file to be finished writing
        await delay(500);
        // update with real status
        this.userStore.getTotpEnabledStatus();

        this.isEnablingTwoFactorAuth = false;
        this.authenticatorToken = '';
      } catch (error) {
        if (error && (error as Error).message) {
          this.toast.error('Error', (error as Error).message);
        }
        this.isEnablingTwoFactorAuth = false;
        return;
      }
    },
    async disableTwoFactorAuth() {
      this.isDisablingTwoFactorAuth = true;

      try {
        await this.sdkStore.citadel.manager.auth.disableTotp(
          this.authenticatorToken,
        );

        this.toast.success(
          '2FA disabled',
          "You've successfully disabled two-factor authentication",
        );

        this.showTotpModal = false;

        // set optimistic
        this.userStore.totpEnabled = false;
        // wait for file to be finished writing
        await delay(500);
        // update with real status
        this.userStore.getTotpEnabledStatus();

        this.isDisablingTwoFactorAuth = false;
        this.authenticatorToken = '';
      } catch (error) {
        if (error && (error as Error).message) {
          this.toast.error('Error', (error as Error).message);
        }
        this.isDisablingTwoFactorAuth = false;
        return;
      }
    },
    async changePassword() {
      this.isChangingPassword = true;
      this.isIncorrectPassword = false;
      this.isIncorrectTotp = false;

      try {
        await this.sdkStore.citadel.manager.auth.changePassword(
          this.currentPassword,
          this.newPassword,
          this.totpToken,
        );

        this.toast.success(
          'Password Changed',
          "You've successfully changed your Citadel's password",
        );
      } catch (error) {
        console.error(error);
        const errorString = String(error);
        const isIncorrectPassword = errorString.includes('Incorrect password');
        const isIncorrectTotp = errorString.includes('Incorrect 2FA code');

        this.isIncorrectPassword = isIncorrectPassword;
        this.isIncorrectTotp = isIncorrectTotp;

        this.isChangingPassword = false;
        return;
      }

      this.isChangingPassword = false;
      this.showChangePasswordModal = false;

      // Remove passwords from view
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.totpToken = '';
    },
    confirmUpdate() {
      this.systemStore.confirmUpdate();
    },
    async checkForUpdate() {
      this.isCheckingForUpdate = true;
      await this.systemStore.getAvailableUpdate();
      this.isCheckingForUpdate = false;
    },
    async openTwoFactorAuthModal() {
      this.showTotpModal = true;
      this.userStore.getTotpKey();
    },
    async openDebugModal() {
      this.showDmesg = false;
      this.debugFailed = false;
      this.loadingDebug = true;
      (this.$refs['debug-modal'] as {show: () => void}).show();
      try {
        await this.systemStore.debug();
        while (this.loadingDebug) {
          await delay(2000);
          await this.systemStore.getDebugResult();
          if (this.systemStore.debugStatus.status === 'success') {
            this.loadingDebug = false;
          }
        }
      } catch (error) {
        console.error(error);
        this.debugFailed = true;
      }
    },
    closeDebugModal() {
      this.loadingDebug = false;
      (this.$refs['debug-modal'] as {hide: () => void}).hide();
    },
    downloadTextFile(contents: string, fileName: string) {
      const blob = new Blob([contents], {
        type: 'text/plain;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    async shutdownPrompt() {
      // Get user consent first
      const approved = window.confirm(
        'Are you sure? Your Lightning wallet will not be able to receive any payments while your Citadel is offline.',
      );
      if (!approved) {
        return;
      }

      // Shutdown request
      try {
        await this.systemStore.shutdown();
      } catch (error) {
        console.error(error);
        this.toast.error(
          'Shutdown failed',
          'Something went wrong and Citadel was not able to shutdown',
        );
      }
    },
    rebootPrompt() {
      // Reset any cached hasRebooted value from previous reboot
      this.systemStore.hasRebooted = false;
      this.showRebootModal = true;
    },
    hideOtpError() {
      this.isIncorrectTotp = false;
    },
    async reboot() {
      if (!this.systemStore.hasRebooted) {
        try {
          await this.systemStore.reboot();
        } catch (error) {
          console.error(error);
          this.toast.error(
            'Reboot failed',
            'Something went wrong and Citadel was not able to reboot',
          );
        }
      }
    },
  },
});
</script>
