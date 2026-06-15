import type { Currency } from "@/lib/currency";

export type ExpenseInput = {
  amount: number;
  currency: Currency;
  name: string;
};

export type Expense = ExpenseInput & {
  createdAt: string;
  id: string;
};

export type MonthlySummary = {
  count: number;
  total: number;
};
