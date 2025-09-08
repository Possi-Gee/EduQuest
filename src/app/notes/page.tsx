
'use client'

import { useState, useEffect } from 'react';
import { getNotes, getSubjects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import type { Note } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const [fetchedNotes, fetchedSubjects] = await Promise.all([getNotes(), getSubjects()]);
        setNotes(fetchedNotes);
        const allSubjects = ['All', ...fetchedSubjects];
        setSubjects(allSubjects);
        setActiveTab(allSubjects[0] || 'All');
        setLoading(false);
    };
    fetchData();
  }, []);

  const [activeTab, setActiveTab] = useState('All');

  const tabFilteredNotes = activeTab === 'All' ? notes : notes.filter(note => note.category === activeTab);
  const filteredNotes = tabFilteredNotes.filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const LoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
            </Card>
        ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <h1 className="text-3xl font-bold">Notes</h1>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search notes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      {loading ? (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <LoadingSkeleton />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={cn("w-full h-auto justify-start", subjects.length > 3 && "overflow-x-auto")}>
            {subjects.map((category) => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
            </TabsList>
            <TabsContent value={activeTab}>
                {filteredNotes.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                        {filteredNotes.map((note) => (
                        <Link href={`/notes/${note.id}`} key={note.id} className="focus:outline-none focus:ring-2 focus:ring-ring rounded-lg">
                            <Card className="h-full hover:bg-muted/50 transition-colors">
                            <CardHeader>
                                <CardTitle>{note.title}</CardTitle>
                                <CardDescription>{note.category}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                {note.content.replace(/##/g, '')}
                                </p>
                            </CardContent>
                            </Card>
                        </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No notes found for "{searchQuery}" in this category.</p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
