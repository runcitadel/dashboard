<template>
  <form @submit.prevent="openChannel">
    <b-row>
      <b-col col cols="12" sm="6">
        <label class="visually-hidden" for="peer-connection"
          >Lightning address</label
        >
        <b-form-input
          id="peer-connection"
          v-model="peerConnectionCode"
          class="mb-3 neu-input"
          placeholder="pubkey@ip:port"
          type="text"
          size="lg"
          :disabled="isOpening"
          autofocus
        ></b-form-input>
      </b-col>
      <b-col col cols="12" sm="6">
        <label class="visually-hidden" for="funding-amount">Amount</label>
        <div class="mb-3">
          <div>
            <b-input-group class="neu-input-group">
              <b-form-input
                id="funding-amount"
                v-model="fundingAmountInput"
                class="neu-input"
                type="text"
                size="lg"
                style="padding-right: 82px"
                :disabled="isOpening || sweep"
              ></b-form-input>
              <b-input-group-append class="neu-input-group-append">
                <sats-btc-switch
                  class="align-self-center"
                  size="sm"
                ></sats-btc-switch>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div class="mt-1 w-100 d-flex justify-content-between">
            <!-- TODO: Enable Sweep -->
            <!-- <b-form-checkbox v-model="sweep" size="sm" switch>
              <small class="text-muted">Use all funds</small>
            </b-form-checkbox>-->
            <div></div>
            <small
              class="text-muted d-block mb-0"
              :style="{opacity: fundingAmount > 0 ? 1 : 0}"
              >~ {{ $filters.satsToUSD(fundingAmount, bitcoinStore) }}</small
            >
          </div>
        </div>

        <!--<small
          >{{ btc.confirmed.toLocaleString() }} Sats available out of
          {{ btc.total.toLocaleString() }} and
          {{ btc.pending.toLocaleString() }} pending</small
        >-->
      </b-col>
    </b-row>
    <b-row>
      <b-col col cols="12" sm="6">
        <fee-selector :fee="fee" class v-model="selectedFee"></fee-selector>
      </b-col>
      <b-col class="d-flex" col cols="12" sm="6">
        <div
          class="mt-4 mt-sm-0 d-flex w-100 justify-content-between align-self-end"
        >
          <span>
            <small v-if="error" class="text-danger align-self-center">{{
              error
            }}</small>
          </span>
          <b-button
            type="submit"
            variant="success"
            :disabled="isOpening || !!error"
            >{{ isOpening ? 'Opening...' : 'Open Channel' }}</b-button
          >
        </div>
      </b-col>
    </b-row>
  </form>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import {satsToBtc, btcToSats} from '../../helpers/units';
import useToast from '../../utils/toast';

import SatsBtcSwitch from '../Utility/SatsBtcSwitch.vue';
import FeeSelector from '../Utility/FeeSelector.vue';

import useBitcoinStore from '../../store/bitcoin';
import useSdkStore from '../../store/sdk';
import useSystemStore from '../../store/system';

