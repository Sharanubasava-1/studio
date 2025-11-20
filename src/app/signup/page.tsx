'use client';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/tasks');
    }
  }, [user, loading, router]);

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) return;

    const formData = new FormData(event.currentTarget);
    const displayName = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!displayName || !email || !password) {
      toast({
        title: 'Error',
        description: 'All fields are required.',
        variant: 'destructive',
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
        }
        router.push('/tasks');
      } catch (error: any) {
        let description = 'An unexpected error occurred.';
        if (error.code === 'auth/weak-password') {
          description = 'The password is too weak. Please use at least 6 characters.';
        } else if (error.message) {
          description = error.message;
        }

        toast({
          title: 'Sign-up Failed',
          description,
          variant: 'destructive',
        });
        console.error('Error signing up', error);
      }
    });
  };

  if (loading || user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={isPending} />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
