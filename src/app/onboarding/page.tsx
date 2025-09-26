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
import { PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-headline text-center">Welcome!</CardTitle>
        <CardDescription className="text-center">
          Let's set up your financial profile. Please enter your income and mandatory monthly expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="monthly-income">Monthly Income (₹)</Label>
          <Input id="monthly-income" type="number" placeholder="e.g., 50000" />
        </div>
        
        <div className="space-y-4">
            <Label>Mandatory Expenses</Label>
            <div className="grid gap-4">
                <div className="flex items-center gap-2">
                    <Input placeholder="Expense Name (e.g., Rent)" />
                    <Input type="number" placeholder="Amount (₹)" />
                    <Button variant="ghost" size="icon" disabled>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                 <div className="flex items-center gap-2">
                    <Input placeholder="Expense Name (e.g., Loan EMI)" />
                    <Input type="number" placeholder="Amount (₹)" />
                    <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
            </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/">Finish Setup</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
