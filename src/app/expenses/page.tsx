'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateDisposableIncome } from '@/ai/flows/calculate-disposable-income';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

type Expense = {
  id: number;
  name: string;
  amount: number;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchExpenses = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists() && docSnap.data().financials) {
        setExpenses(docSnap.data().financials.mandatoryExpenses || []);
      }
    };
    fetchExpenses();
  }, [user]);

  const updateFinancials = async (updatedExpenses: Expense[]) => {
    if (!user) return;
    setLoading(true);

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists() || !docSnap.data().financials) {
      toast({ title: "Error", description: "Could not find financial data.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const financials = docSnap.data().financials;
    const totalIncome = financials.totalIncome;

    try {
      const result = await calculateDisposableIncome({
        totalIncome: totalIncome,
        mandatoryExpenses: updatedExpenses,
      });

      const totalMandatoryExpenses = updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0);

      const newFinancials = {
        ...financials,
        mandatoryExpenses: updatedExpenses,
        totalMandatoryExpenses,
        ...result,
      };

      await updateDoc(userDocRef, { financials: newFinancials });
      setExpenses(updatedExpenses);
      toast({ title: "Success", description: "Your expenses and financial summary have been updated." });

    } catch (error) {
      toast({ title: "AI Error", description: "Failed to recalculate financial summary.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    if (!newExpenseName || newExpenseAmount <= 0) {
      toast({ title: "Invalid Input", description: "Please provide a valid name and amount.", variant: "destructive" });
      return;
    }
    const newExpense = { id: Date.now(), name: newExpenseName, amount: newExpenseAmount };
    const updatedExpenses = [...expenses, newExpense];
    updateFinancials(updatedExpenses);
    setNewExpenseName('');
    setNewExpenseAmount(0);
  };

  const handleRemoveExpense = (id: number) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    updateFinancials(updatedExpenses);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Manage Expenses</CardTitle>
          <CardDescription>
            View, add, or edit your mandatory monthly expenses. This helps in
            calculating your daily spending limit and savings potential.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.length > 0 ? (
              <div className="grid gap-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center gap-2">
                    <Input value={expense.name} readOnly />
                    <Input type="number" value={expense.amount} readOnly />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveExpense(expense.id)} disabled={loading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center text-muted-foreground py-8 border rounded-md">
                You haven't added any mandatory expenses yet.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <div className="flex items-end gap-2 w-full">
                <div className="grid gap-2 flex-1">
                    <Label htmlFor="new-expense-name">New Expense Name</Label>
                    <Input 
                      id="new-expense-name" 
                      placeholder="e.g., Internet Bill"
                      value={newExpenseName}
                      onChange={(e) => setNewExpenseName(e.target.value)}
                    />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="new-expense-amount">Amount (₹)</Label>
                    <Input 
                      id="new-expense-amount" 
                      type="number" 
                      placeholder="600"
                      value={newExpenseAmount || ''}
                      onChange={(e) => setNewExpenseAmount(parseFloat(e.target.value))}
                    />
                </div>
                 <Button onClick={handleAddExpense} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Add Expense
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
