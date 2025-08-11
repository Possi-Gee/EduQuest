
'use client';

import { useState, useEffect } from 'react';
import { getNotes, getSubjects, addSubject, deleteSubject as deleteSubjectFromData, deleteNote as deleteNoteFromData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PlusCircle, Trash2, Library, FilePenLine, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function ManageNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
        const [fetchedNotes, fetchedSubjects] = await Promise.all([getNotes(), getSubjects()]);
        setNotes(fetchedNotes);
        setSubjects(fetchedSubjects);
    } catch(error) {
        toast({ title: 'Error', description: 'Failed to load notes and subjects.', variant: 'destructive'});
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  const notesBySubject = subjects.reduce((acc, subject) => {
    acc[subject] = notes.filter(note => note.category === subject);
    return acc;
  }, {} as Record<string, Note[]>);

  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      toast({ title: 'Error', description: 'Subject name cannot be empty.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
        await addSubject(newSubject);
        await fetchData(); // Refetch all data
        setNewSubject('');
        setIsSubjectDialogOpen(false);
        toast({ title: 'Success', description: `Subject "${newSubject}" has been added.` });
    } catch(error) {
         toast({ title: 'Error', description: 'Failed to add subject.', variant: 'destructive'});
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDeleteSubject = async (subject: string) => {
    if (confirm(`Are you sure you want to delete the subject "${subject}"? This will also delete all notes under it.`)) {
      try {
        await deleteSubjectFromData(subject);
        await fetchData(); // Refetch all data
        toast({ title: 'Deleted', description: `Subject "${subject}" and all its notes have been removed.`});
      } catch (error) {
        toast({ title: 'Error', description: `Failed to delete subject "${subject}".`, variant: 'destructive'});
      }
    }
  }
  
  const handleDeleteNote = async (noteId: string) => {
     if (confirm('Are you sure you want to delete this note?')) {
        try {
            await deleteNoteFromData(noteId);
            await fetchData(); // Refetch notes
            toast({ title: 'Deleted', description: 'The note has been removed.'});
        } catch(error) {
            toast({ title: 'Error', description: 'Failed to delete note.', variant: 'destructive'});
        }
    }
  }

  const navigateToNewNote = () => {
    if (subjects.length === 0) {
      toast({
        title: "No Subjects Found",
        description: "Please add a subject before creating a note.",
        variant: 'destructive',
      });
      return;
    }
    router.push('/manage-notes/new');
  }
  
  const LoadingSkeleton = () => (
    <div className="space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Manage Notes</h1>
            <p className="text-muted-foreground">Create, edit, and organize study materials for your students.</p>
        </div>
        <div className="flex gap-2">
            <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Subject
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                        <DialogDescription>Create a new subject to categorize your notes.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input 
                            placeholder="New subject name..." 
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                     <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleAddSubject} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Subject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>
      
      <div className="space-y-4">
        {loading ? <LoadingSkeleton /> : (
            <Accordion type="multiple" className="w-full space-y-2">
            {subjects.map(subject => (
                <AccordionItem key={subject} value={subject} className="bg-card border-none rounded-lg shadow-sm">
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                        <Library className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-lg">{subject}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <div className="space-y-2">
                    {notesBySubject[subject]?.length > 0 ? (
                            notesBySubject[subject].map(note => (
                                <div key={note.id} className="flex items-center justify-between p-3 bg-card/50 rounded-md">
                                    <span className="text-sm font-medium">{note.title}</span>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/notes/${note.id}`)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/manage-notes/edit/${note.id}`)}>
                                            <FilePenLine className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 h-8 w-8" onClick={() => handleDeleteNote(note.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center p-4">No notes in this subject yet.</p>
                    )}
                    <div className="flex justify-between items-center pt-2">
                            <Button variant="outline" size="sm" onClick={() => handleDeleteSubject(subject)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Subject
                            </Button>
                            <Button size="sm" onClick={navigateToNewNote}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Note
                            </Button>
                    </div>
                    </div>
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        )}
        {!loading && subjects.length === 0 && (
             <div className="text-center text-muted-foreground py-12 bg-card rounded-lg">
              <p>No subjects created yet.</p>
              <p className="text-sm mt-2">Click "Add Subject" to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
}
