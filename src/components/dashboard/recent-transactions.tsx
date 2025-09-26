'use client';
import { useState, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const transactionsDocRef = doc(db, 'users', user.uid, 'transactions', 'data');
    const unsubscribe = onSnapshot(transactionsDocRef, (doc) => {
      if (doc.exists()) {
        const transactionData = doc.data();
        const items: Transaction[] = transactionData.items || [];
        const recentTransactions = items
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setTransactions(recentTransactions);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Card className="xl:col-span-3">
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>
          A log of your recent income and expenses. Go to the <Link href="/daily-check-in" className="underline">Daily Check-in</Link> page to add a transaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === 'income'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}₹
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No transactions yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
