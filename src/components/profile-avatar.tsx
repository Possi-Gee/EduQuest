
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  fallback: React.ReactNode;
  className?: string;
  imageClassName?: string;
}

export function ProfileAvatar({ src, alt, fallback, className, imageClassName }: ProfileAvatarProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className={cn("cursor-pointer", className)}>
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="p-0 border-0 bg-transparent w-auto flex items-center justify-center">
        <Image
          src={src || ''}
          alt={alt || 'Profile Image'}
          width={512}
          height={512}
          className={cn("rounded-lg max-w-[80vw] max-h-[80vh] object-contain", imageClassName)}
          data-ai-hint="full profile picture"
        />
      </DialogContent>
    </Dialog>
  );
}
