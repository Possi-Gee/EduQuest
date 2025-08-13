
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

function SplashScreen({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
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
  ]

  const logoVariants = {
     hidden: { scale: 0, rotate: -180 },
     visible: {
       scale: 1,
       rotate: 0,
       transition: {
         type: 'spring',
         duration: 1.5,
         delay: 0.2,
       },
     }
  }
  
  const appName = "EduQuest";

  return (
    <motion.div 
        className="h-screen w-full flex flex-col items-center justify-center bg-background absolute inset-0"
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        variants={containerVariants}
        onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        className="flex items-center gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={logoVariants}>
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
        <motion.h1 className="text-4xl font-bold flex" variants={containerVariants}>
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
        </motion.h1>
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
    // This now just controls when the transition from splash to login begins
    const timer = setTimeout(() => {
        setShowSplash(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Logged in successfully!' });
      // The auth listener in the layout will handle redirection.
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
  
  const logoContainerVariants = {
    initial: { y: '0%', scale: 1 },
    animate: { 
      y: '-110%', // Move it higher
      scale: 0.9, 
      transition: { duration: 0.8, ease: 'easeInOut', delay: 0.5 } 
    },
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden relative">
        <AnimatePresence>
            {showSplash && <SplashScreen onAnimationComplete={() => {}} />}
        </AnimatePresence>

        <motion.div
            initial="initial"
            animate={!showSplash ? "animate" : "initial"}
            variants={logoContainerVariants}
            className="flex items-center gap-2"
        >
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

        <AnimatePresence>
            {!showSplash && (
                 <motion.div 
                    key="login-form"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.8 } }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-md mx-4 absolute"
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
            )}
        </AnimatePresence>
    </div>
  );
}