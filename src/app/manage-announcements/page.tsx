
'use client';

import { useState } from 'react';
import { getAnnouncements, addAnnouncement, deleteAnnouncement as deleteAnnouncementFromData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(getAnnouncements());
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handlePostAnnouncement = () => {
    if (!title || !content) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    addAnnouncement({
      title,
      content,
      date: new Date().toISOString().split('T')[0],
    });
    
    setAnnouncements(getAnnouncements());
    setTitle('');
    setContent('');
    setOpen(false);
    toast({
        title: 'Success!',
        description: 'The announcement has been posted.',
    });
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
        deleteAnnouncementFromData(id);
        setAnnouncements(getAnnouncements());
        toast({
            title: 'Deleted',
            description: 'The announcement has been removed.',
        });
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Announcements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Post New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Post New Announcement</DialogTitle>
              <DialogDescription>
                This announcement will be visible to all students.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="col-span-3 min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handlePostAnnouncement}>
                Post Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posted Announcements</CardTitle>
          <CardDescription>
            View and manage all past announcements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-card/50">
                <CardContent className="p-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Posted on {new Date(announcement.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDelete(announcement.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>No announcements posted yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
