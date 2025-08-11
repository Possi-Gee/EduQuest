
'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { getUserById, getQuizHistoryForUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import type { Student, QuizAttempt } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function StudentProgressPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [student, setStudent] = useState<Student | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedStudent, fetchedHistory] = await Promise.all([
          getUserById(id),
          getQuizHistoryForUser(id),
        ]);
        
        if (fetchedStudent) {
          setStudent(fetchedStudent);
          setQuizHistory(fetchedHistory);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch student progress:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
      return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
      )
  }

  if (!student) {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold">{student.name}'s Progress</h1>
            <p className="text-muted-foreground">Review of all quiz attempts and scores.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
          <CardDescription>A complete log of all quizzes attempted by the student.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizHistory.length > 0 ? (
                quizHistory.map((attempt) => (
                  <TableRow key={attempt.quizId + attempt.date}>
                    <TableCell className="font-medium">{attempt.quizTitle}</TableCell>
                    <TableCell>{new Date(attempt.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">
                        <Badge 
                            variant="outline"
                             className={cn(
                                (attempt.score / attempt.total) * 100 > 70 ? "border-green-600/50 bg-green-500/10 text-green-400" : "border-amber-600/50 bg-amber-500/10 text-amber-400"
                            )}
                        >
                            {attempt.score}/{attempt.total}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        {(attempt.score / attempt.total) * 100 >= 70 ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                            <XCircle className="h-5 w-5 text-destructive mx-auto" />
                        )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    This student has not attempted any quizzes yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
