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
import { PlusCircle, Trash2 } from 'lucide-react';

export default function ExpensesPage() {
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
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Expense Name (e.g., Rent)" value="Rent" readOnly />
                <Input type="number" placeholder="Amount (₹)" value="15000" readOnly />
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Expense Name (e.g., Loan EMI)"
                  value="Car Loan EMI"
                  readOnly
                />
                <Input type="number" placeholder="Amount (₹)" value="8000" readOnly />
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
               <div className="flex items-center gap-2">
                <Input
                  placeholder="Expense Name (e.g., Electricity Bill)"
                  value="Electricity Bill"
                  readOnly
                />
                <Input type="number" placeholder="Amount (₹)" value="1200" readOnly/>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <div className="flex items-end gap-2 w-full">
                <div className="grid gap-2 flex-1">
                    <Label htmlFor="new-expense-name">New Expense Name</Label>
                    <Input id="new-expense-name" placeholder="e.g., Internet Bill"/>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="new-expense-amount">Amount (₹)</Label>
                    <Input id="new-expense-amount" type="number" placeholder="600"/>
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Expense
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
