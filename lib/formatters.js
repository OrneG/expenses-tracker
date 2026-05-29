const currencyLocales = {
  ARS: "es-AR",
  USD: "en-US",
};

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat(currencyLocales[currency] ?? "en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatShortDate(date) {
  return shortDateFormatter.format(new Date(date));
}
