export const CURRENCY_SYMBOL = {
  USD: '$',
  CAD: 'CA$',
  EUR: '€',
  GBP: '£',
  CHF: 'CHF',
  JPY: '¥',
};

const RATES_FROM_GBP = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.16,
  CAD: 1.74,
  CHF: 1.14,
  JPY: 197,
};

export function convertFromGBP(amountGBP, currency = 'GBP') {
  const rate = RATES_FROM_GBP[currency] ?? 1;
  return amountGBP * rate;
}

export function formatPriceFromGBP(amountGBP, currency = 'GBP') {
  const sym = CURRENCY_SYMBOL[currency] ?? '';
  const raw = convertFromGBP(amountGBP, currency);
  const fractionDigits = currency === 'JPY' ? 0 : 2;
  const value = raw.toFixed(fractionDigits);
  return `${sym}${value}`;
}
