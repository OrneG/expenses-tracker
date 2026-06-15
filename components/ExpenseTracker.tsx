"use client";

import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import MonthlySummary from "@/components/MonthlySummary";
import { ExpenseProvider } from "@/context/ExpenseContext";

export default function ExpenseTracker() {
  return (
    <ExpenseProvider>
      <section className="tracker">
        <header className="tracker-header">
          <p className="eyebrow">House expenses</p>
        </header>

        <MonthlySummary />
        <ExpenseForm />
        <ExpenseList />
      </section>
    </ExpenseProvider>
  );
}
