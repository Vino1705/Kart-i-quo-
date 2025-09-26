import type { Goal } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlusCircle } from 'lucide-react';

const goals: Goal[] = [
  {
    id: '1',
    name: 'New MacBook Pro',
    currentAmount: 1200,
    targetAmount: 2500,
    deadline: '2024-12-31',
  },
  {
    id: '2',
    name: 'Vacation to Bali',
    currentAmount: 800,
    targetAmount: 3000,
    deadline: '2025-06-30',
  },
  {
    id: '3',
    name: 'Emergency Fund',
    currentAmount: 4500,
    targetAmount: 5000,
    deadline: '2024-10-01',
  },
];

export function Goals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Goals</CardTitle>
        <CardDescription>
          Track your progress towards your financial goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id}>
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">{goal.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{goal.currentAmount.toLocaleString()} / ₹
                  {goal.targetAmount.toLocaleString()}
                </p>
              </div>
              <Progress value={progress} aria-label={`${goal.name} progress`} />
              <p className="text-xs text-muted-foreground mt-1">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Goal
        </Button>
      </CardFooter>
    </Card>
  );
}
