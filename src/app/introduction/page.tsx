
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { updateUserOnboarding } from '@/lib/data';
import { ArrowRight, BookOpen, ClipboardCheck, LayoutDashboard, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function IntroductionPage() {
    const { user, userRole, recheckUser } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGetStarted = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            await updateUserOnboarding(user.uid);
            // Re-check the user status to update isNewUser flag in the hook
            await recheckUser();
            // The redirection will now be handled automatically by the useAuth hook's useEffect
        } catch (error) {
            console.error("Failed to update user onboarding status", error);
            // Fallback navigation in case recheck fails for some reason
            if (userRole === 'teacher') {
                router.push('/dashboard');
            } else {
                router.push('/');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in-50">
                
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-primary">Welcome to EduQuest!</h1>
                    <p className="text-xl text-muted-foreground">
                        Your journey to smarter learning and teaching starts here, {user?.displayName || ''}.
                    </p>
                </div>

                <Card className="text-left">
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                        <CardDescription>Here’s a quick overview of what you can do.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {userRole === 'student' && (
                             <ul className="space-y-4 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground">Explore Notes:</span> Dive into comprehensive study materials prepared by your teacher.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ClipboardCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                     <div>
                                        <span className="font-semibold text-foreground">Take Quizzes:</span> Test your knowledge with interactive quizzes and earn certificates upon passing.
                                    </div>
                                </li>
                            </ul>
                        )}
                        {userRole === 'teacher' && (
                             <ul className="space-y-4 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <LayoutDashboard className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                     <div>
                                        <span className="font-semibold text-foreground">Use your Dashboard:</span> Get an at-a-glance overview of your class, including student count and average scores.
                                    </div>
                                </li>
                                 <li className="flex items-start gap-3">
                                    <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                     <div>
                                        <span className="font-semibold text-foreground">Manage Notes & Quizzes:</span> Create, edit, and generate educational content with the power of AI.
                                    </div>
                                </li>
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Button size="lg" onClick={handleGetStarted} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>Get Started <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>

            </div>
        </div>
    );
}
