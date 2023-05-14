<template>
  <div class="p-sm-2">
    <div class="my-3 pb-2">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-start align-items-center">
          <img
            style="
              height: auto;
              width: 12vw;
              max-width: 100px;
              border-radius: 12px !important;
            "
            class="me-2 me-sm-3"
            :src="
              src(
                lightningStore.implementation === 'lnd'
                  ? 'icon-app-lnd.svg'
                  : 'icon-app-c-lightning.svg',
              )
            "
          />
          <div>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="4" r="4" fill="#00CD98" />
            </svg>
            <small class="ms-1 text-success">{{ status }}</small>
            <h3 class="d-block font-weight-bold mb-1">Lightning Network</h3>
            <span class="d-block text-body-secondary">
              {{ lightningVersion }}
            </span>
          </div>
        </div>
        <div>
          <b-dropdown
            variant="link"
            toggle-class="text-decoration-none p-0"
            no-caret
            right
          >
            <template #button-content>
              <svg
                width="18"
                height="4"
                viewBox="0 0 18 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z"
                  fill="#6c757d"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9 4C10.1046 4 11 3.10457 11 2C11 0.89543 10.1046 0 9 0C7.89543 0 7 0.89543 7 2C7 3.10457 7.89543 4 9 4Z"
                  fill="#6c757d"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16 4C17.1046 4 18 3.10457 18 2C18 0.89543 17.1046 0 16 0C14.8954 0 14 0.89543 14 2C14 3.10457 14.8954 4 16 4Z"
                  fill="#6c757d"
                />
              </svg>
            </template>
            <b-dropdown-item
              @click.prevent="showNodeAddressModal = true"
              href="#"
              >Lightning Node Address</b-dropdown-item
            >
            <!-- <b-dropdown-divider /> -->
            <!-- <b-dropdown-item variant="danger" href="#" disabled>Stop LND</b-dropdown-item> -->
          </b-dropdown>

          <b-modal
            id="lightning-address-modal"
            size="lg"
            v-model="showNodeAddressModal"
            show
            centered
            hide-footer
          >
            <template #modal-header>
              <div
                class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100"
              >
                <h3 class="text-lowercase">Lightning Node Address</h3>
                <!-- Emulate built in modal header close button action -->
                <a
                  href="#"
                  class="align-self-center"
                  @click.stop.prevent="showNodeAddressModal = false"
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
            <div class="px-2 px-sm-3 pb-2 pb-sm-3">
              <div class="d-flex align-items-center">
                <!-- Pubkey QR Code -->
                <qr-code
                  :value="
                    lightningStore.uris.length
                      ? lightningStore.uris[0]
                      : lightningStore.pubkey
                  "
                  :size="180"
                  class="qr-image mx-auto"
                  show-logo
                ></qr-code>
                <div class="w-100 align-self-center ms-3 ms-sm-4">
                  <p>
                    Other Lightning nodes can open payment channels to your node
                    on the following address
                  </p>
                  <div v-if="lightningStore.uris.length">
                    <input-copy
                      v-for="uri in lightningStore.uris"
                      :key="uri"
                      class="mb-2"
                      size="sm"
                      :value="uri"
                    ></input-copy>
                  </div>
                  <span
                    v-else
                    class="loading-placeholder loading-placeholder-lg mt-1"
                    style="width: 100%"
                  ></span>
                </div>
              </div>
            </div>
          </b-modal>
        </div>
      </div>
    </div>
    <b-row class="row-eq-height">
      <b-col col cols="12" md="6" xl="4">
        <lightning-wallet></lightning-wallet>
      </b-col>
      <b-col col cols="12" md="6" xl="8">
        <card-widget header="Payment Channels">
          <template #header-right v-if="ENABLE_CHANNEL_OPEN">
            <b-button
              @click.prevent="showOpenChannelModal = true"
              variant="outline-primary"
              size="sm"
              >+ Open Channel</b-button
            >
          </template>
          <!--<template #menu>
            <b-dropdown-item
              href="#"
              >Download channel backup file</b-dropdown-item
            >
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-group>
              <div class="dropdown-group">
                <div class="d-flex w-100 justify-content-between">
                  <div>
                    <span class="d-block">Automatic backups</span>
                    <small class="d-block">
                      <a
                        href="https://github.com/runcitadel/core/blob/main/scripts/backup/README.md"
                        target="blank"
                        >Learn more</a
                      >
                    </small>
                  </div>
                  <toggle-switch
                    class="align-self-center"
                    disabled
                    tooltip="Sorry, automatic backups cannot be disabled for now"
                  ></toggle-switch>
                </div>
                <small
                  v-if="systemStore.backupStatus.status"
                  class="d-block mt-2"
                  style="opacity: 0.4"
                >
                  Last backup
                  <span v-if="systemStore.backupStatus.status === 'failed'"
                    >failed</span
                  >
                  at
                  {{
                    getReadableTime(
                      systemStore.backupStatus.timestamp as number,
                    )
                  }}
                </small>
              </div>
            </b-dropdown-group>
          </template>-->
          <div class>
            <div class="px-3 px-lg-4">
              <b-row>
                <b-col col cols="6" xl="3">
                  <stat
                    title="Connections"
                    :value="lightningStore.numPeers"
                    suffix="Peers"
                    show-numeric-change
                  ></stat>
                </b-col>
                <b-col col cols="6" xl="3">
                  <stat
                    title="Active Channels"
                    :value="lightningStore.numActiveChannels"
                    suffix="Channels"
                    show-numeric-change
                  ></stat>
                </b-col>
                <b-col col cols="6" xl="3">
                  <stat
                    title="Max Send"
                    :value="($filters.unit(lightningStore.maxSend, systemStore) as number)"
                    :suffix="$filters.formatUnit(systemStore.unit)"
                    :has-decimals="systemStore.unit === 'btc'"
                    abbreviate-value
                  ></stat>
                </b-col>
                <b-col col cols="6" xl="3">
                  <stat
                    title="Max Receive"
                    :value="
                      $filters.unit(lightningStore.maxReceive, systemStore) as number
                    "
                    :suffix="$filters.formatUnit(systemStore.unit)"
                    :has-decimals="systemStore.unit === 'btc'"
                    abbreviate-value
                  ></stat>
                </b-col>
              </b-row>
            </div>

            <b-modal
              id="open-channel-modal"
              ref="open-channel-modal"
              size="lg"
              centered
              hide-footer
            >
              <template #modal-header="{close}">
                <div
                  class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100"
                >
                  <h2>open channel</h2>
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
              <div class="px-2 px-sm-3 py-2">
                <channel-open @channelopen="onChannelOpen"></channel-open>
              </div>
            </b-modal>

            <!-- manage channel modal -->
            <b-modal
              id="manage-channel-modal"
              v-model="showManageChannelModal"
              size="lg"
              centered
              hide-footer
            >
              <template #modal-header>
                <div
                  class="px-2 px-sm-3 pt-2 d-flex justify-content-between w-100"
                >
                  <h2>channel details</h2>
                  <!-- Emulate built in modal header close button action -->
                  <a
                    href="#"
                    class="align-self-center"
                    @click.stop.prevent="showManageChannelModal = false"
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
              <div class="px-2 px-sm-3 py-2">
                <!-- Don't render this if there is no channel selected -->
                <channel-manage
                  v-if="selectedChannel"
                  :channel="selectedChannel"
                  @channelclose="onChannelClose"
                ></channel-manage>
              </div>
            </b-modal>
            <channel-list @selectchannel="manageChannel" />
          </div>
        </card-widget>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {format} from 'date-fns';

