
'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from 'recharts';
import type { Transaction } from '@/lib/types';
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

interface CategorySpendingPieChartProps {
  expenses: Transaction[];
}

const chartConfig = {
  Food: { label: "Food", color: "hsl(var(--chart-1))" },
  Transport: { label: "Transport", color: "hsl(var(--chart-2))" },
  Entertainment: { label: "Entertainment", color: "hsl(var(--chart-3))" },
  Housing: { label: "Housing", color: "hsl(var(--chart-4))" },
  Other: { label: "Other", color: "hsl(var(--chart-5))" },
  Income: { label: "Income", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export function CategorySpendingPieChart({ expenses }: CategorySpendingPieChartProps) {
  const aggregatedData = React.useMemo(() => {
    if (!expenses) return [];
    const categoryMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      name: category,
      value: amount,
      fill: chartConfig[category as keyof typeof chartConfig]?.color || 'hsl(var(--muted))'
    }));
  }, [expenses]);
  
  if (!aggregatedData || aggregatedData.length === 0) {
    return (
        <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground text-sm">
            No expense data available to display the chart.
        </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie data={aggregatedData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5}>
            {aggregatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
           <Legend content={({ payload }) => {
              return (
                <ul className="flex flex-wrap gap-x-4 justify-center mt-4 text-sm">
                  {payload?.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: entry.color}}/>
                      <span>{entry.value}</span>
                    </li>
                  ))}
                </ul>
              )
            }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
