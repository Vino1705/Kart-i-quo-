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

export function GoalsSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Financial Goals</CardTitle>
        <CardDescription>
          You have goals set! Keep track of your progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-6">
        <div className="text-center text-muted-foreground">
            <p>You have not set any goals yet.</p>
        </div>
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
