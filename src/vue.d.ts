import type useBitcoinStore from './store/bitcoin';
import type useSystemStore from './store/system';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $filters: {
      unit: (
        value: number | string,
        store: ReturnType<typeof useSystemStore>,
      ) => number | undefined;
      sats: (value: number | string) => number;
      btc: (value: number | string) => number;
      formatUnit: (unit: 'sats' | 'btc') => 'Sats' | 'BTC' | undefined;
      satsToUSD: (
        value: string | number,
        store: ReturnType<typeof useBitcoinStore>,
      ) => string | number;
      localize: (n: number | string) => string;
    };
  }
}
