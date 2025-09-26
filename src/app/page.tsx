import { GoalsSummary } from '@/components/dashboard/goals-summary';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AiFeatures } from '@/components/dashboard/ai-features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewChart } from '@/components/dashboard/overview-chart';

export default function Home() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹0.00</div>
            <p className="text-xs text-muted-foreground">
              Based on your entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <span className="text-2xl">🏦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹0.00</div>
            <p className="text-xs text-muted-foreground">
              Based on your entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <span className="text-2xl">💸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹0.00</div>
            <p className="text-xs text-muted-foreground">
              Based on your entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Limit</CardTitle>
            <span className="text-2xl">⚖️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹300.00</div>
            <p className="text-xs text-muted-foreground">
              Your suggested daily spend
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <GoalsSummary />
          <AiFeatures />
        </div>
      </div>
       <RecentTransactions />
    </>
  );
}
