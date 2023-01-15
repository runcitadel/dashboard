import type useSystemStore from './store/system';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      unit: (
        value: number | string,
        store: ReturnType<typeof useSystemStore>,
      ) => number | undefined;
      sats: (value: number | string) => number;
      btc: (value: number | string) => number;
      formatUnit: (unit: 'sats' | 'btc') => 'Sats' | 'BTC' | undefined;
      localize: (n: number | string) => string;
    };
  }
}
