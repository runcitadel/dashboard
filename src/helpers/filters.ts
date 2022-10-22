import useSystemStore from '../store/system';
import {satsToBtc} from './units';

export function unit(value: number | string) {
  const store = useSystemStore();
  store.getUnit();
  if (store.unit === 'sats') {
    return Number(value);
  } else if (store.unit === 'btc') {
    return satsToBtc(Number(value));
  }
}
export function sats(value: number | string) {
  return Number(value);
}
export function btc(value: number | string) {
  return satsToBtc(Number(value));
}
export function formatUnit(unit: 'sats' | 'btc') {
  if (unit === 'sats') {
    return 'Sats';
  } else if (unit === 'btc') {
    return 'BTC';
  }
}
export function satsToUSD(
  value: string | number,
  price: number,
  currency: string,
) {
  if (isNaN(parseInt(value.toString()))) {
    return value;
  } else {
    return Number(satsToBtc(parseInt(value.toString())) * price).toLocaleString(
      navigator.language,
      {
        style: 'currency',
        currency,
      },
    );
  }
}
export function localize(n: number | string) {
  return Number(n).toLocaleString(undefined, {maximumFractionDigits: 8});
}
