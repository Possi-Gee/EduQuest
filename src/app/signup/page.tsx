
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
import { motion, AnimatePresence } from 'framer-motion';
import { validateAndClaimTeacherId } from '@/lib/data';


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [teacherId, setTeacherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast({ title: 'All fields are required.', variant: 'destructive' });
      return;
    }
    if (role === 'teacher' && !teacherId) {
        toast({ title: 'Teacher ID is required for teacher accounts.', variant: 'destructive' });
        return;
    }

    setIsLoading(true);

    try {
      if (role === 'teacher') {
          const { isValid, message } = await validateAndClaimTeacherId(teacherId, 'temp-id'); // Use a temporary ID for validation
          if (!isValid) {
              toast({ title: 'Signup Failed', description: message, variant: 'destructive' });
              setIsLoading(false);
              return;
          }
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // If validation was successful, now claim the ID with the actual user UID
      if (role === 'teacher') {
          await validateAndClaimTeacherId(teacherId, user.uid);
      }
      
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

    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password must be at least 6 characters long.';
      } else if (error.code) {
        errorMessage = error.message;
      }
      toast({
        title: 'Signup Failed',
        description: errorMessage,
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

          <AnimatePresence>
            {role === 'teacher' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                >
                    <Label htmlFor="teacherId">Teacher ID</Label>
                    <Input
                        id="teacherId"
                        placeholder="Enter your teacher ID"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        disabled={isLoading}
                    />
                </motion.div>
            )}
          </AnimatePresence>

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
