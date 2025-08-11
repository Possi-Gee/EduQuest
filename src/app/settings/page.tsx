
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, User, Info, ChevronRight, Twitter, Github, Linkedin, ArrowLeft, Bell, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function MorePage() {
  const { theme, setTheme } = useTheme();
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedMode = localStorage.getItem('isTeacherMode');
    if (storedMode) {
      setIsTeacherMode(JSON.parse(storedMode));
    }
  }, []);
  
  const handleTeacherModeChange = (value: boolean) => {
    setIsTeacherMode(value);
    localStorage.setItem('isTeacherMode', JSON.stringify(value));
    // A simple way to refresh the layout without a full page reload
    if (value) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
    // A full reload might be better to ensure layout changes apply cleanly.
    window.location.href = value ? '/dashboard' : '/';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold">More</h1>
        <p className="text-muted-foreground">Manage your account and app preferences.</p>
      </div>

      {isTeacherMode && (
         <Card>
            <CardHeader>
            <CardTitle>Teacher Actions</CardTitle>
            <CardDescription>Manage teacher-specific features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-between">
                    <Link href="/manage-announcements">
                        <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Manage Announcements
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                </Button>
            </CardContent>
      </Card>
      )}
     
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-between">
                <Link href="/profile">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Update Profile
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Logout
            </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mode</CardTitle>
          <CardDescription>Switch between student and teacher views.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="teacher-mode" className="font-normal">
              <p>Teacher Mode</p>
              <p className="text-xs text-muted-foreground">Access the teacher dashboard.</p>
            </Label>
            <Switch
              id="teacher-mode"
              checked={isTeacherMode}
              onCheckedChange={handleTeacherModeChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="font-normal">
              <p>Theme</p>
              <p className="text-xs text-muted-foreground">Select a light or dark theme.</p>
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-5 w-5" />
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Information about the creator.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button asChild variant="outline" className="w-full justify-between">
                <Link href="/about">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        About the Creator
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