import CardWidget from '../components/CardWidget.vue';
import Stat from '../components/Utility/Stat.vue';
import LightningWallet from '../components/LightningWallet.vue';
import QrCode from '../components/Utility/QrCode.vue';
import InputCopy from '../components/Utility/InputCopy.vue';
import ChannelList from '../components/Channels/List.vue';
import ChannelOpen from '../components/Channels/Open.vue';
import ChannelManage from '../components/Channels/Manage.vue';

import useBitcoinStore from '../store/bitcoin';
import useLightningStore, {ParsedChannel} from '../store/lightning';
import useSystemStore from '../store/system';

import {ENABLE_CHANNEL_OPEN} from '../utils/feature-flags';

const status = ref('Running');
const selectedChannel = ref<ParsedChannel | null>(null);
const interval = ref<number | null>(null);
const showNodeAddressModal = ref(false);
const showOpenChannelModal = ref(false);
const showManageChannelModal = ref(false);

const bitcoinStore = useBitcoinStore();
const lightningStore = useLightningStore();
const systemStore = useSystemStore();

const lightningVersion = computed((): string => {
  let version = lightningStore.version || '...';
  if (!version.startsWith('v') && version !== '...') {
    version = 'v' + version;
  }
  return version;
});
onMounted(() => {
  fetchPageData();
  lightningStore.getLndConnectUrls();
  systemStore.getBackupStatus();
  interval.value = window.setInterval(fetchPageData, 10000);
});
onBeforeUnmount(() => {
  window.clearInterval(interval.value!);
});
function getReadableTime(timestamp: number | Date) {
  return format(new Date(timestamp), 'MMM d, h:mm:ss a');
}
function manageChannel(channel: ParsedChannel) {
  if (channel) {
    selectedChannel.value = channel;
    showManageChannelModal.value = true;
  }
}
function onChannelOpen() {
  //refresh channels, balance and txs
  fetchPageData();
  showOpenChannelModal.value = false;

  //refresh bitcoin balance and txs
  bitcoinStore.getBalance();
  bitcoinStore.getTransactions();
}
function onChannelClose() {
  //refresh channels, balance and txs
  fetchPageData();
  showManageChannelModal.value = false;

  //refresh bitcoin balance and txs
  bitcoinStore.getBalance();
  bitcoinStore.getTransactions();
}
function fetchPageData() {
  lightningStore.getLndPageData();
}
function src(icon: string) {
  return new URL(`../assets/${icon}`, import.meta.url).href;
}
</script>
