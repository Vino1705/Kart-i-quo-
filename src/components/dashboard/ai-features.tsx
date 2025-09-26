'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  forecastExpenses,
  ForecastExpensesOutput,
} from '@/ai/flows/expense-forecasting';
import {
  simulateBudgetScenarios,
  SimulateBudgetScenariosOutput,
} from '@/ai/flows/simulate-budget-scenarios';
import {
  getSafetyNetRecommendations,
  SafetyNetRecommendationsOutput,
} from '@/ai/flows/safety-net-recommendations';
import { Loader2 } from 'lucide-react';

const mockPastExpenses = JSON.stringify(
  [
    { date: '2024-06-01', amount: 1200, category: 'Rent' },
    { date: '2024-06-05', amount: 150, category: 'Groceries' },
    { date: '2024-06-15', amount: 200, category: 'Utilities' },
    { date: '2024-06-20', amount: 80, category: 'Entertainment' },
  ],
  null,
  2
);

const mockSeasonalTrends = JSON.stringify(
  {
    'December': 'Higher spending on gifts and travel.',
    'July': 'Higher spending on vacations.'
  },
  null,
  2
);

export function AiFeatures() {
  const [activeTab, setActiveTab] = useState('forecast');
  
  const [forecastResult, setForecastResult] = useState<ForecastExpensesOutput | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  const [scenarioResult, setScenarioResult] = useState<SimulateBudgetScenariosOutput | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);

  const [safetyNetResult, setSafetyNetResult] = useState<SafetyNetRecommendationsOutput | null>(null);
  const [safetyNetLoading, setSafetyNetLoading] = useState(false);

  async function handleForecast(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setForecastLoading(true);
    setForecastResult(null);
    const formData = new FormData(event.currentTarget);
    const pastExpenses = formData.get('pastExpenses') as string;
    const seasonalTrends = formData.get('seasonalTrends') as string;
    const result = await forecastExpenses({ pastExpenses, seasonalTrends });
    setForecastResult(result);
    setForecastLoading(false);
  }

  async function handleSimulate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setScenarioLoading(true);
    setScenarioResult(null);
    const formData = new FormData(event.currentTarget);
    const result = await simulateBudgetScenarios({
        currentIncome: Number(formData.get('currentIncome')),
        currentExpenses: Number(formData.get('currentExpenses')),
        incomeChange: Number(formData.get('incomeChange')),
        expenseChanges: formData.get('expenseChanges') as string,
    });
    setScenarioResult(result);
    setScenarioLoading(false);
  }
  
  async function handleSafetyNet() {
    setSafetyNetLoading(true);
    setSafetyNetResult(null);
    const result = await getSafetyNetRecommendations({
      income: 3000,
      expenses: [
        { category: 'Rent', amount: 1200 },
        { category: 'Groceries', amount: 400 },
        { category: 'Subscriptions', amount: 50 },
        { category: 'Dining Out', amount: 200 },
      ],
      essentialCategories: ['Rent', 'Groceries'],
    });
    setSafetyNetResult(result);
    setSafetyNetLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Financial Tools</CardTitle>
        <CardDescription>
          Leverage AI to get insights into your finances.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">Forecasting</TabsTrigger>
            <TabsTrigger value="simulate">Simulator</TabsTrigger>
            <TabsTrigger value="safety-net">Safety Net</TabsTrigger>
          </TabsList>
          <TabsContent value="forecast">
            <form onSubmit={handleForecast} className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">Analyze past expenses to forecast future spending.</p>
              <div className="space-y-2">
                <Label htmlFor="past-expenses">Past Expenses (JSON)</Label>
                <Textarea id="past-expenses" name="pastExpenses" defaultValue={mockPastExpenses} className="h-32 font-code text-xs"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seasonal-trends">Seasonal Trends (JSON)</Label>
                <Textarea id="seasonal-trends" name="seasonalTrends" defaultValue={mockSeasonalTrends} className="h-24 font-code text-xs"/>
              </div>
              <Button type="submit" disabled={forecastLoading}>
                {forecastLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Forecast Expenses
              </Button>
            </form>
            {forecastResult && (
              <div className="mt-4 space-y-2 rounded-lg border bg-secondary/50 p-4">
                <h4 className="font-semibold font-headline">Forecast Result</h4>
                <p><strong>Suggested Daily Limit:</strong> ₹{forecastResult.suggestedDailyLimit.toFixed(2)}</p>
                <p><strong>Explanation:</strong> {forecastResult.explanation}</p>
                <p><strong>Forecasted Spending:</strong></p>
                <pre className="text-xs whitespace-pre-wrap font-code">{forecastResult.forecastedSpending}</pre>
              </div>
            )}
          </TabsContent>
          <TabsContent value="simulate">
            <form onSubmit={handleSimulate} className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">Simulate budget scenarios based on income and expense changes.</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentIncome">Current Income</Label>
                        <Input id="currentIncome" name="currentIncome" type="number" defaultValue="5000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currentExpenses">Current Expenses</Label>
                        <Input id="currentExpenses" name="currentExpenses" type="number" defaultValue="3000" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="incomeChange">Income Change</Label>
                        <Input id="incomeChange" name="incomeChange" type="number" placeholder="+500 or -200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expenseChanges">Expense Changes</Label>
                        <Input id="expenseChanges" name="expenseChanges" placeholder="Groceries +50" />
                    </div>
                </div>
                <Button type="submit" disabled={scenarioLoading}>
                    {scenarioLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simulate Scenario
                </Button>
            </form>
            {scenarioResult && (
                 <div className="mt-4 space-y-2 rounded-lg border bg-secondary/50 p-4">
                    <h4 className="font-semibold font-headline">{scenarioResult.scenarioDescription}</h4>
                    <p><strong>Projected Income:</strong> ₹{scenarioResult.projectedIncome.toLocaleString()}</p>
                    <p><strong>Projected Expenses:</strong> ₹{scenarioResult.projectedExpenses.toLocaleString()}</p>
                    <p><strong>Net Result:</strong> ₹{scenarioResult.netResult.toLocaleString()}</p>
                    <p><strong>Impact:</strong> {scenarioResult.impactAnalysis}</p>
                </div>
            )}
          </TabsContent>
          <TabsContent value="safety-net">
            <div className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">Get recommendations for spending cuts during income reduction.</p>
                <Button onClick={handleSafetyNet} disabled={safetyNetLoading}>
                    {safetyNetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Activate Safety Net
                </Button>
            </div>
            {safetyNetResult && (
                <div className="mt-4 space-y-4 rounded-lg border bg-secondary/50 p-4">
                    <h4 className="font-semibold font-headline">Safety Net Recommendations</h4>
                    <div>
                        <h5 className="font-medium">Prioritized Expenses:</h5>
                        <ul className="list-disc pl-5">
                            {safetyNetResult.prioritizedExpenses.map(exp => <li key={exp.category}>{exp.category}: ₹{exp.amount}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h5 className="font-medium">Recommendations:</h5>
                        <ul className="list-disc pl-5">
                            {safetyNetResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </div>
                </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
