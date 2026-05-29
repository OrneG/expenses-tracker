export const CURRENCIES = {
  ARS: "ARS",
  USD: "USD",
};

export const USD_TO_ARS_RATE = 1409.42;

export function getNextCurrency(currency) {
  return currency === CURRENCIES.USD ? CURRENCIES.ARS : CURRENCIES.USD;
}

export function convertAmount(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === CURRENCIES.USD && toCurrency === CURRENCIES.ARS) {
    return amount * USD_TO_ARS_RATE;
  }

  return amount / USD_TO_ARS_RATE;
}

export function parseAmount(value, currency) {
  const normalizedValue = value.trim();

  if (currency === CURRENCIES.ARS) {
    return Number(normalizedValue.replace(/\./g, "").replace(",", "."));
  }

  return Number(normalizedValue.replace(/,/g, ""));
}
