'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ClipboardCheck, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';


const navLinks = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/notes', icon: BookOpen, label: 'Notes' },
  { href: '/quizzes', icon: ClipboardCheck, label: 'Quizzes' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <span className="truncate">EduQuest</span>
    </Link>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card">
       <div className="p-4 border-b h-16 flex items-center">
         <Logo />
       </div>
       <nav className="flex-1 p-4 space-y-2">
         {navLinks.map(({ href, icon: Icon, label }) => (
           <Link
             key={href}
             href={href}
             className={cn(
               'flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-primary',
               { 'bg-muted text-primary': pathname === href }
             )}
           >
             <Icon className="h-4 w-4" />
             {label}
           </Link>
         ))}
       </nav>
       <div className="mt-auto p-4">
        <Link href="/profile">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
          </Avatar>
        </Link>
       </div>
     </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <nav className="flex justify-around p-1">
        {navLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-md text-xs text-muted-foreground w-16',
              { 'text-primary bg-primary/10': pathname === href }
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
  return (
      <div className="flex min-h-screen w-full bg-background">
        <DesktopNav />
        <div className="flex flex-col flex-1">
          <header className="flex md:hidden sticky top-0 items-center justify-between h-16 px-4 border-b bg-card z-10">
            <Logo />
          </header>
          <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
              {children}
          </main>
        </div>
        <MobileNav />
      </div>
  );
}
