<template>
  <div class="py-3 px-3 px-lg-4 channel">
    <b-row>
      <b-col col cols="12" xl="3">
        <!-- on large screens -->
        <div class="d-none d-xl-block">
          <status :variant="statusVariant" size="sm">{{
            channel.status
          }}</status>
          <div>
            <span v-if="channel.remoteAlias">{{ channel.remoteAlias }}</span>
            <span
              v-else
              class="loading-placeholder loading-placeholder-sm d-block"
              style="width: 80%; margin-top: 8px"
            ></span>
          </div>
        </div>

        <!-- on small screens -->
        <div
          class="d-xl-none d-flex justify-content-between align-items-center mb-1"
        >
          <status :variant="statusVariant" size="sm">{{
            channel.status
          }}</status>
          <div>
            <small>{{ channel.remoteAlias }}</small>
          </div>
        </div>
      </b-col>
      <b-col col cols="12" xl="9">
        <div class>
          <div class="d-flex justify-content-between">
            <span
              v-b-tooltip.hover.right
              class="text-primary font-weight-bold"
              :title="$filters.satsToUSD(channel.localBalance)"
              >{{ $filters.localize($filters.unit(channel.localBalance)) }}
              {{ $filters.formatUnit(unit) }}</span
            >
            <span
              v-b-tooltip.hover.left
              :title="$filters.satsToUSD(channel.remoteBalance)"
              class="text-success text-right font-weight-bold"
              >{{ $filters.localize($filters.unit(channel.remoteBalance)) }}
              {{ $filters.formatUnit(unit) }}</span
            >
          </div>
          <bar
            :local="Number(channel.localBalance)"
            :remote="Number(channel.remoteBalance)"
            class="my-1"
          ></bar>
          <div class="d-flex justify-content-between">
            <small class="text-muted font-weight-bold">Max Send</small>
            <small class="text-muted font-weight-bold text-right"
              >Max Receive</small
            >
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Status from "@/components/Utility/Status.vue";
import Bar from "@/components/Channels/Bar.vue";

export default {
  components: {
    Status,
    Bar,
  },
  props: {
    channel: Object,
  },
  data() {
    return {};
  },
  computed: {
    unit() {
      return this.$store.state.system.unit;
    },
    statusVariant() {
      switch (this.channel.status) {
        case "Online":
          return "success";
        case "Opening":
          return "warning";
        case "Closing":
        case "unknown":
          return "danger";
        case "Offline":
        default:
          return "default";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.channel {
  transition: box-shadow 0.3s, background 0.3s ease;
  &:hover {
    cursor: pointer;
    background: linear-gradient(346.78deg, #f7fcfc 0%, #fafcfa 100%);
    box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.08);
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    // transform: translateY(-5px);
  }
}
</style>
