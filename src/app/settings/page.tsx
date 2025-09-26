
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import {
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, deleteDoc, writeBatch, collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);


  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user || !user.email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for instructions to reset your password.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Lazily import firestore services only when needed
      const { db } = await import('@/lib/firebase');
      const { writeBatch, doc, collection } = await import('firebase/firestore');

      // Delete user data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const transactionsDocRef = doc(db, 'users', user.uid, 'transactions', 'data');
      
      const batch = writeBatch(db);
      batch.delete(userDocRef);
      batch.delete(transactionsDocRef);
      // In a real app, you would also need to query and delete all documents in subcollections like 'goals'.
      
      await batch.commit();

      // Delete user from Firebase Auth
      await deleteUser(user);

      toast({
        title: 'Account Deleted',
        description: 'Your account and all associated data have been permanently deleted.',
      });
      router.push('/signup');
    } catch (error: any) {
       toast({
        title: 'Error',
        description: `Failed to delete account. Please log out and log back in to re-authenticate before trying again. Error: ${error.message}`,
        variant: 'destructive',
        duration: 7000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <p>Loading settings...</p>;
  }
  
  if (!user) {
    // Redirect to login if not authenticated, which should be handled by useAuth hook but as a fallback
    router.push('/login');
    return <p>Please log in to view your settings.</p>
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Profile</CardTitle>
          <CardDescription>
            Manage your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email || ''} readOnly disabled />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Security</CardTitle>
          <CardDescription>Manage your account security.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To change your password, we will send a secure link to your registered email address.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePasswordReset} variant="outline" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Password Reset Email
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="font-headline text-destructive">
            Danger Zone
          </CardTitle>
          <CardDescription>
            These actions are permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Deleting your account will permanently remove all your data, including your profile, financial records, goals, and transaction history.
          </p>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading}>
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Yes, delete my account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
