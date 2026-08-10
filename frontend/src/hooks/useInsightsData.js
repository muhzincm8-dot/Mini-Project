import { useMemo } from "react";
import { useBudget } from "../context/BudgetContext";

/**
 * Computes all derived data needed by the Insights page:
 * category breakdown, monthly expenses/income, net delta, and projected burn.
 */
export function useInsightsData() {
  const { transactions, budgetGoal, setBudgetGoal } = useBudget();

  const categoryData = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, curr) => {
          const existing = acc.find((item) => item.name === curr.category);
          if (existing) {
            existing.value += Number(curr.amount);
          } else {
            acc.push({ name: curr.category, value: Number(curr.amount) });
          }
          return acc;
        }, []),
    [transactions]
  );

  const { currentMonthExpenses, currentMonthIncome } = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const expenses = transactions
      .filter((t) => t.type === "expense" && new Date(t.date).getMonth() === currentMonth)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const income = transactions
      .filter((t) => t.type === "income" && new Date(t.date).getMonth() === currentMonth)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return { currentMonthExpenses: expenses, currentMonthIncome: income };
  }, [transactions]);

  const netDelta = currentMonthIncome - currentMonthExpenses;
  const projectedBurn = currentMonthExpenses * 1.1;

  return {
    transactions,
    budgetGoal,
    setBudgetGoal,
    categoryData,
    currentMonthExpenses,
    currentMonthIncome,
    netDelta,
    projectedBurn,
  };
}
