import { BigNumber } from "bignumber.js";

// Never display numbers as exponents
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

export function btcToSats(input: number) {
  const btc = new BigNumber(input);
  const sats = btc.multipliedBy(100000000);

  if (isNaN(sats as unknown as number)) {
    return 0;
  }

  return Number(sats);
}

export function satsToBtc(input: number, decimals = 8) {
  const sats = new BigNumber(input);
  const btc = sats.dividedBy(100000000);

  if (isNaN(btc as unknown as number)) {
    return 0;
  }

  return Number(btc.decimalPlaces(decimals));
}

export function toPrecision(input: number, decimals = 8) {
  const number = new BigNumber(input);

  if (isNaN(number as unknown as number)) {
    return 0;
  }

  return number.decimalPlaces(decimals).toString();
}
