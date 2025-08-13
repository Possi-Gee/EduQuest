
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

function Logo({ layoutId }: { layoutId: string }) {
  return (
    <motion.div layoutId={layoutId} className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-10 w-10 text-primary"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <h1 className="text-3xl font-bold">EduQuest</h1>
    </motion.div>
  );
}


function SplashScreen() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    fromTop: { y: -50, opacity: 0 },
    fromBottom: { y: 50, opacity: 0 },
    fromLeft: { x: -50, opacity: 0 },
    fromRight: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const letterAnimationOrder = [
    letterVariants.fromLeft,
    letterVariants.fromTop,
    letterVariants.fromRight,
    letterVariants.fromBottom,
    letterVariants.fromLeft,
    letterVariants.fromTop,
    letterVariants.fromRight,
  ];

  const appName = "EduQuest";

  return (
    <motion.div
      className="h-screen w-full flex flex-col items-center justify-center bg-background absolute inset-0"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
      variants={containerVariants}
    >
       <motion.div
        className="flex items-center gap-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { delay: 1.2, duration: 0.5 } }}
      >
        <motion.div layoutId="logo">
           <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
            >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        </motion.div>
        <h1 className="text-4xl font-bold flex">
          {appName.split("").map((char, index) => (
            <motion.span
                key={index}
                custom={index}
                initial={letterAnimationOrder[index % letterAnimationOrder.length]}
                animate="visible"
                variants={letterVariants}
             >
              {char}
            </motion.span>
          ))}
        </h1>
      </motion.div>
    </motion.div>
  );
}


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowSplash(false);
    }, 3000); // Splash screen stays for 3 seconds
    return () => clearTimeout(timer);
  }, []);


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Logged in successfully!' });
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      else {
        errorMessage = error.message;
      }
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden relative">
        <AnimatePresence>
            {showSplash && <SplashScreen />}
        </AnimatePresence>
        
        <AnimatePresence>
          {!showSplash && (
            <motion.div
              className="w-full h-full flex flex-col items-center pt-12"
              initial={{opacity: 0}}
              animate={{opacity: 1, transition: {duration: 0.5, delay: 0.3}}}
            >
              <motion.div layoutId="logo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-12 w-12 text-primary"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </motion.div>
              <motion.h1 
                className="text-4xl font-bold"
                initial={{opacity: 0}}
                animate={{opacity: 1, transition: {delay: 0.5}}}
              >
                EduQuest
              </motion.h1>
              
              <motion.div
                 className="w-full max-w-md mx-4 mt-8"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } }}
              >
                  <Card>
                      <CardHeader className="text-center">
                      <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                      <CardDescription>Enter your credentials to access your account.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
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
                      <Button onClick={handleLogin} disabled={isLoading} className="w-full">
                          {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                      <div className="text-center text-sm text-muted-foreground">
                          Don't have an account?{' '}
                          <Link href="/signup" className="text-primary hover:underline">
                          Sign up
                          </Link>
                      </div>
                      </CardContent>
                  </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
