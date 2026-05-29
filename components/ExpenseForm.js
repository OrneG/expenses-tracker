"use client";

import { useState } from "react";
import { CURRENCIES, getNextCurrency, parseAmount } from "@/lib/currency";

export default function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(CURRENCIES.USD);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const numericAmount = parseAmount(amount, currency);

    if (!trimmedName) {
      setError("Add a name for this expense.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    onAddExpense({
      name: trimmedName,
      amount: numericAmount,
      currency,
    });

    setName("");
    setAmount("");
    setError("");
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="expense-name">Expense name</label>
        <input
          id="expense-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Coffee, groceries, rent"
          autoComplete="off"
        />
      </div>

      <div className="field-group">
        <label htmlFor="expense-amount">Amount</label>
        <div className="amount-input">
          <button
            type="button"
            className="amount-currency-button"
            onClick={() => setCurrency(getNextCurrency(currency))}
            aria-label={`Change expense currency from ${currency}`}
          >
            {currency}
          </button>
          <input
            id="expense-amount"
            type="text"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button type="submit">Add expense</button>
    </form>
  );
}
