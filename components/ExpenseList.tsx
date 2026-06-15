"use client";

import { formatCurrency, formatShortDate } from "@/lib/formatters";
import { CURRENCIES, isCurrency } from "@/lib/currency";
import { useExpenses } from "@/context/ExpenseContext";

export default function ExpenseList() {
  const { expenses } = useExpenses();

  return (
    <section className="expense-list-section" aria-labelledby="expense-list-title">
      <div className="section-heading">
        <h2 id="expense-list-title">Recent expenses</h2>
        <span>{expenses.length}</span>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses yet.</p>
          <span>Add your first expense above.</span>
        </div>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li className="expense-item" key={expense.id}>
              <div>
                <p>{expense.name}</p>
                <time dateTime={expense.createdAt}>
                  {formatShortDate(expense.createdAt)}
                </time>
              </div>
              <strong>
                {formatCurrency(
                  expense.amount,
                  isCurrency(expense.currency) ? expense.currency : CURRENCIES.USD,
                )}
              </strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
