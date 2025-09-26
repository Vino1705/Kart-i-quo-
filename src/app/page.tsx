
'use client';

import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Financials = {
  totalIncome: number;
  totalMandatoryExpenses: number;
  dailySpendingLimit: number;
  goalSavingsSuggestion: number;
};

export default function Home() {
  const [financials, setFinancials] = useState<Financials | null>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchFinancials = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.financials) {
          setFinancials(data.financials);
        } else {
          router.push('/onboarding');
        }
      } else {
        // This case can happen if the user exists in Auth but not in Firestore.
        // It's good practice to create their Firestore doc here or send to onboarding.
        router.push('/onboarding');
      }
    };

    fetchFinancials();
  }, [user, loading, router]);

  if (loading || !financials) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  const savings = financials.totalIncome - financials.totalMandatoryExpenses;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹{financials.totalIncome.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">
              Your monthly income
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <span className="text-2xl">🏦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹{savings.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">
              After mandatory expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mandatory Expenses</CardTitle>
            <span className="text-2xl">💸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹{financials.totalMandatoryExpenses.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">
              Your fixed monthly costs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Limit</CardTitle>
            <span className="text-2xl">⚖️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹{financials.dailySpendingLimit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Suggested discretionary spend
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Overview</CardTitle>
             <CardDescription>A quick look at your recent financial activity. For more details, visit the <Link href="/reports" className="underline">Reports page</Link>.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={[]} />
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
