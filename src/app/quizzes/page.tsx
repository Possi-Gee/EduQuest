
import { getQuizzes } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function QuizzesPage() {
  const quizzes = getQuizzes();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <h1 className="text-3xl font-bold">Quizzes</h1>
      <p className="text-muted-foreground">Test your knowledge. Choose a quiz to begin.</p>
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
    </div>
  );
}
