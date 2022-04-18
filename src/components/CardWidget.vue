<template>
  <b-card
    header-tag="header"
    footer-tag="footer"
    no-body
    class="mb-4 card-custom"
  >
    <div v-if="loading" class="card-custom-loading-bar"></div>
    <!-- <template v-slot:header></template> -->
    <div>
      <div v-if="header" class="card-custom-header py-4 px-3 px-lg-4">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h6 class="mb-0 font-weight-normal text-muted">{{ header }}</h6>
          <status
            v-if="status"
            :variant="status.variant"
            :blink="!!status.blink"
            >{{ status.text }}</status
          >
          <!-- Only render this div if either there's a menu or a  -->
          <!-- header on the right, else it causes spacing issues -->
          <div v-if="!!$slots['header-right'] || !!$slots['menu']">
            <slot name="header-right"></slot>
            <b-dropdown
              variant="link"
              toggle-class="text-decoration-none p-0"
              no-caret
              right
              class="ms-2"
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
              <slot name="menu"></slot>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="card-custom-body">
        <div v-if="title || subTitle" class="card-app-info px-3 px-lg-4">
          <div class="d-flex w-100 justify-content-between mb-4">
            <div>
              <div>
                <h3 v-if="title" class="mb-1">{{ title }}</h3>
                <h3 v-else class="mb-1">
                  <slot name="title"></slot>
                </h3>
                <p v-if="subTitle" class="text-muted mb-0">{{ subTitle }}</p>
              </div>
            </div>
            <img v-if="icon" :alt="header" :src="src(icon)" />
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
    <!-- <template v-slot:footer></template> -->
  </b-card>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import Status from './Utility/Status.vue';

export default defineComponent({
  components: {
    Status,
  },
  props: {
    header: {
      type: String,
      default: '',
    },
    status: {
      type: Object as PropType<
        | {
            text: string;
            variant: 'success' | 'primary' | 'muted' | 'danger' | 'warning';
            blink: boolean;
          }
        | Record<string, never>
      >, // {text, variant, blink}
      required: false,
      default: () => {
        return undefined;
      },
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    loading: Boolean,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    src: (icon: string) => {
      return new URL(`../assets/${icon}`, import.meta.url).href;
    },
  },
});
</script>
