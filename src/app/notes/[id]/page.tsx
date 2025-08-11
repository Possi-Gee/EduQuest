
'use client';

import { getNoteById } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { use } from 'react';

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const note = getNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => router.back()} variant="outline" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{note.title}</CardTitle>
          <CardDescription>{note.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-foreground/90">{note.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
