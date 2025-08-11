
'use client';

import { useState } from 'react';
import { getNotes, getSubjects, addSubject, deleteSubject as deleteSubjectFromData, deleteNote as deleteNoteFromData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Trash2, FolderKanban } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ManageNotesPage() {
  const [notes, setNotes] = useState(getNotes());
  const [subjects, setSubjects] = useState(getSubjects());
  const [newSubject, setNewSubject] = useState('');
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddSubject = () => {
    if (!newSubject.trim()) {
      toast({ title: 'Error', description: 'Subject name cannot be empty.', variant: 'destructive' });
      return;
    }
    addSubject(newSubject);
    setSubjects(getSubjects());
    setNewSubject('');
    toast({ title: 'Success', description: `Subject "${newSubject}" has been added.` });
  };
  
  const handleDeleteSubject = (subject: string) => {
    // Optional: Add a check if any note is using this subject
    if (confirm(`Are you sure you want to delete the subject "${subject}"?`)) {
      deleteSubjectFromData(subject);
      setSubjects(getSubjects());
      toast({ title: 'Deleted', description: `Subject "${subject}" has been removed.`});
    }
  }
  
  const handleDeleteNote = (noteId: string) => {
     if (confirm('Are you sure you want to delete this note?')) {
        deleteNoteFromData(noteId);
        setNotes(getNotes());
        toast({ title: 'Deleted', description: 'The note has been removed.'});
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Notes</h1>
        <div className="flex gap-2">
           <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Subject
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Subjects</DialogTitle>
                        <DialogDescription>Add, view, or delete subjects for your notes.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex gap-2">
                            <Input 
                                placeholder="New subject name..." 
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                            />
                            <Button onClick={handleAddSubject}><PlusCircle className="h-4 w-4" /></Button>
                        </div>
                        <Card className="max-h-64 overflow-y-auto">
                            <CardContent className="p-2">
                                {subjects.map(subject => (
                                    <div key={subject} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                                        <span className="text-sm">{subject}</span>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 h-8 w-8" onClick={() => handleDeleteSubject(subject)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Notes</CardTitle>
          <CardDescription>View, edit, or delete your notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">{note.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{note.category}</Badge>
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
                          <DropdownMenuItem onClick={() => router.push(`/manage-notes/edit/${note.id}`)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteNote(note.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No notes found. Get started by creating one.
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
