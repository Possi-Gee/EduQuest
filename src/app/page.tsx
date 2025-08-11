import { getUser, getAnnouncements } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, ClipboardCheck, Settings, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const user = getUser();
  const announcements = getAnnouncements();
  const latestAnnouncement = announcements[0];

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
      </div>

      {latestAnnouncement && (
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-primary">{latestAnnouncement.title}</CardTitle>
                <CardDescription className="text-primary/80">
                  Posted on {new Date(latestAnnouncement.date).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">{latestAnnouncement.content}</p>
          </CardContent>
        </Card>
      )}

      <p className="text-muted-foreground">
        Ready to start your learning journey? Here are some quick links to get you started.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">My Notes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access and review your educational notes.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/notes">Go to Notes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Interactive Quizzes</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Test your knowledge with our quizzes.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/quizzes">Take a Quiz</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customize your app experience.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/settings">Go to Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
