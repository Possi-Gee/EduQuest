'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="font-normal">
              <p>Dark Mode</p>
              <p className="text-xs text-muted-foreground">Enable or disable dark theme.</p>
            </Label>
            <Switch id="dark-mode" defaultChecked />
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
            <Switch id="push-notifications" />
          </div>
           <div className="flex items-center justify-between">
             <Label htmlFor="email-notifications" className="font-normal">
              <p>Email Notifications</p>
              <p className="text-xs text-muted-foreground">Get weekly summaries and updates.</p>
            </Label>
            <Switch id="email-notifications" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
