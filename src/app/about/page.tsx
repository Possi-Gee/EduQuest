
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Linkedin, Twitter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in-50">
       <Button onClick={() => router.back()} variant="outline" size="icon">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <h1 className="text-3xl font-bold">About the Creator</h1>
        <p className="text-muted-foreground">The mind behind EduQuest.</p>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="bg-muted h-32" />
        </CardHeader>
        <CardContent className="p-6 text-center -mt-16">
          <Avatar className="h-24 w-24 mx-auto border-4 border-background">
            <AvatarImage src="https://poss-gee.github.io/website/webimage5-removebg.png" alt="App Creator" data-ai-hint="person face" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4">The Creator</CardTitle>
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
