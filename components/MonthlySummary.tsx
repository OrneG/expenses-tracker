"use client";

import { formatCurrency } from "@/lib/formatters";
import { getNextCurrency, USD_TO_ARS_RATE } from "@/lib/currency";
import { useExpenses } from "@/context/ExpenseContext";

export default function MonthlySummary() {
  const {
    monthlySummary,
    summaryCurrency: currency,
    toggleSummaryCurrency,
  } = useExpenses();
  const nextCurrency = getNextCurrency(currency);

  return (
    <section className="summary" aria-label="Current month summary">
      <div>
        <p>This month</p>
        <strong>{formatCurrency(monthlySummary.total, currency)}</strong>
      </div>
      <div className="summary-actions">
        <button
          type="button"
          className="currency-toggle"
          onClick={toggleSummaryCurrency}
        >
          Total in {nextCurrency}
        </button>
        {monthlySummary.count > 0 && (
          <span>{`${monthlySummary.count} expenses logged`}</span>
        )}
      </div>
      <p className="exchange-rate">
        1 USD = {formatCurrency(USD_TO_ARS_RATE, "ARS")}
      </p>
    </section>
  );
}
