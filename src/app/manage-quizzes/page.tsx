
'use client';

import { useState, useEffect } from 'react';
import { getQuizzes, deleteQuiz } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import type { Quiz } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchQuizzes = async () => {
      setLoading(true);
      const fetchedQuizzes = await getQuizzes();
      setQuizzes(fetchedQuizzes);
      setLoading(false);
  }

  useEffect(() => {
    fetchQuizzes();
  }, []);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        await fetchQuizzes();
        toast({title: 'Deleted', description: 'The quiz has been removed.'});
      } catch(error) {
        toast({title: 'Error', description: 'Failed to delete the quiz.', variant: 'destructive'});
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Quizzes</h1>
        <Button onClick={() => router.push('/manage-quizzes/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Quizzes</CardTitle>
          <CardDescription>View, edit, or delete your quizzes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell text-center">Questions</TableHead>
                <TableHead className="hidden md:table-cell text-center">Time Limit</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({length: 3}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="hidden md:table-cell text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                        <TableCell className="hidden md:table-cell text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
              ) : quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                     <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{quiz.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      {quiz.questions.length}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <Badge variant="secondary">{formatTime(quiz.timeLimit)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/manage-quizzes/edit/${quiz.id}`)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteQuiz(quiz.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No quizzes found. Get started by creating one.
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
