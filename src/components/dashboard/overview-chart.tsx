
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function OverviewChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} accessibilityLayer>
            <XAxis
              dataKey="month"
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground">
          Not enough transaction data to display the chart. Log some transactions to get started.
        </div>
      )}
    </ChartContainer>
  )
}
