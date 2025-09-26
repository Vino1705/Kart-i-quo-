
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { useAuth } from '@/hooks/use-auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Transaction } from '@/lib/types';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';
import { CategorySpendingPieChart } from '@/components/reports/category-spending-pie-chart';

type MonthlyData = {
  month: string;
  income: number;
  expenses: number;
};

export default function ReportsPage() {
  const [monthlyChartData, setMonthlyChartData] = useState<MonthlyData[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const transactionsDocRef = doc(db, 'users', user.uid, 'transactions', 'data');
    const unsubscribe = onSnapshot(transactionsDocRef, (doc) => {
      if (doc.exists()) {
        const transactionData = doc.data();
        const items: Transaction[] = transactionData.items || [];
        setAllTransactions(items);
        
        // Process data for monthly overview chart
        const processMonthlyData = () => {
          const now = new Date();
          const monthlyTotals: MonthlyData[] = [];

          for (let i = 5; i >= 0; i--) {
            const date = subMonths(now, i);
            const monthName = format(date, 'MMM');
            
            const start = startOfMonth(date);
            const end = endOfMonth(date);

            const monthTransactions = items.filter(t => {
                const tDate = new Date(t.date);
                return tDate >= start && tDate <= end;
            });

            const income = monthTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);
              
            const expenses = monthTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);

            monthlyTotals.push({ month: monthName, income, expenses });
          }
          setMonthlyChartData(monthlyTotals);
        };
        
        processMonthlyData();
      }
    });

    return () => unsubscribe();
  }, [user]);

  const allTimeExpenses = allTransactions.filter(t => t.type === 'expense');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Financial Reports</CardTitle>
          <CardDescription>
            Analyze your income and spending habits over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Monthly Income vs. Expenses
              </CardTitle>
              <CardDescription>
                An overview of your finances for the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
               <OverviewChart data={monthlyChartData} />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                All-Time Spending by Category
              </CardTitle>
              <CardDescription>
                A breakdown of your total expenses across all categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategorySpendingPieChart expenses={allTimeExpenses} />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
