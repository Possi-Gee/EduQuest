
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, User, Info, Bell, Settings as SettingsIcon, GraduationCap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const GridItem = ({ href, icon: Icon, label, action, isDialog = false, children }: { href?: string; icon: React.ElementType, label: string; action?: () => void; isDialog?: boolean; children?: React.ReactNode }) => {
  const content = (
      <div className="flex flex-col items-center justify-center text-center gap-2 p-4 h-full">
        <Icon className="h-8 w-8 text-primary" />
        <span className="font-medium text-sm">{label}</span>
      </div>
  );

  if (isDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-card hover:bg-muted/50 transition-colors rounded-lg shadow-sm w-full h-32 text-card-foreground">
             {content}
          </button>
        </DialogTrigger>
        {children}
      </Dialog>
    );
  }

  if (href) {
    return (
        <Link href={href} className="block bg-card hover:bg-muted/50 transition-colors rounded-lg shadow-sm w-full h-32">
            {content}
        </Link>
    );
  }
  
  return (
    <button onClick={action} className="bg-card hover:bg-muted/50 transition-colors rounded-lg shadow-sm w-full h-32 text-card-foreground">
      {content}
    </button>
  );
};


export default function MorePage() {
  const { theme, setTheme } = useTheme();
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedMode = localStorage.getItem('isTeacherMode');
    if (storedMode) {
      setIsTeacherMode(JSON.parse(storedMode));
    }
    setIsLoading(false);
  }, []);
  
  const handleTeacherModeChange = (value: boolean) => {
    setIsTeacherMode(value);
    localStorage.setItem('isTeacherMode', JSON.stringify(value));
    window.location.href = value ? '/dashboard' : '/';
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold">More</h1>
        <p className="text-muted-foreground">Manage your account and app preferences.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <GridItem href="/profile" icon={User} label="Profile" />
         <GridItem isDialog icon={MessageSquare} label="Notifications">
             <DialogContent>
                <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                    <DialogDescription>
                        Manage how you receive notifications from EduQuest.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="push-notifications" className="font-normal">
                            <p>Push Notifications</p>
                            <p className="text-xs text-muted-foreground">Receive updates on your device.</p>
                        </Label>
                        <Switch id="push-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications" className="font-normal">
                            <p>Email Notifications</p>
                            <p className="text-xs text-muted-foreground">Get summaries and alerts via email.</p>
                        </Label>
                        <Switch id="email-notifications" />
                    </div>
                </div>
            </DialogContent>
        </GridItem>
        <GridItem href="/about" icon={Info} label="About" />
        <GridItem isDialog icon={SettingsIcon} label="Settings">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Customize your app experience.
                    </DialogDescription>
                </DialogHeader>
                 <div className="space-y-6 pt-2">
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
                </div>
            </DialogContent>
        </GridItem>
        {isTeacherMode && (
             <GridItem href="/manage-announcements" icon={Bell} label="Announcements" />
        )}
        <GridItem action={() => {}} icon={LogOut} label="Logout" />
      </div>
    </div>
  );
}
