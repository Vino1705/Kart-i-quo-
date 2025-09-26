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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function DailyCheckinPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Daily Spending Limit</CardTitle>
          <CardDescription>
            Your suggested daily spending limit is ₹300. You can adjust it
            below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-sm">
            <Label htmlFor="daily-limit">Daily Limit (₹)</Label>
            <Input id="daily-limit" type="number" defaultValue="300" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Log Today's Expenses</CardTitle>
          <CardDescription>
            Enter all your expenses for today, one by one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
                <div className="grid gap-2 flex-1">
                    <Label>Description</Label>
                    <Input placeholder="e.g., Coffee" />
                </div>
                 <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="housing">Housing</SelectItem>
                             <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>Amount (₹)</Label>
                    <Input type="number" placeholder="150" />
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                </Button>
            </div>

             <div className="text-center text-muted-foreground py-8 border-t mt-4 pt-4">
              You haven't added any expenses for today yet.
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
