"use client";

import { useEffect, useMemo, useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import MonthlySummary from "@/components/MonthlySummary";
import { CURRENCIES, convertAmount } from "@/lib/currency";

const STORAGE_KEY = "expenses-tracker:expenses";
const SUMMARY_CURRENCY_KEY = "expenses-tracker:summary-currency";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [summaryCurrency, setSummaryCurrency] = useState(CURRENCIES.USD);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedExpenses = window.localStorage.getItem(STORAGE_KEY);
    const storedSummaryCurrency =
      window.localStorage.getItem(SUMMARY_CURRENCY_KEY) ??
      window.localStorage.getItem("expenses-tracker:currency");

    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }

    if (
      storedSummaryCurrency === CURRENCIES.ARS ||
      storedSummaryCurrency === CURRENCIES.USD
    ) {
      setSummaryCurrency(storedSummaryCurrency);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      window.localStorage.setItem(SUMMARY_CURRENCY_KEY, summaryCurrency);
    }
  }, [expenses, isLoaded, summaryCurrency]);

  const monthlySummary = useMemo(() => {
    const now = new Date();

    return expenses.reduce(
      (summary, expense) => {
        const expenseDate = new Date(expense.createdAt);
        const isCurrentMonth =
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear();

        if (!isCurrentMonth) {
          return summary;
        }

        return {
          count: summary.count + 1,
          total:
            summary.total +
            convertAmount(
              expense.amount,
              expense.currency ?? CURRENCIES.USD,
              summaryCurrency,
            ),
        };
      },
      { count: 0, total: 0 },
    );
  }, [expenses, summaryCurrency]);

  function addExpense(expense) {
    setExpenses((currentExpenses) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...expense,
      },
      ...currentExpenses,
    ]);
  }

  function toggleSummaryCurrency() {
    setSummaryCurrency((currentCurrency) =>
      currentCurrency === CURRENCIES.USD ? CURRENCIES.ARS : CURRENCIES.USD,
    );
  }

  return (
    <section className="tracker">
      <header className="tracker-header">
        <p className="eyebrow">House expenses</p>
      </header>

      <MonthlySummary
        currency={summaryCurrency}
        total={monthlySummary.total}
        expenseCount={monthlySummary.count}
        onToggleCurrency={toggleSummaryCurrency}
      />
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList expenses={expenses} />
    </section>
  );
}
