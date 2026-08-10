import { useMemo } from "react";
import { useBudget } from "../context/BudgetContext";

/**
 * Computes all derived data needed by the Dashboard page:
 * sorted recent transactions, spending percentage, chart data, and spending breakdown.
 */
export function useDashboardData() {
  const { stats, transactions, budgetGoal } = useBudget();

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [transactions]
  );

  const spendingPercentage = Math.min((stats.expenses / budgetGoal) * 100, 100);

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        month: d.getMonth(),
        year: d.getFullYear(),
        name: d.toLocaleString("default", { month: "short" }),
      };
    });

    return months.map(({ month, year, name }) => {
      const total = transactions
        .filter((t) => t.type === "expense")
        .filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === month && d.getFullYear() === year;
        })
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      return { name, amount: total };
    });
  }, [transactions]);

  const { spendingData, totalSpending } = useMemo(() => {
    const data = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => {
        const existing = acc.find((item) => item.name === curr.category);
        if (existing) {
          existing.value += Number(curr.amount);
        } else {
          acc.push({ name: curr.category, value: Number(curr.amount) });
        }
        return acc;
      }, []);

    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    return { spendingData: data, totalSpending: total };
  }, [transactions]);

  return {
    stats,
    budgetGoal,
    sortedTransactions,
    spendingPercentage,
    chartData,
    spendingData,
    totalSpending,
  };
}
