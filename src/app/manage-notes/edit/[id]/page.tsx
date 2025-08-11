
'use client';

import { useState, use, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { getNotes, getNoteById } from '@/lib/data';

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [note, setNote] = useState(getNoteById(id));
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [category, setCategory] = useState(note?.category ?? '');
  
  const notes = getNotes();
  const existingCategories = [...new Set(notes.map(note => note.category))];
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const currentNote = getNoteById(id);
    if (currentNote) {
      setNote(currentNote);
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setCategory(currentNote.category);
    } else {
      notFound();
    }
  }, [id]);

  if (!note) {
    return null; // Or a loading indicator
  }

  const handleSave = () => {
    // In a real app, you would save this data to your backend
    const finalCategory = isAddingNewCategory ? newCategory : category;
     if (!title || !content || !finalCategory) {
        alert('Please fill out all fields.');
        return;
    }
    console.log('Updating note:', { id, title, content, category: finalCategory });
    alert('Note updated successfully! (Check console)');
    router.push('/manage-notes');
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'add-new') {
      setIsAddingNewCategory(true);
      setCategory(value);
    } else {
      setIsAddingNewCategory(false);
      setCategory(value);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50">
       <Button onClick={() => router.back()} variant="outline" size="icon" className="mb-4">
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
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Subject (Category)</Label>
            <Select onValueChange={handleCategoryChange} value={category}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                    {existingCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    <SelectItem value="add-new">
                        <span className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add new subject
                        </span>
                    </SelectItem>
                </SelectContent>
            </Select>
          </div>

          {isAddingNewCategory && (
            <div className="space-y-2 pl-1 animate-in fade-in-25">
              <Label htmlFor="new-category">New Subject Name</Label>
              <Input id="new-category" placeholder="e.g., European History" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[200px]" />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push('/manage-notes')}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
