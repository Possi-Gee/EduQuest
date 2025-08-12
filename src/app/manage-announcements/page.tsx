
'use client';

import { useState, useEffect } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Announcement } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
      setLoading(true);
      const fetchedAnnouncements = await getAnnouncements();
      setAnnouncements(fetchedAnnouncements);
      setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePostAnnouncement = async () => {
    if (!title || !content) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
        await addAnnouncement({
          title,
          content,
          date: new Date().toISOString().split('T')[0],
        });
        
        await fetchAnnouncements();
        setTitle('');
        setContent('');
        setOpen(false);
        toast({
            title: 'Success!',
            description: 'The announcement has been posted.',
        });
    } catch(error) {
        toast({ title: 'Error', description: 'Failed to post announcement.', variant: 'destructive'});
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
        await deleteAnnouncementFromData(id);
        await fetchAnnouncements();
        toast({
            title: 'Deleted',
            description: 'The announcement has been removed.',
        });
    } catch (error) {
         toast({ title: 'Error', description: 'Failed to delete announcement.', variant: 'destructive'});
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handlePostAnnouncement} disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
          {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
          ) : announcements.length > 0 ? (
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
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the announcement.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(announcement.id)}>
                                  Continue
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
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
