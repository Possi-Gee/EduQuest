
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, notFound, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserById } from '@/lib/data';
import type { Student } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const fetchedUser = await getUserById(id);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
        <div className="space-y-6">
             <Skeleton className="h-10 w-10" />
             <Card>
                 <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-32 mt-4" />
                    <Skeleton className="h-4 w-48 mt-2" />
                 </CardHeader>
                 <CardContent>
                     <Skeleton className="h-10 w-full" />
                 </CardContent>
             </Card>
        </div>
    )
  }

  if (!user) {
    return null; // Should be handled by notFound
  }

  return (
    <div className="space-y-8 animate-in fade-in-50">
       <div className="flex items-center gap-4">
            <Button onClick={() => router.back()} variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold">{user.name}'s Profile</h1>
                <p className="text-muted-foreground">Viewing user details.</p>
            </div>
        </div>
      
        <Card className="max-w-md mx-auto">
            <CardHeader className="items-center text-center">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl pt-4">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
                {user.role === 'student' ? (
                  <div className="flex justify-around text-center">
                      <div>
                          <p className="text-2xl font-bold">{user.quizzesTaken}</p>
                          <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                      </div>
                      <div>
                          <p className="text-2xl font-bold">{user.averageScore}%</p>
                          <p className="text-sm text-muted-foreground">Average Score</p>
                      </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
