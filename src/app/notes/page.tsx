'use client'

import { useState } from 'react';
import { getNotes } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function NotesPage() {
  const notes = getNotes();
  const categories = ['All', ...Array.from(new Set(notes.map((note) => note.category)))];
  const [activeTab, setActiveTab] = useState(categories[0]);

  const filteredNotes = activeTab === 'All' ? notes : notes.filter(note => note.category === activeTab);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notes</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab}>
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
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
