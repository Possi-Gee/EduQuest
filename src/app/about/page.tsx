
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Linkedin, Twitter, ArrowLeft, Facebook, Instagram } from 'lucide-react';
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
            <AvatarImage src="https://poss-gee.github.io/website/webimage5-removebg.png" alt="Ofori Michael" data-ai-hint="person face" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4">Ofori Michael</CardTitle>
          <p className="text-muted-foreground mt-1">Front-end Developer & Tech Enthusiast</p>
          <div className="mt-4 max-w-md mx-auto text-foreground/90 space-y-4 text-left">
            <p>
              As someone who understands the challenges students face when trying to find organized and reliable study materials, Michael built EduQuest to make learning easier, smarter, and more accessible — no matter where you are or what device you're using.
            </p>
            <p>
              His vision was simple: combine modern design, AI technology, and real-time access to help students study better and perform at their best.
            </p>
             <p>
              EduQuest is just one of many projects Michael is working on to bridge the gap between education and technology. You can follow his journey and future innovations on his social media.
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="https://twitter.com/PossiGee55175467" target="_blank">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">X (Twitter)</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href="https://www.facebook.com/PossiGee" target="_blank">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href="https://www.instagram.com/possi_gee_23/" target="_blank">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
