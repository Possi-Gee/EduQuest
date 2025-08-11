
'use client';

import { useState, use, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getNoteById, getSubjects, updateNote } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = params;

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [currentNote, subjects] = await Promise.all([
          getNoteById(id),
          getSubjects()
        ]);

        if (currentNote) {
          setNote(currentNote);
          setTitle(currentNote.title);
          setContent(currentNote.content);
          setCategory(currentNote.category);
          setExistingCategories(subjects);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch note data", error);
        toast({ title: "Error", description: "Failed to load note details.", variant: 'destructive' });
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  if (loading) {
    return (
       <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50">
           <Skeleton className="h-10 w-10" />
           <Card>
               <CardHeader>
                   <Skeleton className="h-8 w-1/2" />
                   <Skeleton className="h-4 w-3/4" />
               </CardHeader>
               <CardContent className="space-y-6">
                   <div className="space-y-2">
                       <Skeleton className="h-4 w-1/4" />
                       <Skeleton className="h-10 w-full" />
                   </div>
                   <div className="space-y-2">
                       <Skeleton className="h-4 w-1/4" />
                       <Skeleton className="h-10 w-full" />
                   </div>
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-1/4" />
                       <Skeleton className="h-40 w-full" />
                   </div>
               </CardContent>
           </Card>
       </div>
    )
  }

  if (!note) {
    return null; // Should be handled by notFound
  }

  const handleSave = async () => {
     if (!title || !content || !category) {
        toast({ title: 'Missing Fields', description: 'Please fill out all fields.', variant: 'destructive'});
        return;
    }
    setIsSaving(true);
    try {
        await updateNote(id, { title, content, category });
        toast({ title: 'Success!', description: 'Note updated successfully.' });
        router.push('/manage-notes');
    } catch(error) {
        toast({ title: 'Save Failed', description: 'Could not update the note.', variant: 'destructive' });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50">
       <Button onClick={() => router.back()} variant="outline" size="icon" className="mb-4" disabled={isSaving}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
          <CardDescription>Update the details for this educational note.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isSaving} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Subject (Category)</Label>
            <Select onValueChange={setCategory} value={category} disabled={isSaving}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                    {existingCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[200px]" disabled={isSaving} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push('/manage-notes')} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
