import type { Currency } from "@/lib/currency";

const currencyLocales = {
  ARS: "es-AR",
  USD: "en-US",
} satisfies Record<Currency, string>;

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function formatCurrency(amount: number, currency: Currency = "USD") {
  return new Intl.NumberFormat(currencyLocales[currency] ?? "en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatShortDate(date: string) {
  return shortDateFormatter.format(new Date(date));
}
