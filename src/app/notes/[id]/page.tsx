
'use client';

import { getNoteById } from '@/lib/data';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Note } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchNote = async () => {
      setLoading(true);
      const fetchedNote = await getNoteById(id);
      if (!fetchedNote) {
        notFound();
      } else {
        setNote(fetchedNote);
      }
      setLoading(false);
    };
    fetchNote();
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
          <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {note.content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
