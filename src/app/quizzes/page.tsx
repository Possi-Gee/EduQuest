
'use client'

import { useState, useEffect } from 'react';
import { getQuizzes } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
        setLoading(true);
        const fetchedQuizzes = await getQuizzes();
        setQuizzes(fetchedQuizzes);
        setLoading(false);
    }
    fetchQuizzes();
  }, []);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const LoadingSkeleton = () => (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({length: 3}).map((_, i) => (
            <Card key={i} className="flex flex-col">
                <CardHeader>
                     <Skeleton className="h-6 w-3/4" />
                     <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                     </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        ))}
      </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <h1 className="text-3xl font-bold">Quizzes</h1>
      <p className="text-muted-foreground">Test your knowledge. Choose a quiz to begin.</p>
      {loading ? <LoadingSkeleton /> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
            <Card key={quiz.id} className="flex flex-col bg-card/80 hover:bg-card/90 transition-colors">
                <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{quiz.title}</CardTitle>
                    <Badge variant="outline">{quiz.category}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
                    <CardDescription>{quiz.questions.length} questions</CardDescription>
                    <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(quiz.timeLimit)}</span>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Challenge yourself and see how much you've learned!</p>
                </CardContent>
                <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/quizzes/${quiz.id}`}>Start Quiz</Link>
                </Button>
                </CardFooter>
            </Card>
            ))}
         </div>
      )}
    </div>
  );
}
