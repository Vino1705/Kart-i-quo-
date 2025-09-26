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
import Link from 'next/link';

const goals: Goal[] = [];

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
        {goals.length > 0 ? (
          goals.map((goal) => {
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
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No goals yet. Set one now!
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
            <Link href="/goals">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Goal
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
