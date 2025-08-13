
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name) {
      toast({ title: 'Name is required.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, { displayName: name });
      
      // Store user role in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        role: role,
        isNewUser: true, // Mark as a new user for onboarding
      });

      toast({ title: 'Success', description: 'Account created successfully!' });
      
      // The auth listener will redirect to the introduction page
      // No need to push router here.

    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen bg-background"
    >
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join EduQuest and start your learning adventure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>I am a...</Label>
            <RadioGroup
              value={role}
              onValueChange={(value: 'student' | 'teacher') => setRole(value)}
              className="flex gap-4"
              disabled={isLoading}
            >
              <Label className="flex items-center gap-2 p-4 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary cursor-pointer transition-colors flex-1">
                <RadioGroupItem value="student" id="student" />
                Student
              </Label>
              <Label className="flex items-center gap-2 p-4 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary cursor-pointer transition-colors flex-1">
                <RadioGroupItem value="teacher" id="teacher" />
                Teacher
              </Label>
            </RadioGroup>
          </div>
          <Button onClick={handleSignup} disabled={isLoading} className="w-full">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
