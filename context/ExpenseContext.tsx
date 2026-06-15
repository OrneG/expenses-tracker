"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { ReactNode } from "react";
import { CURRENCIES, convertAmount, isCurrency } from "@/lib/currency";
import type { Currency } from "@/lib/currency";
import type { Expense, ExpenseInput, MonthlySummary } from "@/lib/types";

const STORAGE_KEY = "expenses-tracker:expenses";
const SUMMARY_CURRENCY_KEY = "expenses-tracker:summary-currency";

type ExpenseContextValue = {
  addExpense: (expense: ExpenseInput) => void;
  expenses: Expense[];
  monthlySummary: MonthlySummary;
  summaryCurrency: Currency;
  toggleSummaryCurrency: () => void;
};

type ExpenseProviderProps = {
  children: ReactNode;
};

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

function parseStoredExpenses(value: string): Expense[] {
  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((expense): expense is Expense => {
      if (!expense || typeof expense !== "object") {
        return false;
      }

      const possibleExpense = expense as Partial<Expense>;

      return (
        typeof possibleExpense.amount === "number" &&
        typeof possibleExpense.createdAt === "string" &&
        typeof possibleExpense.id === "string" &&
        typeof possibleExpense.name === "string"
      );
    });
  } catch {
    return [];
  }
}

export function ExpenseProvider({ children }: ExpenseProviderProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summaryCurrency, setSummaryCurrency] = useState<Currency>(
    CURRENCIES.USD,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedExpenses = window.localStorage.getItem(STORAGE_KEY);
    const storedSummaryCurrency =
      window.localStorage.getItem(SUMMARY_CURRENCY_KEY) ??
      window.localStorage.getItem("expenses-tracker:currency");

    if (storedExpenses) {
      setExpenses(parseStoredExpenses(storedExpenses));
    }

    if (isCurrency(storedSummaryCurrency)) {
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

  const monthlySummary = useMemo<MonthlySummary>(() => {
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
              isCurrency(expense.currency) ? expense.currency : CURRENCIES.USD,
              summaryCurrency,
            ),
        };
      },
      { count: 0, total: 0 },
    );
  }, [expenses, summaryCurrency]);

  const generateExpenseId = () => {
    if (typeof crypto === "object" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    return `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const addExpense = useCallback((expense: ExpenseInput) => {
    setExpenses((currentExpenses) => [
      {
        id: generateExpenseId(),
        createdAt: new Date().toISOString(),
        ...expense,
      },
      ...currentExpenses,
    ]);
  }, []);

  const toggleSummaryCurrency = useCallback(() => {
    setSummaryCurrency((currentCurrency) =>
      currentCurrency === CURRENCIES.USD ? CURRENCIES.ARS : CURRENCIES.USD,
    );
  }, []);

  const value = useMemo<ExpenseContextValue>(
    () => ({
      addExpense,
      expenses,
      monthlySummary,
      summaryCurrency,
      toggleSummaryCurrency,
    }),
    [addExpense, expenses, monthlySummary, summaryCurrency, toggleSummaryCurrency],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error("useExpenses must be used inside ExpenseProvider");
  }

  return context;
}
