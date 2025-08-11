
'use client';

import { useState } from 'react';
import { getNotes, getSubjects, addSubject, deleteSubject as deleteSubjectFromData, deleteNote as deleteNoteFromData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MoreHorizontal, PlusCircle, Trash2, Library, FilePenLine, Eye } from 'lucide-react';
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

export default function ManageNotesPage() {
  const [notes, setNotes] = useState(getNotes());
  const [subjects, setSubjects] = useState(getSubjects());
  const [newSubject, setNewSubject] = useState('');
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const notesBySubject = subjects.reduce((acc, subject) => {
    acc[subject] = notes.filter(note => note.category === subject);
    return acc;
  }, {} as Record<string, Note[]>);

  const handleAddSubject = () => {
    if (!newSubject.trim()) {
      toast({ title: 'Error', description: 'Subject name cannot be empty.', variant: 'destructive' });
      return;
    }
    addSubject(newSubject);
    setSubjects(getSubjects());
    setNewSubject('');
    setIsSubjectDialogOpen(false);
    toast({ title: 'Success', description: `Subject "${newSubject}" has been added.` });
  };
  
  const handleDeleteSubject = (subject: string) => {
    if (confirm(`Are you sure you want to delete the subject "${subject}"? This will also delete all notes under it.`)) {
      // First, delete all notes associated with the subject
      const notesToDelete = notes.filter(note => note.category === subject);
      notesToDelete.forEach(note => deleteNoteFromData(note.id));

      // Then, delete the subject itself
      deleteSubjectFromData(subject);

      // Update state
      setSubjects(getSubjects());
      setNotes(getNotes());
      
      toast({ title: 'Deleted', description: `Subject "${subject}" and all its notes have been removed.`});
    }
  }
  
  const handleDeleteNote = (noteId: string) => {
     if (confirm('Are you sure you want to delete this note?')) {
        deleteNoteFromData(noteId);
        setNotes(getNotes());
        toast({ title: 'Deleted', description: 'The note has been removed.'});
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
                        />
                    </div>
                     <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddSubject}>Add Subject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>
      
      <div className="space-y-4">
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
        {subjects.length === 0 && (
             <div className="text-center text-muted-foreground py-12 bg-card rounded-lg">
              <p>No subjects created yet.</p>
              <p className="text-sm mt-2">Click "Add Subject" to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
}
