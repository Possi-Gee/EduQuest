
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, ClipboardCheck, User, Settings, Info, LayoutDashboard, Users, FilePlus, FilePenLine, MoreHorizontal, LayoutGrid, LogIn, UserPlus, Shield, School } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ReactNode, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { AnimatePresence, motion } from 'framer-motion';


const studentNavLinks = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/notes', icon: BookOpen, label: 'Notes' },
  { href: '/quizzes', icon: ClipboardCheck, label: 'Quizzes' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: LayoutGrid, label: 'More' },
];

const teacherNavLinks = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/manage-quizzes', icon: FilePlus, label: 'Manage Quizzes' },
  { href: '/manage-notes', icon: FilePenLine, label: 'Manage Notes' },
  { href: '/manage-students', icon: Users, label: 'Manage Students' },
  { href: '/settings', icon: LayoutGrid, label: 'More' },
];

const adminNavLinks = [
  { href: '/admin', icon: Home, label: 'Home' },
  { href: '/admin/manage-teachers', icon: Users, label: 'Manage Teachers' },
  { href: '/admin/manage-students', icon: Users, label: 'Manage Students' },
  { href: '/admin/settings', icon: Settings, label: 'School Settings' },
];

const superAdminNavLinks = [
  { href: '/superadmin', icon: Home, label: 'Home' },
  { href: '/superadmin/manage-admins', icon: Shield, label: 'Manage Admins' },
  { href: '/superadmin/manage-schools', icon: School, label: 'Manage Schools' },
  { href: '/superadmin/settings', icon: Settings, label: 'Platform Settings' },
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
        className="h-8 w-8"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <span className="truncate">EduQuest</span>
    </Link>
  );
}

function NavLinks({ navLinks }: { navLinks: {href: string, icon: React.ElementType, label: string}[] }) {
    const pathname = usePathname();
    return (
        <>
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
        </>
    );
}

function DesktopNav({ navLinks, user }: { navLinks: {href: string, icon: React.ElementType, label: string}[]; user: any }) {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card">
       <div className="p-4 border-b h-16 flex items-center">
         <Logo />
       </div>
       <nav className="flex-1 p-4 space-y-2">
         {user ? <NavLinks navLinks={navLinks} /> : (
             <>
                <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-primary"><LogIn className="h-4 w-4" /> Login</Link>
                <Link href="/signup" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-primary"><UserPlus className="h-4 w-4" /> Sign Up</Link>
             </>
         )}
       </nav>
       <div className="mt-auto p-4">
        {user && (
            <Link href="/profile">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
            </Link>
        )}
       </div>
     </aside>
  );
}

function MobileNav({ navLinks, user }: { navLinks: {href: string, icon: React.ElementType, label: string}[], user: any }) {
  const pathname = usePathname();
  if (!user) return null;

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
    const { user, userRole, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const getNavLinks = (role: string | null) => {
        switch(role) {
            case 'superadmin':
                return superAdminNavLinks;
            case 'admin':
                return adminNavLinks;
            case 'teacher':
                return teacherNavLinks;
            case 'student':
            default:
                return studentNavLinks;
        }
    }

    const navLinks = getNavLinks(userRole);
    const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/introduction';

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    if (isAuthPage) {
        return <>{children}</>;
    }


  return (
      <div className="flex min-h-screen w-full bg-background">
        <DesktopNav navLinks={navLinks} user={user} />
        <div className="flex flex-col flex-1">
          <header className="flex md:hidden sticky top-0 items-center justify-between h-16 px-4 border-b bg-card z-10">
            <Logo />
             {user && (
                <Link href="/profile">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
             )}
          </header>
          <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {user ? children : null}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <MobileNav navLinks={navLinks} user={user} />
      </div>
  );
}
