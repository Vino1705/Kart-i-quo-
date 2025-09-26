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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Transaction } from '@/lib/types';
import { SpendingPieChart } from '@/components/daily-check-in/spending-pie-chart';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

export default function DailyCheckinPage() {
  const [dailyLimit, setDailyLimit] = useState(300);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number>(0);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch financials for daily limit
    const userDocRef = doc(db, 'users', user.uid);
    const fetchFinancials = async () => {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists() && docSnap.data().financials) {
        setDailyLimit(docSnap.data().financials.dailySpendingLimit || 300);
      }
    };
    fetchFinancials();
    
    // Listen for transactions
    const transactionsDocRef = doc(db, 'users', user.uid, 'transactions', 'data');
    const unsubscribe = onSnapshot(transactionsDocRef, (doc) => {
      if (doc.exists()) {
        const transactionData = doc.data();
        setTransactions(transactionData.items || []);
      }
    });

    return () => unsubscribe();
  }, [user]);
  
  const handleUpdateLimit = async () => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
        await updateDoc(userDocRef, {
            'financials.dailySpendingLimit': dailyLimit
        });
        toast({ title: 'Success', description: 'Daily limit updated!' });
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to update daily limit.', variant: 'destructive' });
    }
  }

  const handleAddExpense = async () => {
    if (!user) return;
    if (!description || !category || !amount || amount <= 0) {
      toast({
        title: 'Invalid Expense',
        description: 'Please fill out all fields with valid values.',
        variant: 'destructive',
      });
      return;
    }
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      description,
      category: category as Transaction['category'],
      amount,
      type: 'expense'
    };

    const transactionsDocRef = doc(db, 'users', user.uid, 'transactions', 'data');
    
    try {
        await setDoc(transactionsDocRef, { items: arrayUnion(newTransaction) }, { merge: true });
        // Reset form
        setDescription('');
        setCategory('');
        setAmount(0);

        toast({ title: 'Expense Added', description: `Logged ${description} for ₹${amount}` });
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to add expense.', variant: 'destructive' });
    }
  };
  
  const todaysExpenses = transactions.filter(t => new Date(t.date).toDateString() === new Date().toDateString());

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Daily Spending Limit</CardTitle>
          <CardDescription>
            Your daily spending limit is suggested by our AI based on your income and mandatory expenses to help you meet your savings goals. You can adjust it if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-sm">
            <Label htmlFor="daily-limit">Daily Limit (₹)</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="daily-limit" 
                type="number" 
                value={dailyLimit} 
                onChange={(e) => setDailyLimit(parseFloat(e.target.value) || 0)}
              />
              <Button onClick={handleUpdateLimit}>Update</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Log Today's Expenses</CardTitle>
          <CardDescription>
            Enter all your expenses for today, one by one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
                <div className="grid gap-2 flex-1">
                    <Label>Description</Label>
                    <Input 
                      placeholder="e.g., Coffee" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                 <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Housing">Housing</SelectItem>
                             <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>Amount (₹)</Label>
                    <Input 
                      type="number" 
                      placeholder="150" 
                      value={amount || ''}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    />
                </div>
                 <Button onClick={handleAddExpense}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                </Button>
            </div>

            {todaysExpenses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 items-start border-t mt-4 pt-4">
                  <div>
                    <h3 className="font-semibold mb-2 font-headline">Today's Spending Breakdown</h3>
                    <SpendingPieChart expenses={todaysExpenses} />
                  </div>
                  <ul className="space-y-2">
                      {todaysExpenses.map(exp => (
                          <li key={exp.id} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                              <div>
                                  <p className="font-medium">{exp.description}</p>
                                  <p className="text-sm text-muted-foreground">{exp.category}</p>
                              </div>
                              <p className="font-medium text-red-500">-₹{exp.amount.toFixed(2)}</p>
                          </li>
                      ))}
                  </ul>
              </div>
            ) : (
             <div className="text-center text-muted-foreground py-8 border-t mt-4 pt-4">
              You haven't added any expenses for today yet.
            </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
