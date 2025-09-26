import type { Transaction } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';

const transactions: Transaction[] = [
  {
    id: '1',
    date: '2024-07-29',
    description: 'Monthly Salary',
    category: 'Income',
    amount: 3500,
    type: 'income',
  },
  {
    id: '2',
    date: '2024-07-28',
    description: 'Grocery Shopping',
    category: 'Food',
    amount: 75.6,
    type: 'expense',
  },
  {
    id: '3',
    date: '2024-07-27',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    amount: 15.99,
    type: 'expense',
  },
  {
    id: '4',
    date: '2024-07-26',
    description: 'Gasoline',
    category: 'Transport',
    amount: 40,
    type: 'expense',
  },
  {
    id: '5',
    date: '2024-07-25',
    description: 'Rent Payment',
    category: 'Housing',
    amount: 1200,
    type: 'expense',
  },
];

export function RecentTransactions() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>
          A log of your recent income and expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
       <CardFooter>
        <Button variant="outline" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </CardFooter>
    </Card>
  );
}
