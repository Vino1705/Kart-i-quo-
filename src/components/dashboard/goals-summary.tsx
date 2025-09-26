'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import Link from 'next/link';
import type { Goal } from '@/lib/types';
import { Progress } from '../ui/progress';

export function GoalsSummary() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Financial Goals</CardTitle>
        <CardDescription>
          {goals.length > 0 ? "Here's a look at your top goals." : "You haven't set any goals yet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length > 0 ? (
          goals.slice(0, 2).map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id}>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">{goal.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progress)}%
                  </p>
                </div>
                <Progress value={progress} aria-label={`${goal.name} progress`} />
              </div>
            )
          })
        ) : (
          <div className="text-center text-muted-foreground py-6">
            <p>Setting goals is the first step to achieving them!</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
            <Link href="/goals">
                <Target className="mr-2 h-4 w-4" />
                Manage Goals
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
