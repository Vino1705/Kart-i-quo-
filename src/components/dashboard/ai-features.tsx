'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import type { Transaction } from '@/lib/types';

type Financials = {
    totalIncome: number;
    totalMandatoryExpenses: number;
    mandatoryExpenses: { category: string; amount: number }[];
};

export function AiFeatures() {
  const [activeTab, setActiveTab] = useState('forecast');
  
  const [forecastResult, setForecastResult] = useState<ForecastExpensesOutput | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  const [scenarioResult, setScenarioResult] = useState<SimulateBudgetScenariosOutput | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [scenarioIncome, setScenarioIncome] = useState(0);
  const [scenarioExpenses, setScenarioExpenses] = useState(0);

  const [safetyNetResult, setSafetyNetResult] = useState<SafetyNetRecommendationsOutput | null>(null);
  const [safetyNetLoading, setSafetyNetLoading] = useState(false);
  const [safetyIncome, setSafetyIncome] = useState(0);
  const [safetyExpenses, setSafetyExpenses] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedFinancials = localStorage.getItem('financials');
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedFinancials) {
        const financials: Financials = JSON.parse(storedFinancials);
        setScenarioIncome(financials.totalIncome);
        setScenarioExpenses(financials.totalMandatoryExpenses);
        setSafetyIncome(financials.totalIncome);
        setSafetyExpenses(JSON.stringify(financials.mandatoryExpenses, null, 2));
    }
    
    if (storedTransactions) {
        const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
        setTransactions(parsedTransactions);
    }
  }, []);

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
        incomeChange: Number(formData.get('incomeChange')) || undefined,
        expenseChanges: (formData.get('expenseChanges') as string) || undefined,
    });
    setScenarioResult(result);
    setScenarioLoading(false);
  }
  
  async function handleSafetyNet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSafetyNetLoading(true);
    setSafetyNetResult(null);
    const formData = new FormData(event.currentTarget);
    const income = Number(formData.get('income'));
    const expensesRaw = formData.get('expenses') as string;
    const essentialCategoriesRaw = formData.get('essentialCategories') as string;

    try {
      const expenses = JSON.parse(expensesRaw);
      const essentialCategories = essentialCategoriesRaw.split(',').map(c => c.trim());

      const result = await getSafetyNetRecommendations({
        income,
        expenses,
        essentialCategories,
      });
      setSafetyNetResult(result);
    } catch(e) {
      console.error(e);
    } finally {
        setSafetyNetLoading(false);
    }
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
              <p className="text-sm text-muted-foreground">Analyze past expenses to forecast future spending. Your transaction history is pre-filled.</p>
              <div className="space-y-2">
                <Label htmlFor="past-expenses">Past Expenses (JSON)</Label>
                <Textarea id="past-expenses" name="pastExpenses" defaultValue={JSON.stringify(transactions, null, 2)} className="h-32 font-code text-xs"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seasonal-trends">Seasonal Trends (JSON)</Label>
                <Textarea id="seasonal-trends" name="seasonalTrends" placeholder='{"December": "Higher spending on gifts."}' className="h-24 font-code text-xs"/>
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
                <p className="text-sm text-muted-foreground">Simulate budget scenarios based on income and expense changes. Your current data is pre-filled.</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentIncome">Current Income</Label>
                        <Input id="currentIncome" name="currentIncome" type="number" value={scenarioIncome} onChange={e => setScenarioIncome(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currentExpenses">Current Expenses</Label>
                        <Input id="currentExpenses" name="currentExpenses" type="number" value={scenarioExpenses} onChange={e => setScenarioExpenses(Number(e.target.value))} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="incomeChange">Income Change</Label>
                        <Input id="incomeChange" name="incomeChange" type="number" placeholder="+5000 or -2000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expenseChanges">Expense Changes</Label>
                        <Input id="expenseChanges" name="expenseChanges" placeholder="Groceries +500" />
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
            <form onSubmit={handleSafetyNet} className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">Get recommendations for spending cuts during income reduction. Your data is pre-filled.</p>
                 <div className="space-y-2">
                    <Label htmlFor="income">Current Income</Label>
                    <Input id="income" name="income" type="number" value={safetyIncome} onChange={e => setSafetyIncome(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expenses">Expenses (JSON)</Label>
                    <Textarea id="expenses" name="expenses" value={safetyExpenses} onChange={e => setSafetyExpenses(e.target.value)} className="h-24 font-code text-xs"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="essentialCategories">Essential Categories (comma-separated)</Label>
                    <Input id="essentialCategories" name="essentialCategories" placeholder="Rent, Groceries" defaultValue="Rent, EMI, Food" />
                </div>
                <Button type="submit" disabled={safetyNetLoading}>
                    {safetyNetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Activate Safety Net
                </Button>
            </form>
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
