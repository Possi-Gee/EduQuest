
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, User, Info, ChevronRight, Twitter, Github, Linkedin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    push: false,
    email: false,
  });
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedMode = localStorage.getItem('isTeacherMode');
    if (storedMode) {
      setIsTeacherMode(JSON.parse(storedMode));
    }
  }, []);

  const handleNotificationChange = (id: 'push' | 'email') => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences.</p>
      </div>
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
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="font-normal">
              <p>Push Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates on new quizzes and content.</p>
            </Label>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={() => handleNotificationChange('push')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="font-normal">
              <p>Email Notifications</p>
              <p className="text-xs text-muted-foreground">Get weekly summaries and updates.</p>
            </Label>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={() => handleNotificationChange('email')}
            />
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Information about the creator.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Avatar className="h-24 w-24 mx-auto border-4 border-background">
            <AvatarImage src="https://placehold.co/100x100.png" alt="App Creator" data-ai-hint="person face" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <h3 className="mt-4 text-xl font-semibold">The Creator</h3>
          <p className="text-muted-foreground mt-1">Full-Stack Developer & UI/UX Enthusiast</p>
          <p className="mt-4 max-w-md mx-auto text-foreground/90">
            I'm a passionate developer with a love for creating beautiful, functional, and user-centric applications. EduQuest is a project born from a desire to make learning more engaging and accessible for everyone.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="#" target="_blank">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href="#" target="_blank">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href="#" target="_blank">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
