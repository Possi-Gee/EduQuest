
'use client';

import { getUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


export default function ProfilePage() {
  const user = getUser();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const handleProfileUpdate = () => {
    // In a real app, you would update the user data source.
    user.name = name;
    user.avatarUrl = avatarUrl;
    toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
  };
  
  return (
    <div className="space-y-8 animate-in fade-in-50">
       <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Button onClick={() => router.back()} variant="outline" size="icon" className="mb-4">
            <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-4xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account and view your progress.</p>
            </div>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
            <Card>
                <CardHeader className="items-center text-center">
                     <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarUrl} alt={name} data-ai-hint="profile picture" />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl pt-4">{name}</CardTitle>
                </CardHeader>
            </Card>
        </div>

        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Account Settings</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture URL</Label>
                        <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                    </div>
                    <Button onClick={handleProfileUpdate} className="w-full">Save Profile</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