type data = {
  peerConnectionCode: string;
  fundingAmountInput: string;
  fundingAmount: number;
  isOpening: boolean;
  selectedFee: {
    type: 'custom' | 'fast' | 'normal' | 'slow' | 'cheapest';
    satPerByte: number;
  };
  fee: {
    fast: {
      total: number;
      perByte: string;
      error: false | string;
      sweepAmount: number;
    };
    normal: {
      total: number;
      perByte: string;
      error: false | string;
      sweepAmount: number;
    };
    slow: {
      total: number;
      perByte: string;
      error: false | string;
      sweepAmount: number;
    };
    cheapest: {
      total: number;
      perByte: string;
      error: false | string;
      sweepAmount: number;
    };
  };
  error: string;
  feeTimeout: null | number;
  sweep: boolean;
};
export default defineComponent({
  components: {
    SatsBtcSwitch,
    FeeSelector,
  },
  emits: ['channelopen'],
  setup() {
    const bitcoinStore = useBitcoinStore();
    const sdkStore = useSdkStore();
    const systemStore = useSystemStore();
    const toast = useToast();
    return {bitcoinStore, sdkStore, systemStore, toast};
  },
  data(): data {
    return {
      peerConnectionCode: '',
      fundingAmountInput: '',
      fundingAmount: 0,
      isOpening: false,
      selectedFee: {
        type: 'normal',
        satPerByte: 0,
      },
      fee: {
        fast: {
          total: 0,
          perByte: '--',
          error: '',
          sweepAmount: 0,
        },
        normal: {
          total: 0,
          perByte: '--',
          error: '',
          sweepAmount: 0,
        },
        slow: {
          total: 0,
          perByte: '--',
          error: '',
          sweepAmount: 0,
        },
        cheapest: {
          total: 0,
          perByte: '--',
          error: '',
          sweepAmount: 0,
        },
      },
      error: '',
      feeTimeout: null,
      sweep: false,
    } as data;
  },
  watch: {
    unit: function (val) {
      if (val === 'sats') {
        this.fundingAmount = Number(this.fundingAmountInput);
      } else if (val === 'btc') {
        this.fundingAmount = btcToSats(parseFloat(this.fundingAmountInput));
      }
      this.fetchFees();
    },
    sweep: function (val) {
      if (val) {
        if (this.systemStore.unit === 'btc') {
          this.fundingAmountInput = String(
            satsToBtc(this.bitcoinStore.balance.confirmed),
          );
        } else if (this.systemStore.unit === 'sats') {
          this.fundingAmountInput = String(this.bitcoinStore.balance.confirmed);
        }
      }
      this.fetchFees();
    },
    fundingAmountInput: function (val) {
      if (this.systemStore.unit === 'sats') {
        this.fundingAmount = Number(val);
      } else if (this.systemStore.unit === 'btc') {
        this.fundingAmount = btcToSats(val);
      }
      this.fetchFees();
    },
  },
  methods: {
    async openChannel() {
      this.isOpening = true;

      if (!this.peerConnectionCode || this.fundingAmount <= 0) {
        this.error = 'Please fill all fields';
        this.isOpening = false;
        return;
      }

      if (
        this.selectedFee.type !== 'custom' &&
        this.fee[this.selectedFee.type].error
      ) {
        this.isOpening = false;
        this.error = this.fee[this.selectedFee.type].error as string;
        return;
      }

      this.error = '';

      const payload: {
        amt: number;
        name: string;
        purpose: string;
        satPerByte: number;
        port?: string;
        pubKey?: string;
        ip?: string;
      } = {
        amt: this.sweep
          ? parseInt(
              this.fee[
                this.selectedFee.type as 'fast' | 'normal' | 'slow' | 'cheapest'
              ].sweepAmount as unknown as string,
              10,
            )
          : parseInt(this.fundingAmount as unknown as string, 10),
        name: '',
        purpose: '',
        satPerByte: parseInt(
          this.selectedFee.satPerByte as unknown as string,
          10,
        ),
      };

      const parsedConnectionCode = this.peerConnectionCode.match(
        /^(.*?)@(.*?)(?::([0-9]+))?$/,
      );

      if (parsedConnectionCode) {
        payload.pubKey = parsedConnectionCode[1];
        payload.ip = parsedConnectionCode[2];

        // If we matched a port in the connection code
        // Otherwise the backend will automatically determine which port to use
        if (parsedConnectionCode[3]) {
          payload.port = parsedConnectionCode[3];
        }
      } else {
        this.isOpening = false;
        this.error =
          'Please check the lightning address (also known as peer address)';
        return;
      }

      //to do: connect to onion node if only the user's node is running tor

      try {
        await this.sdkStore.citadel.middleware.lightning.channel.openChannel(
          payload.pubKey as string,
          payload.ip as string,
          payload.port as string,
          payload.amt,
          payload.satPerByte,
        );
        this.isOpening = false;
        this.$emit('channelopen');
        //channel
        setTimeout(() => {
          this.toast.success(
            'Lightning Network',
            `Channel of ${this.fundingAmount} Sats opened successfully`,
          );
        }, 200);
      } catch (error) {
        if (error) {
          this.isOpening = false;
          this.error = JSON.stringify(error);
          console.error(error);
        }
      }
    },

    async fetchFees() {
      if (this.feeTimeout) {
        clearTimeout(this.feeTimeout);
      }
      this.feeTimeout = window.setTimeout(async () => {
        this.error = '';
        if (this.fundingAmount) {
          let estimates;

          try {
            estimates =
              await this.sdkStore.citadel.middleware.lightning.channel.estimateFeeAll(
                this.fundingAmount,
                this.sweep,
              );
          } catch (error) {
            if (error) {
              this.error = JSON.stringify(error);
              console.error(error);
            }
          }

          if (estimates) {
            for (const [speed, estimate] of Object.entries(estimates)) {
              // If the API returned an error message
              if ((estimate as {text?: string}).text) {
                this.fee[speed as keyof typeof this.fee].total = 0;
                this.fee[speed as keyof typeof this.fee].perByte = 'N/A';
                this.fee[speed as keyof typeof this.fee].error = (
                  estimate as unknown as {text: string}
                ).text;
                this.fee[speed as keyof typeof this.fee].sweepAmount = 0;
              } else {
                this.fee[speed as keyof typeof this.fee].total = parseFloat(
                  estimate.feeSat.toString(),
                );
                this.fee[speed as keyof typeof this.fee].perByte =
                  estimate.satPerVbyte.toString();
                this.fee[speed as keyof typeof this.fee].sweepAmount =
                  parseFloat(
                    estimate.sweepAmount?.toString() as string,
                  ) as number;
                this.fee[speed as keyof typeof this.fee].error = false;
              }
            }
          }
        }
      }, 500);
    },
  },
});
</script>

<style lang="scss" scoped></style>
