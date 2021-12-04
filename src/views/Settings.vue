<template>
  <div class="p-sm-2">
    <div class="my-3 pb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h1>settings</h1>
      </div>
    </div>

    <div class="settings-card-columns card-columns">
      <storage-widget id="storage" class="card-app-list"></storage-widget>

      <ram-widget id="ram" class="card-app-list"></ram-widget>

      <temperature-widget
        v-if="isCitadelOS"
        id="temperature"
        class="card-app-list"
      ></temperature-widget>

      <card-widget
        header="Tor"
        :status="{ text: 'Running', variant: 'success', blink: false }"
        title="100%"
        sub-title="Traffic relayed through Tor"
        icon="icon-app-tor.svg"
        class="card-app-list"
      >
        <div class="pt-2">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Bitcoin</span>
              <small class="d-block" style="opacity: 0.4"
                >Run Bitcoin Core on Tor</small
              >
            </div>
            <toggle-switch
              class="align-self-center"
              disabled
              tooltip="Sorry, Tor cannot be disabled for now"
            ></toggle-switch>
          </div>
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Lightning</span>
              <small class="d-block" style="opacity: 0.4"
                >Run Lightning Network on Tor</small
              >
            </div>
            <toggle-switch
              class="align-self-center"
              disabled
              tooltip="Sorry, Tor cannot be disabled for now"
            ></toggle-switch>
          </div>
          <div class="px-3 px-lg-4 mb-4">
            <div class="d-flex justify-content-between w-100 mb-3">
              <div class="w-75">
                <span class="d-block">Remote access</span>
                <small class="d-block" style="opacity: 0.4"
                  >Remotely access your Citadel from anywhere using a Tor
                  browser on this URL</small
                >
              </div>
              <toggle-switch
                class="align-self-center"
                disabled
                tooltip="Sorry, Tor cannot be disabled for now"
              ></toggle-switch>
            </div>
            <input-copy
              class="w-100"
              size="sm"
              :value="onionAddress"
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

            <b-button v-b-modal.seed-modal variant="outline-primary" size="sm"
              >View</b-button
            >

            <b-modal id="seed-modal" centered hide-footer>
              <template #modal-header="{ close }">
                <div
                  class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100"
                >
                  <h3>secret words</h3>
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
              v-b-modal.change-password-modal
              variant="outline-primary"
              size="sm"
              :disabled="isChangingPassword"
              >Change</b-button
            >

            <b-modal id="change-password-modal" centered hide-footer>
              <template #modal-header="{ close }">
                <div
                  class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100"
                >
                  <h3>change password</h3>
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
                <label class="sr-onlsy" for="input-withdrawal-amount"
                  >Current password</label
                >
                <input-password
                  ref="password"
                  v-model="currentPassword"
                  input-group-class="neu-input-group"
                  :input-class="[
                    isIncorrectPassword ? 'incorrect-password' : '',
                    'form-control form-control-lg neu-input w-100',
                  ]"
                  :disabled="isChangingPassword"
                />
                <div class="py-2"></div>
                <label class="sr-onlsy" for="input-withdrawal-amount"
                  >New password</label
                >
                <input-password
                  ref="password"
                  v-model="newPassword"
                  input-group-class="neu-input-group"
                  input-class="form-control form-control-lg neu-input w-100"
                  :disabled="isChangingPassword"
                />
                <div class="py-2"></div>
                <label class="sr-onlsy" for="input-withdrawal-amount"
                  >Confirm new password</label
                >
                <input-password
                  ref="password"
                  v-model="confirmNewPassword"
                  input-group-class="neu-input-group"
                  input-class="form-control form-control-lg neu-input w-100"
                  :disabled="isChangingPassword"
                />
                <div class="py-2"></div>
                <b-alert variant="warning" show>
                  <small>
                    ⚠ Remember, there is no "Forgot Password" button. If you
                    lose your password, you will have to recover your Citadel
                    using your 24 secret words and channel backup.
                  </small>
                </b-alert>
                <b-button
                  class="w-100"
                  variant="success"
                  size="lg"
                  :disabled="isChangingPassword || !isAllowedToChangePassword"
                  @click="changePassword"
                  >{{
                    isChangingPassword
                      ? "Changing password..."
                      : "Change password"
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
                >Manage enhanced security measure.</small
              >
            </div>

            <b-button
              v-b-modal.two-factor-auth-modal
              variant="outline-primary"
              size="sm"
              :disabled="isEnablingTwoFactorAuth"
            >
              <span v-if="!totpEnabled">Enable</span>
              <span v-if="totpEnabled">Disable</span>
            </b-button>

            <b-modal
              id="two-factor-auth-modal"
              ref="two-factor-auth-modal"
              centered
              hide-footer
            >
              <template #modal-header="{ close }">
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
                <div v-if="!totpEnabled">
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
                    :value="authenticatorSecret"
                  ></input-copy>

                  <br />
                </div>
                <label class="sr-onlsy" for="input-token">
                  Enter the code from your authenticator app to verify and
                  {{ totpEnabled ? "disable" : "enable" }} 2FA.
                </label>
                <b-input
                  id="input-token"
                  v-model="authenticatorToken"
                  class="mb-4 neu-input"
                  size="lg"
                ></b-input>
                <b-button
                  v-if="!totpEnabled"
                  class="w-100"
                  variant="success"
                  size="lg"
                  :disabled="
                    isEnablingTwoFactorAuth || !isAllowedToEnableTwoFactorAuth
                  "
                  @click="enableTwoFactorAuth"
                  >{{
                    isEnablingTwoFactorAuth ? "Enabling 2FA..." : "Enable 2FA"
                  }}</b-button
                >

                <b-button
                  v-if="totpEnabled"
                  class="w-100"
                  variant="danger"
                  size="lg"
                  :disabled="
                    isDisablingTwoFactorAuth || !isAllowedToDisableTwoFactorAuth
                  "
                  @click="disableTwoFactorAuth"
                  >{{
                    isDisablingTwoFactorAuth
                      ? "Disabling 2FA..."
                      : "Disable 2FA"
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

        <!-- Uptime monitoring is only available on Citadel OS -->
        <div v-if="isCitadelOS" class="pt-0">
          <div class="d-flex w-100 justify-content-between px-3 px-lg-4 mb-4">
            <div>
              <span class="d-block">Uptime</span>
              <small class="d-block" style="opacity: 0.4"
                >Time since last restart</small
              >
            </div>
            <div class="text-right">
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
              ref="reboot-modal"
              title="Are you sure?"
              no-close-on-backdrop
              no-close-on-esc
              @ok="reboot($event)"
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
              <template #modal-header="{ close }">
                <div class="px-2 pt-2 d-flex justify-content-between w-100">
                  <h4 v-if="loadingDebug">Generating logs...</h4>
                  <h4 v-else>
                    {{ showDmesg ? "DMESG logs" : "Citadel logs" }}
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
                    {{ !showDmesg ? "DMESG logs" : "Citadel logs" }}
                  </b-button>
                  <b-button
                    size="sm"
                    variant="outline-success"
                    @click="downloadTextFile(debugContents, debugFilename)"
                  >
                    <div class="me-2"><ReceiveIcon /></div>
                    Download
                    {{ showDmesg ? "DMESG logs" : "Citadel logs" }}
                  </b-button>
                </div>
              </template>
            </b-modal>
          </div>
        </div>
        <div class="px-3 px-lg-4 pb-4">
          <div class="w-100 d-flex justify-content-between mb-1">
            <span class="align-self-end">Citadel Version</span>
            <span class="font-weight-normal mb-0">{{ version }}</span>
          </div>
          <div v-show="!isCheckingForUpdate">
            <span v-show="!availableUpdate.version">
              <b-icon-check-circle-fill variant="success" />
              <small class="ms-1" style="opacity: 0.4"
                >Your Citadel is on the latest version</small
              >
            </span>
            <div v-show="availableUpdate.version">
              <span class="d-block">
                <div class="icon-16px"><BellIcon /></div>
                <small class="text-muted ms-1"
                  >{{ availableUpdate.name }} is now available to install</small
                >
              </span>
              <b-button
                class="mt-2"
                variant="primary"
                size="sm"
                :disabled="isUpdating"
                @click.prevent="confirmUpdate"
                >Install now</b-button
              >
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
          {{ isCheckingForUpdate ? "Checking for update" : "Check for update" }}
        </b-button>
      </card-widget>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import API from "@/helpers/api.js";
import delay from "@/helpers/delay.js";
import { prettifySeconds } from "@/helpers/date.js";

import CardWidget from "@/components/CardWidget.vue";
import StorageWidget from "@/components/Widgets/StorageWidget.vue";
import RamWidget from "@/components/Widgets/RamWidget.vue";
import TemperatureWidget from "@/components/Widgets/TemperatureWidget.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import Seed from "@/components/Seed.vue";
import InputPassword from "@/components/Utility/InputPassword.vue";
import InputCopy from "@/components/Utility/InputCopy.vue";
import QrCode from "@/components/Utility/QrCode.vue";
import {
  BellIcon,
  ReceiveIcon,
  FlipHorizontalIcon,
  RefreshIcon,
} from "@bitcoin-design/bitcoin-icons-vue/filled/esm/index.js";
import { BIconCheckCircleFill } from "bootstrap-vue/src/index.js";

export default {
  components: {
    CardWidget,
    StorageWidget,
    RamWidget,
    TemperatureWidget,
    ToggleSwitch,
    InputPassword,
    InputCopy,
    Seed,
    QrCode,
    ReceiveIcon,
    FlipHorizontalIcon,
    BIconCheckCircleFill,
    BellIcon,
    RefreshIcon,
  },
  data() {
    return {
      currentPassword: "",
      isIncorrectPassword: false,
      newPassword: "",
      confirmNewPassword: "",
      isChangingPassword: false,
      isCheckingForUpdate: false,
      isEnablingTwoFactorAuth: false,
      isDisablingTwoFactorAuth: false,
      isUpdating: false,
      loadingDebug: false,
      debugFailed: false,
      showDmesg: false,
      authenticatorToken: "",
    };
  },
  computed: {
    ...mapState({
      version: (state) => state.system.version,
      onionAddress: (state) => state.system.onionAddress,
      availableUpdate: (state) => state.system.availableUpdate,
      updateStatus: (state) => state.system.updateStatus,
      debugResult: (state) => state.system.debugResult,
      isCitadelOS: (state) => state.system.isCitadelOS,
      uptime: (state) => state.system.uptime,
      totpEnabled: (state) => state.user.totpEnabled,
      authenticatorSecret: (state) => state.user.totpKey,
      authenticatorSecretUri: (state) =>
        `otpauth://totp/${encodeURIComponent(
          state.user.name + "'Citadel"
        )}?secret=${state.user.totpKey}&period=30"`,
    }),
    async getUptime() {
      return await prettifySeconds(this.uptime);
    },
    debugContents() {
      return this.showDmesg ? this.debugResult.dmesg : this.debugResult.debug;
    },
    debugFilename() {
      const type = this.showDmesg ? "dmesg" : "debug";
      return `citadel-${Date.now()}-${type}.log`;
    },
    isAllowedToEnableTwoFactorAuth() {
      if (this.authenticatorToken.length < 6) {
        return false;
      }

      return true;
    },
    isAllowedToDisableTwoFactorAuth() {
      if (this.authenticatorToken.length < 6) {
        return false;
      }

      return true;
    },
    isAllowedToChangePassword() {
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
    this.$store.dispatch("system/getOnionAddress");
    this.$store.dispatch("system/getVersion");
    this.$store.dispatch("system/getUptime");
    this.$store.dispatch("user/getTotpEnabledStatus");

    this.$root.$on("bv::modal::show", (bvEvent, modalId) => {
      if (modalId == "two-factor-auth-modal") {
        this.$store.dispatch("user/getTotpKey");
      }
    });
  },
  beforeUnmount() {
    if (this.pollUpdateStatus) {
      window.clearInterval(this.pollUpdateStatus);
    }
  },
  methods: {
    async enableTwoFactorAuth() {
      this.isEnablingTwoFactorAuth = true;

      const payload = {
        authenticatorToken: this.authenticatorToken,
      };

      try {
        await API.post(
          `${import.meta.env.VUE_APP_MANAGER_API_URL}/v1/account/totp/enable`,
          payload,
          false
        );
        this.isEnablingTwoFactorAuth = false;
      } catch (error) {
        if (error.response && error.response.data) {
          this.$bvToast.toast(error.response.data, {
            title: "Error",
            autoHideDelay: 3000,
            variant: "danger",
            solid: true,
            toaster: "b-toaster-bottom-right",
          });
        }
        this.isEnablingTwoFactorAuth = false;
        return;
      }

      this.$bvToast.toast(
        `You've successfully enabled two-factor authentication`,
        {
          title: "2FA enabled",
          autoHideDelay: 3000,
          variant: "success",
          solid: true,
          toaster: "b-toaster-bottom-right",
        }
      );

      this.$store.dispatch("user/getTotpEnabledStatus");
      this.$bvModal.hide("two-factor-auth-modal");
    },
    async disableTwoFactorAuth() {
      this.isDisablingTwoFactorAuth = true;

      const payload = {
        authenticatorToken: this.authenticatorToken,
      };

      try {
        await API.post(
          `${import.meta.env.VUE_APP_MANAGER_API_URL}/v1/account/totp/disable`,
          payload,
          false
        );
        this.isDisablingTwoFactorAuth = false;
      } catch (error) {
        if (error.response && error.response.data) {
          this.$bvToast.toast(error.response.data, {
            title: "Error",
            autoHideDelay: 3000,
            variant: "danger",
            solid: true,
            toaster: "b-toaster-bottom-right",
          });
        }
        this.isDisablingTwoFactorAuth = false;
        return;
      }

      this.$bvToast.toast(
        `You've successfully disabled two-factor authentication`,
        {
          title: "2FA disabled",
          autoHideDelay: 3000,
          variant: "success",
          solid: true,
          toaster: "b-toaster-bottom-right",
        }
      );

      this.$store.dispatch("user/getTotpEnabledStatus");
      this.$bvModal.hide("two-factor-auth-modal");
    },
    async changePassword() {
      const payload = {
        password: this.currentPassword,
        newPassword: this.newPassword,
      };

      this.isChangingPassword = true;

      try {
        await API.post(
          `${
            import.meta.env.VUE_APP_MANAGER_API_URL
          }/v1/account/change-password`,
          payload,
          false
        );
      } catch (error) {
        if (error.response && error.response.data) {
          this.$bvToast.toast(error.response.data, {
            title: "Error",
            autoHideDelay: 3000,
            variant: "danger",
            solid: true,
            toaster: "b-toaster-bottom-right",
          });
          if (error.response.data === "Incorrect password") {
            this.isIncorrectPassword = true;
          }
        }
        this.isChangingPassword = false;
        return;
      }

      this.$bvToast.toast(
        `You've successfully changed your Citadel's password`,
        {
          title: "Password Changed",
          autoHideDelay: 3000,
          variant: "success",
          solid: true,
          toaster: "b-toaster-bottom-right",
        }
      );

      this.isChangingPassword = false;

      // Remove passwords from view
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmNewPassword = "";
    },
    confirmUpdate() {
      this.$store.dispatch("system/confirmUpdate");
    },
    async checkForUpdate() {
      this.isCheckingForUpdate = true;
      await this.$store.dispatch("system/getAvailableUpdate");
      this.isCheckingForUpdate = false;
    },
    async openDebugModal() {
      this.showDmesg = false;
      this.debugFailed = false;
      this.loadingDebug = true;
      this.$refs["debug-modal"].show();
      try {
        await this.$store.dispatch("system/debug");
        while (this.loadingDebug) {
          await delay(1000);
          await this.$store.dispatch("system/getDebugResult");
          if (this.debugResult.status == "success") {
            this.loadingDebug = false;
          }
        }
      } catch (e) {
        this.debugFailed = true;
      }
    },
    closeDebugModal() {
      this.loadingDebug = false;
      this.$refs["debug-modal"].hide();
    },
    downloadTextFile(contents, fileName) {
      const blob = new Blob([contents], {
        type: "text/plain;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    async shutdownPrompt() {
      // Get user consent first
      const approved = await this.$bvModal.msgBoxConfirm(
        "Your Lightning wallet will not be able to receive any payments while your Citadel is offline.",
        { title: "Are you sure?" }
      );
      if (!approved) {
        return;
      }

      // Shutdown request
      let toastText = "";
      let toastOptions = {
        autoHideDelay: 3000,
        solid: true,
        toaster: "b-toaster-bottom-right",
      };
      try {
        await this.$store.dispatch("system/shutdown");
      } catch (e) {
        toastText = "Shutdown failed";
        toastOptions.title =
          "Something went wrong and Citadel was not able to shutdown";
        toastOptions.variant = "danger";
      }
      this.$bvToast.toast(toastText, toastOptions);
    },
    rebootPrompt() {
      // Reset any cached hasRebooted value from previous reboot
      this.$store.commit("system/setHasRebooted", false);
      this.$refs["reboot-modal"].show();
    },
    async reboot(event) {
      if (!this.hasRebooted) {
        event.preventDefault();
        try {
          await this.$store.dispatch("system/reboot");
        } catch (e) {
          this.$bvToast.toast("Reboot failed", {
            title: "Something went wrong and Citadel was not able to reboot",
            autoHideDelay: 3000,
            variant: "danger",
            solid: true,
            toaster: "b-toaster-bottom-right",
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
