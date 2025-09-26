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
import { PlusCircle } from 'lucide-react';

export default function GoalsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Manage Your Goals</CardTitle>
          <CardDescription>
            Add, edit, or remove your financial goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* This will be populated with user's goals */}
            <div className="text-center text-muted-foreground py-8">
              You haven't added any goals yet.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-headline">Add a New Goal</CardTitle>
          <CardDescription>
            What new financial milestone do you want to achieve?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input id="goal-name" placeholder="e.g., New Car" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="target-amount">Target Amount (₹)</Label>
              <Input id="target-amount" type="number" placeholder="500000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
