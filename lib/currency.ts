export const CURRENCIES = {
  ARS: "ARS",
  USD: "USD",
} as const;

export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];

export const USD_TO_ARS_RATE = 1409.42;

export function isCurrency(value: unknown): value is Currency {
  return value === CURRENCIES.ARS || value === CURRENCIES.USD;
}

export function getNextCurrency(currency: Currency): Currency {
  return currency === CURRENCIES.USD ? CURRENCIES.ARS : CURRENCIES.USD;
}

export function convertAmount(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === CURRENCIES.USD && toCurrency === CURRENCIES.ARS) {
    return amount * USD_TO_ARS_RATE;
  }

  return amount / USD_TO_ARS_RATE;
}

function parseLocalizedNumber(value: string) {
  const normalizedValue = value.trim().replace(/[^\d,.-]/g, "");
  const lastCommaIndex = normalizedValue.lastIndexOf(",");
  const lastDotIndex = normalizedValue.lastIndexOf(".");

  if (lastCommaIndex >= 0 && lastDotIndex >= 0) {
    const decimalSeparator = lastCommaIndex > lastDotIndex ? "," : ".";

    return Number(
      normalizedValue
        .replace(decimalSeparator === "," ? /\./g : /,/g, "")
        .replace(decimalSeparator, "."),
    );
  }

  if (lastCommaIndex >= 0) {
    const decimalDigits = normalizedValue.length - lastCommaIndex - 1;

    return Number(
      decimalDigits === 2
        ? normalizedValue.replace(",", ".")
        : normalizedValue.replace(/,/g, ""),
    );
  }

  if (lastDotIndex >= 0) {
    const decimalDigits = normalizedValue.length - lastDotIndex - 1;

    return Number(
      decimalDigits === 3
        ? normalizedValue.replace(/\./g, "")
        : normalizedValue,
    );
  }

  return Number(normalizedValue);
}

export function parseAmount(value: string, currency: Currency) {
  if (currency === CURRENCIES.ARS) {
    return parseLocalizedNumber(value);
  }

  return Number(value.trim().replace(/,/g, ""));
}
