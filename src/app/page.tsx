
'use client';

import { getAnnouncements, markAnnouncementsAsRead } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, ClipboardCheck, Settings, Bell, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import type { Announcement } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, userRole, loading: authLoading } = useAuth();
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    if (authLoading) {
      return; // Wait until authentication is resolved
    }

    if (userRole === 'teacher') {
      router.replace('/dashboard');
      return; // Redirect teachers away from the student page
    }

    // Only fetch announcements if we have a confirmed student user
    if (userRole === 'student') {
      const fetchAnnouncements = async () => {
        setAnnouncementsLoading(true);
        try {
          const allAnnouncements = await getAnnouncements();
          setAnnouncements(allAnnouncements);

          // Use localStorage to track read status for this demo
          const readIds = JSON.parse(localStorage.getItem('readAnnouncementIds') || '[]');
          const unreadCount = allAnnouncements.filter(a => !readIds.includes(a.id)).length;
          setHasUnread(unreadCount > 0);
        } catch (error) {
          console.error("Failed to fetch announcements:", error);
          // Handle error appropriately, maybe show a toast
        } finally {
          setAnnouncementsLoading(false);
        }
      };
      
      fetchAnnouncements();
    } else {
      // If role is not student (or not determined yet), stop loading.
      setAnnouncementsLoading(false);
    }
  }, [userRole, authLoading, router]);

  const handleBellClick = () => {
    markAnnouncementsAsRead();
    setHasUnread(false);
  };
  
  if (authLoading) {
     return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  if (userRole === 'teacher') {
      return <div className="flex items-center justify-center min-h-screen">Redirecting to dashboard...</div>;
  }
  
  const AnnouncementSkeletons = () => (
    <>
      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3 mt-2" />
        </CardContent>
      </Card>
    </>
  );


  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {user?.displayName || 'Student'}!</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative" onClick={handleBellClick}>
              <Bell className="h-5 w-5" />
              {hasUnread && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Announcements</h4>
                <p className="text-sm text-muted-foreground">
                  Latest updates from your teacher.
                </p>
              </div>
              <div className="grid gap-2">
                {announcementsLoading ? <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin" /> : announcements.length > 0 ? (
                  announcements.slice(0, 3).map((announcement) => (
                     <div key={announcement.id} className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          {announcement.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {announcement.content}
                        </p>
                         <p className="text-xs text-muted-foreground mt-1">
                          {new Date(announcement.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No new announcements.</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {announcementsLoading ? <AnnouncementSkeletons /> : announcements.length > 0 && (
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-primary">{announcements[0].title}</CardTitle>
                <CardDescription className="text-primary/80">
                  Posted on {new Date(announcements[0].date).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">{announcements[0].content}</p>
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

    