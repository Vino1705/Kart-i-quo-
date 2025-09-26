'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('professional');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: user.email,
        userType: userType,
      });

      router.push('/onboarding');
    } catch (error: any) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        userType: 'professional', // Default or ask later
      }, { merge: true }); // Merge to avoid overwriting existing data if they login again

      router.push('/onboarding');
    } catch (error: any) {
      toast({
        title: 'Google Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <div className="flex justify-center mb-4">
            <Logo />
        </div>
        <CardTitle className="text-2xl font-headline text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input 
              id="full-name" 
              placeholder="John Doe" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label>I am a</Label>
            <RadioGroup defaultValue="professional" onValueChange={setUserType} className="grid grid-cols-3 gap-4" disabled={loading}>
              <div>
                <RadioGroupItem value="student" id="student" className="peer sr-only" />
                <Label htmlFor="student" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Student
                </Label>
              </div>
              <div>
                <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
                <Label htmlFor="professional" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Professional
                </Label>
              </div>
              <div>
                <RadioGroupItem value="housewife" id="housewife" className="peer sr-only" />
                <Label htmlFor="housewife" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Housewife
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button onClick={handleSignup} disabled={loading} className="w-full">
             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create an account
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={loading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.388 8.922C34.411 5.373 29.5 3.5 24 3.5 13.75 3.5 5.5 11.75 5.5 22s8.25 18.5 18.5 18.5S42.5 32.25 42.5 22c0-1.25-.125-2.5-.389-3.917z"></path>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.427-5.104C34.411 5.373 29.5 3.5 24 3.5 16.318 3.5 9.656 8.337 6.306 14.691z"></path>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.519-3.486-11.127-8.161l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.836 44 30.019 44 24c0-1.577-.219-3.125-.589-4.583z"></path>
            </svg>
            Sign up with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
