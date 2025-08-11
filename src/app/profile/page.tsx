
'use client';

import { getUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const user = getUser();
  const router = useRouter();

  return (
    <div className="space-y-8">
       <Button onClick={() => router.back()} variant="outline" size="icon" className="mb-4">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile picture" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">Your learning journey at a glance.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.quizHistory.length > 0 ? (
                user.quizHistory.map((attempt) => (
                  <TableRow key={`${attempt.quizId}-${attempt.date}`}>
                    <TableCell className="font-medium">{attempt.quizTitle}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={attempt.score / attempt.total > 0.7 ? "default" : "secondary" } className="bg-green-600/20 text-green-400 border-green-600/30">
                           {attempt.score} / {attempt.total}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{new Date(attempt.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">No quizzes taken yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
