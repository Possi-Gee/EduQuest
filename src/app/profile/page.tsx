
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, KeyRound, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);
const storage = getStorage(app);

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setAvatarUrl(user.photoURL || `https://placehold.co/100x100.png?text=${user.displayName?.charAt(0)}`);
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    try {
      const filePath = `profile-images/${user.uid}/${file.name}`;
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setAvatarUrl(downloadURL);
      toast({ title: 'Image Uploaded', description: 'Click "Save Profile" to apply the change.' });

    } catch (error: any) {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: name,
        photoURL: avatarUrl,
      });

      // Update the user's document in Firestore as well
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: name,
        photoURL: avatarUrl,
      });

      toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully.' });
    } catch (error: any) {
      toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    } finally {
        setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !user.email) return;

    if (!currentPassword || !newPassword) {
      toast({ title: 'Error', description: 'Both password fields are required.', variant: 'destructive' });
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      // Re-authenticate user before changing password
      await reauthenticateWithCredential(user, credential);
      // Now change the password
      await updatePassword(user, newPassword);
      toast({ title: 'Password Changed', description: 'Your password has been updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast({ title: 'Password Change Failed', description: error.message, variant: 'destructive' });
    } finally {
        setIsChangingPassword(false);
    }
  };

  if (!user) {
    return null;
  }
  
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
      
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
            <CardHeader className="items-center text-center">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} alt={name} data-ai-hint="profile picture" />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <CardTitle className="text-2xl pt-4">{name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <Button onClick={handleAvatarClick} variant="outline" size="sm" className="w-full" disabled={isUploading}>
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {isUploading ? 'Uploading...' : 'Change Photo'}
                </Button>
            </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Account Settings</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving || isUploading} />
                    </div>
                    
                    <Button onClick={handleProfileUpdate} className="w-full" disabled={isSaving || isUploading}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Profile
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Change Password</CardTitle>
                    <CardDescription>Update your password. Make sure it's a strong one.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={isChangingPassword} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isChangingPassword} />
                    </div>
                    <Button onClick={handlePasswordChange} variant="outline" className="w-full" disabled={isChangingPassword}>
                        {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2" />}
                        Update Password
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
