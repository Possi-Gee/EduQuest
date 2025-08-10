import { getUser } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, ClipboardCheck, Sparkles } from 'lucide-react';

export default function Home() {
  const user = getUser();

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
      </div>
      <p className="text-muted-foreground">
        Ready to start your learning journey? Here are some quick links to get you started.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Notes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Access and review your educational notes.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/notes">Go to Notes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interactive Quizzes</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Test your knowledge with our quizzes.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/quizzes">Take a Quiz</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Summarizer</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Get quick summaries of notes from any URL.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/summarize">Summarize Note</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
