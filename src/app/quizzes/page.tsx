import { getQuizzes } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function QuizzesPage() {
  const quizzes = getQuizzes();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quizzes</h1>
      <p className="text-muted-foreground">Test your knowledge. Choose a quiz to begin.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.questions.length} questions</CardDescription>
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
