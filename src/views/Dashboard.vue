<template>
  <div class="p-sm-2">
    <div class="my-3 pb-2">
      <h1>
        {{ t(`greetings.${greeting}`, {username: userStore.name}) }}
      </h1>
      <p class="text-muted">{{ t('overview') }}</p>
    </div>
    <b-row>
      <b-col col cols="12" md="6" xl="4">
        <lightning-wallet></lightning-wallet>
      </b-col>
      <b-col col cols="12" md="6" xl="4">
        <card-widget
          header="Bitcoin Core"
          :status="{
            text:
              bitcoinStore.percent < 100 ? t('synchronizing') : t('running'),
            variant: 'success',
            blink: false,
          }"
          :sub-title="t('synchronized')"
          icon="icon-app-bitcoin.svg"
          :loading="
            lightningStore.percent < 100 || bitcoinStore.blocks.length === 0
          "
        >
          <template #title>
            <CountUp
              v-if="bitcoinStore.percent !== -1"
              :value="{
                endVal:
                  bitcoinStore.percent >= 99.99 ? 100 : bitcoinStore.percent,
                decimalPlaces: bitcoinStore.percent >= 99.99 ? 0 : 2,
              }"
              suffix="%"
            />
            <span
              v-else
              class="loading-placeholder loading-placeholder-lg"
              style="width: 140px"
            ></span>
          </template>
          <div class>
            <div class="d-flex w-100 justify-content-between px-3 px-lg-4">
              <p class="mb-1">{{ t('connected-peers') }}</p>
              <p>
                {{ bitcoinStore.stats.peers }}
              </p>
            </div>
            <blockchain></blockchain>
            <div class="px-3 px-lg-4 py-3">
              <router-link to="/bitcoin" class="card-link">{{
                t('manage')
              }}</router-link>
            </div>
          </div>
        </card-widget>
      </b-col>
      <b-col col cols="12" xl="4">
        <b-row>
          <b-col col cols="12" md="6" xl="12">
            <card-widget
              :header="t('bitcoin-wallet')"
              :status="{
                text:
                  lightningStore.percent < 100
                    ? t('synchronizing')
                    : t('running'),
                variant: 'success',
                blink: false,
              }"
              :sub-title="formatUnit(systemStore.unit)"
              icon="icon-app-bitcoin.svg"
              :loading="lightningStore.percent < 100"
            >
              <template #title>
                <div
                  v-if="btcBalance !== -1 && uiStore.showBalance"
                  v-tooltip.right="
                    satsToUSD(bitcoinStore.balance.total).toString()
                  "
                >
                  <CountUp
                    :value="{
                      endVal: btcBalance,
                      decimalPlaces: systemStore.unit === 'sats' ? 0 : 5,
                    }"
                  />
                </div>
                <div v-else-if="!uiStore.showBalance">
                  <span class="d-flex"> ***,*** </span>
                </div>

                <span
                  v-else
                  class="loading-placeholder loading-placeholder-lg"
                  style="width: 140px"
                ></span>
              </template>
              <div class="px-3 px-lg-4 pt-2 pb-3">
                <router-link to="/bitcoin" class="card-link">{{
                  t('manage')
                }}</router-link>
              </div>
            </card-widget>
          </b-col>
          <b-col col cols="12" md="6" xl="12">
            <storage-widget></storage-widget>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts" setup>
import useSystemStore from '../store/system';
import useUserStore from '../store/user';
import useBitcoinStore from '../store/bitcoin';
import useLightningStore from '../store/lightning';
import useUiStore from '../store/ui';
import {useI18n} from 'vue-i18n';

import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import {satsToBtc} from '../helpers/units';
import {satsToUSD, formatUnit} from '../helpers/filters';

import CountUp from '../components/Utility/CountUp.vue';
import CardWidget from '../components/CardWidget.vue';
import Blockchain from '../components/Blockchain.vue';
import LightningWallet from '../components/LightningWallet.vue';
import StorageWidget from '../components/Widgets/StorageWidget.vue';

const systemStore = useSystemStore();
const userStore = useUserStore();
const bitcoinStore = useBitcoinStore();
const lightningStore = useLightningStore();
const uiStore = useUiStore();
const {t} = useI18n();
const interval = ref<null | number>(null);

const btcBalance = computed(() => {
  //skip if still loading
  if (bitcoinStore.balance.total === -1) {
    return -1;
  }
  if (systemStore.unit === 'btc') {
    return satsToBtc(bitcoinStore.balance.total);
  }
  return bitcoinStore.balance.total;
});

const greeting = computed(() => {
  const currentHour = new Date().getHours();

  const greeting =
    currentHour >= 4 && currentHour < 12 // after 4:00AM and before 12:00PM
      ? 'morning'
      : currentHour >= 12 && currentHour <= 16 // after 12:00PM and before 5:00PM
      ? 'afternoon'
      : currentHour > 16 || currentHour < 4 // after 5:00PM or before 4:00AM (to accommodate our fellow hackers)
      ? 'evening'
      : 'fallback'; // if for some reason the calculation didn't work

  return greeting;
});
onMounted(() => {
  interval.value = window.setInterval(() => {
    bitcoinStore.getStats();
  }, 30000);
});
onBeforeUnmount(() => {
  window.clearInterval(interval.value as number);
});
</script>
