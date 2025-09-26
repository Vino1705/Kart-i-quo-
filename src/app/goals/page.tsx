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
import { PlusCircle, Trash2, PiggyBank } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';


export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [deadline, setDeadline] = useState('');
  const [contributionAmount, setContributionAmount] = useState<number>(0);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/goals`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userGoals: Goal[] = [];
      querySnapshot.forEach((doc) => {
        userGoals.push({ id: doc.id, ...doc.data() } as Goal);
      });
      setGoals(userGoals);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddGoal = async () => {
    if (!user) return;
    if (!goalName || !targetAmount || !deadline) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields to add a new goal.',
        variant: 'destructive',
      });
      return;
    }

    const newGoal: Omit<Goal, 'id'> = {
      name: goalName,
      targetAmount,
      currentAmount: 0, // Goals start with 0 saved
      deadline,
    };

    try {
      await addDoc(collection(db, `users/${user.uid}/goals`), newGoal);
      
      // Reset form
      setGoalName('');
      setTargetAmount(0);
      setDeadline('');

      toast({
        title: 'Goal Added!',
        description: `You're now tracking your goal: ${goalName}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add goal.',
        variant: 'destructive',
      });
    }
  };
  
  const handleRemoveGoal = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/goals`, id));
      toast({
        title: 'Goal Removed',
        description: 'Your goal has been successfully removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove goal.',
        variant: 'destructive',
      });
    }
  };

  const handleContribute = async (goalId: string) => {
    if(!user) return;
    if (contributionAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a positive amount to contribute.',
        variant: 'destructive',
      });
      return;
    }
    
    const goalRef = doc(db, `users/${user.uid}/goals`, goalId);

    try {
      await updateDoc(goalRef, {
        currentAmount: increment(contributionAmount)
      });
      toast({
        title: 'Contribution Successful!',
        description: `You've added ₹${contributionAmount} to your goal.`,
      });
      setContributionAmount(0);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to make contribution.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Financial Goals</CardTitle>
          <CardDescription>
            Here's a list of your current goals. Stay focused!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goals.length > 0 ? (
              goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg font-headline">{goal.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Target: ₹{goal.targetAmount.toLocaleString('en-IN')} | Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your goal
                                "{goal.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveGoal(goal.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                    </div>
                    <div className="mt-4">
                       <div className="flex justify-between items-center mb-1">
                          <p className="text-sm">
                            Saved: <span className="font-medium">₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(progress)}%
                          </p>
                        </div>
                      <Progress value={progress} aria-label={`${goal.name} progress`} />
                    </div>
                     <div className="flex justify-end mt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <PiggyBank className="mr-2 h-4 w-4" />
                              Contribute
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Contribute to {goal.name}</DialogTitle>
                              <DialogDescription>
                                Enter the amount you want to add to this goal. Every bit helps!
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contribution-amount" className="text-right">
                                  Amount (₹)
                                </Label>
                                <Input
                                  id="contribution-amount"
                                  type="number"
                                  className="col-span-3"
                                  value={contributionAmount || ''}
                                  onChange={(e) => setContributionAmount(parseFloat(e.target.value))}
                                  placeholder="e.g. 500"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" onClick={() => handleContribute(goal.id)}>Contribute</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted-foreground py-8">
                You haven't added any goals yet. Add one below to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Add a New Goal</CardTitle>
          <CardDescription>
            What new financial milestone do you want to achieve?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input 
              id="goal-name" 
              placeholder="e.g., New Car" 
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="target-amount">Target Amount (₹)</Label>
              <Input 
                id="target-amount" 
                type="number" 
                placeholder="500000" 
                value={targetAmount || ''}
                onChange={(e) => setTargetAmount(parseFloat(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddGoal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
