
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // In a real app, these values would be fetched from your database
    const [schoolName, setSchoolName] = useState("EduQuest Academy");
    const [schoolMotto, setSchoolMotto] = useState("Excellence in Education");
    const [contactEmail, setContactEmail] = useState("contact@eduquest.com");
    const [contactPhone, setContactPhone] = useState("+1 (234) 567-890");

    const handleSaveChanges = () => {
        setIsSaving(true);
        // Simulate an API call
        setTimeout(() => {
            toast({
                title: "Settings Saved",
                description: "School information has been updated.",
            });
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">School Settings</h1>
                <p className="text-muted-foreground">Manage your school's general information.</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>School Information</CardTitle>
                    <CardDescription>Update the name, motto, and contact details for your school.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="school-name">School Name</Label>
                        <Input 
                            id="school-name" 
                            value={schoolName} 
                            onChange={(e) => setSchoolName(e.target.value)} 
                            disabled={isSaving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="school-motto">School Motto</Label>
                        <Input 
                            id="school-motto" 
                            value={schoolMotto} 
                            onChange={(e) => setSchoolMotto(e.target.value)} 
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="contact-email">Contact Email</Label>
                            <Input 
                                id="contact-email" 
                                type="email"
                                value={contactEmail} 
                                onChange={(e) => setContactEmail(e.target.value)} 
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-phone">Contact Phone</Label>
                            <Input 
                                id="contact-phone" 
                                type="tel"
                                value={contactPhone} 
                                onChange={(e) => setContactPhone(e.target.value)} 
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                         <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
