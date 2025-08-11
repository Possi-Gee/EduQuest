
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { getSubjects, addNote } from '@/lib/data';
import { generateNote } from '@/ai/flows/generate-note-flow';
import { useToast } from '@/hooks/use-toast';

export default function NewNotePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
        const subjects = await getSubjects();
        setExistingCategories(subjects);
    };
    fetchSubjects();
  }, []);

  const handleSave = async () => {
    if (!title || !content || !category) {
        toast({ title: 'Missing Fields', description: 'Please fill out all fields.', variant: 'destructive'});
        return;
    }
    setIsSaving(true);
    try {
        await addNote({ title, content, category });
        toast({ title: 'Success!', description: 'Note created successfully.' });
        router.push('/manage-notes');
    } catch(error) {
        console.error("Failed to save note:", error);
        toast({ title: 'Save Failed', description: 'Could not create the note.', variant: 'destructive'});
    } finally {
        setIsSaving(false);
    }
  };

  const handleGenerateNote = async () => {
    if (!title) {
        toast({
            title: 'Title is required',
            description: 'Please enter a title to generate the note content.',
            variant: 'destructive'
        });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateNote({ title });
        setContent(result.noteContent);
    } catch (error) {
        console.error('Error generating note:', error);
        toast({
            title: 'Generation Failed',
            description: 'There was an error generating the note content.',
            variant: 'destructive'
        });
    } finally {
        setIsGenerating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50">
       <Button onClick={() => router.back()} variant="outline" size="icon" className="mb-4">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Create New Note</CardTitle>
          <CardDescription>Fill in the details below to create a new educational note.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g., The French Revolution" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Subject (Category)</Label>
            <Select onValueChange={setCategory} value={category}>
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
            <div className="flex justify-between items-center">
                <Label htmlFor="content">Content</Label>
                <Button variant="ghost" size="sm" onClick={handleGenerateNote} disabled={isGenerating || isSaving}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                </Button>
            </div>
            <Textarea 
                id="content" 
                placeholder="Write the note content here, or generate it with AI." 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="min-h-[250px]"
                disabled={isSaving}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push('/manage-notes')} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || isGenerating}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
