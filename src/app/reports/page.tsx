
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { useAuth } from '@/hooks/use-auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Transaction } from '@/lib/types';
import { subMonths, format, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { CategorySpendingPieChart } from '@/components/reports/category-spending-pie-chart';

type MonthlyData = {
  month: string;
  income: number;
  expenses: number;
};

export default function ReportsPage() {
  const [monthlyChartData, setMonthlyChartData] = useState<MonthlyData[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const transactionsDocRef = doc(db, 'users', user.uid, 'transactions', 'data');
    const unsubscribe = onSnapshot(transactionsDocRef, (doc) => {
      if (doc.exists()) {
        const transactionData = doc.data();
        const items: Transaction[] = transactionData.items || [];
        setAllTransactions(items);
      }
    });

    return () => unsubscribe();
  }, [user]);
  
  useEffect(() => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      case 'all':
      default:
        // A very old date to include all transactions
        startDate = new Date(0); 
        break;
    }
    
    const filtered = allTransactions.filter(t => new Date(t.date) >= startDate);
    setFilteredTransactions(filtered);

  }, [allTransactions, dateRange]);


  useEffect(() => {
    if (!filteredTransactions) return;
    // Process data for monthly overview chart
    const processMonthlyData = () => {
      const now = new Date();
      const monthlyTotals: MonthlyData[] = [];
      const monthsToDisplay = dateRange === '6m' || dateRange === 'all' || dateRange === '90d' ? 6 : 1;

      for (let i = monthsToDisplay - 1; i >= 0; i--) {
        const date = subMonths(now, i);
        const monthName = format(date, 'MMM');
        
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const monthTransactions = filteredTransactions.filter(t => {
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
      // If range is 30 days, just show one summary bar
      if (monthsToDisplay === 1) {
        const income = filteredTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
        setMonthlyChartData([{ month: 'Last 30 Days', income, expenses }]);
      } else {
        setMonthlyChartData(monthlyTotals);
      }
    };
    
    processMonthlyData();
  }, [filteredTransactions, dateRange]);

  const filteredExpenses = filteredTransactions.filter(t => t.type === 'expense');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline">Financial Reports</CardTitle>
                <CardDescription>
                    Analyze your income and spending habits over time.
                </CardDescription>
            </div>
            <div className="w-[180px]">
                <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="6m">Last 6 months</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Income vs. Expenses
              </CardTitle>
              <CardDescription>
                An overview of your finances for the selected period.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
               <OverviewChart data={monthlyChartData} />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Spending by Category
              </CardTitle>
              <CardDescription>
                A breakdown of your expenses for the selected period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategorySpendingPieChart expenses={filteredExpenses} />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
