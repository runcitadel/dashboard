<template>
  <b-alert
    v-if="percent < 99 && (requires === 'electrum' || requires === 'bitcoind')"
    variant="warning"
    show
  >
    <svg class="icon-clock icon-clock-warning me-1" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" />
      <line x1="0" y1="0" x2="8" y2="0" class="hour" />
      <line x1="0" y1="0" x2="12" y2="0" class="minute" />
    </svg>
    You will be able to connect {{ name }} to your Citadel
    {{ requires === "electrum" ? "~24 hours" : "" }} after Bitcoin Core has
    synchronized 100%.
  </b-alert>
  <card-widget v-else :header="`Here's how to connect ${name} to your Citadel`">
    <div class="px-3 px-lg-4 pb-3">
      <slot></slot>
      <b-alert v-if="requires === 'electrum'" variant="info" show>
        Unable to connect to {{ name }}? If Bitcoin Core has only recently
        finished syncing, please try connecting again in ~24 hours.
      </b-alert>
    </div>
  </card-widget>
</template>

<script>
import { mapState } from "vuex";
import CardWidget from "@/components/CardWidget";

export default {
  components: {
    CardWidget,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    requires: {
      type: String,
      default: "", //electrum, bitcoin-core, lnd, or empty if no specific protocol required
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      percent: (state) => state.bitcoin.percent,
    }),
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
