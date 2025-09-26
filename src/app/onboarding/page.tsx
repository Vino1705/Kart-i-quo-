'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { calculateDisposableIncome } from '@/ai/flows/calculate-disposable-income';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Expense = {
  id: number;
  name: string;
  amount: number;
};

export default function OnboardingPage() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, name: '', amount: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now(), name: '', amount: 0 },
    ]);
  };

  const handleRemoveExpense = (id: number) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const handleExpenseChange = (
    id: number,
    field: 'name' | 'amount',
    value: string
  ) => {
    const newExpenses = expenses.map((exp) => {
      if (exp.id === id) {
        if (field === 'amount') {
          return { ...exp, [field]: parseFloat(value) || 0 };
        }
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setExpenses(newExpenses);
  };

  const handleFinishSetup = async () => {
    if (!user) {
      toast({
        title: 'Not Authenticated',
        description: 'You must be logged in to complete onboarding.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    if (!monthlyIncome || monthlyIncome <= 0) {
      toast({
        title: 'Invalid Income',
        description: 'Please enter a valid monthly income.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const mandatoryExpenses = expenses.filter(exp => exp.name && exp.amount > 0);

    try {
      const result = await calculateDisposableIncome({
        totalIncome: monthlyIncome,
        mandatoryExpenses,
      });

      const totalMandatoryExpenses = mandatoryExpenses.reduce((acc, exp) => acc + exp.amount, 0);

      const financials = {
        totalIncome: monthlyIncome,
        mandatoryExpenses: mandatoryExpenses,
        totalMandatoryExpenses: totalMandatoryExpenses,
        disposableIncome: result.disposableIncome,
        dailySpendingLimit: result.dailySpendingLimit,
        goalSavingsSuggestion: result.goalSavingsSuggestion,
        explanation: result.explanation,
      };

      // Store data in Firestore
      await setDoc(doc(db, 'users', user.uid), { financials }, { merge: true });

      router.push('/');

    } catch (error) {
      console.error('Error calculating disposable income:', error);
      toast({
        title: 'Error',
        description: 'Could not calculate financial summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-headline text-center">
          Welcome!
        </CardTitle>
        <CardDescription className="text-center">
          Let's set up your financial profile. Please enter your income and
          mandatory monthly expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="monthly-income">Monthly Income (₹)</Label>
          <Input
            id="monthly-income"
            type="number"
            placeholder="e.g., 50000"
            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value))}
          />
        </div>

        <div className="space-y-4">
          <Label>Mandatory Expenses</Label>
          <div className="grid gap-4">
            {expenses.map((expense, index) => (
              <div key={expense.id} className="flex items-center gap-2">
                <Input
                  placeholder="Expense Name (e.g., Rent)"
                  value={expense.name}
                  onChange={(e) => handleExpenseChange(expense.id, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Amount (₹)"
                  value={expense.amount || ''}
                   onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExpense(expense.id)}
                  disabled={expenses.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleAddExpense}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleFinishSetup} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Finish Setup
        </Button>
      </CardFooter>
    </Card>
  );
}
