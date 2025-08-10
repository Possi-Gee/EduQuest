import { getNoteById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const note = getNoteById(params.id);

  if (!note) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link href="/notes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notes
        </Link>
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
