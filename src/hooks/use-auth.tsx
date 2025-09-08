
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

const auth = getAuth(app);
const db = getFirestore(app);

interface AuthContextType {
  user: User | null;
  userRole: 'student' | 'teacher' | null;
  isNewUser: boolean | null;
  loading: boolean;
  recheckUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  isNewUser: null,
  loading: true,
  recheckUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const recheckUser = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
       const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          setIsNewUser(userData.isNewUser === true);
        }
        setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          setIsNewUser(userData.isNewUser === true);
        }
        setUser(user);
      } else {
        setUser(null);
        setUserRole(null);
        setIsNewUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const getRedirectPath = (role: string | null) => {
    switch (role) {
        case 'teacher':
            return '/dashboard';
        case 'student':
        default:
            return '/';
    }
  }

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isIntroPage = pathname === '/introduction';

    if (!user && !isAuthPage) {
        router.push('/login');
    } else if (user && isAuthPage) {
        const targetPath = getRedirectPath(userRole);
        router.push(targetPath);
    } else if (user && isNewUser && !isIntroPage) {
        router.push('/introduction');
    } else if (user && !isNewUser && isIntroPage) {
        // Prevent old users from accessing intro page
        const targetPath = getRedirectPath(userRole);
        router.push(targetPath);
    }

  }, [user, userRole, isNewUser, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, userRole, isNewUser, loading, recheckUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useUser = () => {
  const context = useAuth();
  return context.user;
}
