import { parseAmount } from "@/lib/currency";
import type { Currency } from "@/lib/currency";

const TOTAL_LINE_PATTERN = /\btotal\b/i;
const AMOUNT_PATTERN =
  /(?:[$]\s*)?(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{2})?|\d+(?:[.,]\d{2})?)/g;

export function extractTotalAmount(receiptText: string, currency: Currency) {
  const totalLines = receiptText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => TOTAL_LINE_PATTERN.test(line));

  for (const line of totalLines.reverse()) {
    const matches = [...line.matchAll(AMOUNT_PATTERN)];
    const amountMatch = matches.at(-1)?.[1];

    if (!amountMatch) {
      continue;
    }

    const amount = parseAmount(amountMatch, currency);

    if (Number.isFinite(amount) && amount > 0) {
      return amount;
    }
  }

  return null;
}
