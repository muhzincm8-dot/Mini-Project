import { StatsRow } from "../components/dashboard/StatRows";
import { BudgetHealth } from "../components/dashboard/BudgetHealth";
import { SpendingProfile } from "../components/dashboard/SpeandingProfile";
import { RecentTransactions } from "../components/dashboard/RecentTransation";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
    const {
        stats,
        budgetGoal,
        sortedTransactions,
        spendingPercentage,
        chartData,
        spendingData,
        totalSpending,
    } = useDashboardData();

    return (
        <div className="space-y-6">
            <StatsRow stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BudgetHealth
                    spendingPercentage={spendingPercentage}
                    budgetGoal={budgetGoal}
                    chartData={chartData}
                />
                <SpendingProfile
                    spendingData={spendingData}
                    totalSpending={totalSpending}
                />
            </div>

            <RecentTransactions transactions={sortedTransactions} />
        </div>
    );
}
