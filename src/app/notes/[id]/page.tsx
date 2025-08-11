
'use client';

import { getNoteById, getQuizzes } from '@/lib/data';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Note, Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [note, setNote] = useState<Note | null>(null);
  const [relatedQuizId, setRelatedQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchNoteAndQuiz = async () => {
      setLoading(true);
      const [fetchedNote, allQuizzes] = await Promise.all([
        getNoteById(id),
        getQuizzes(),
      ]);

      if (!fetchedNote) {
        notFound();
      } else {
        setNote(fetchedNote);
        // Find the first quiz that matches the note's category
        const relatedQuiz = allQuizzes.find(quiz => quiz.category === fetchedNote.category);
        if (relatedQuiz) {
          setRelatedQuizId(relatedQuiz.id);
        }
      }
      setLoading(false);
    };
    fetchNoteAndQuiz();
  }, [id]);

  if (loading) {
     return (
        <div className="space-y-6 animate-in fade-in-50">
            <Skeleton className="h-10 w-10" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                </CardContent>
            </Card>
        </div>
     );
  }

  if (!note) {
    return null; // notFound() should have been called
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Button onClick={() => router.back()} variant="outline" size="icon">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{note.title}</CardTitle>
          <CardDescription>{note.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.content}
            </ReactMarkdown>
          </div>
           {relatedQuizId && (
            <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Ready to test your knowledge?</h3>
                <Button asChild>
                    <Link href={`/quizzes/${relatedQuizId}`}>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Take a Related Quiz
                    </Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
