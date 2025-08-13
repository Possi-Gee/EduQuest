
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import type { Note, Quiz, UserData, Student, Announcement, QuizAttempt } from './types';
import { getAuth } from 'firebase/auth';

// --- Notes ---
export const getNotes = async (): Promise<Note[]> => {
    const notesCol = collection(db, 'notes');
    const noteSnapshot = await getDocs(notesCol);
    const noteList = noteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
    return noteList;
};

export const getNoteById = async (id: string): Promise<Note | null> => {
    const noteRef = doc(db, 'notes', id);
    const noteSnap = await getDoc(noteRef);
    if (noteSnap.exists()) {
        return { id: noteSnap.id, ...noteSnap.data() } as Note;
    } else {
        return null;
    }
};

export const addNote = async (note: Omit<Note, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'notes'), note);
    // Ensure the subject exists in the subjects collection
    const subjectsRef = collection(db, "subjects");
    const q = query(subjectsRef, where("name", "==", note.category));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        await addDoc(subjectsRef, { name: note.category });
    }
    return docRef.id;
};

export const updateNote = async (id: string, updatedNote: Partial<Omit<Note, 'id'>>): Promise<void> => {
    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, updatedNote);
};

export const deleteNote = async (id: string): Promise<void> => {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
};


// --- Quizzes ---
export const getQuizzes = async (): Promise<Quiz[]> => {
    const quizzesCol = collection(db, 'quizzes');
    const quizSnapshot = await getDocs(quizzesCol);
    const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
    return quizList;
};

export const getQuizById = async (id: string): Promise<Quiz | null> => {
    const quizRef = doc(db, 'quizzes', id);
    const quizSnap = await getDoc(quizRef);
    if (quizSnap.exists()) {
        return { id: quizSnap.id, ...quizSnap.data() } as Quiz;
    } else {
        return null;
    }
};

export const addQuiz = async (quiz: Omit<Quiz, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'quizzes'), quiz);
     // Ensure the subject exists in the subjects collection
    const subjectsRef = collection(db, "subjects");
    const q = query(subjectsRef, where("name", "==", quiz.category));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        await addDoc(subjectsRef, { name: quiz.category });
    }
    return docRef.id;
};

export const updateQuiz = async (id: string, updatedQuiz: Partial<Omit<Quiz, 'id'>>): Promise<void> => {
    const quizRef = doc(db, 'quizzes', id);
    await updateDoc(quizRef, updatedQuiz);
};

export const deleteQuiz = async (id: string): Promise<void> => {
    const quizRef = doc(db, 'quizzes', id);
    await deleteDoc(quizRef);
};


// --- User & Students ---
export const getUser = async (): Promise<UserData> => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error("User not authenticated");
    }
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

    if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
            name: userData.name,
            avatarUrl: userData.photoURL || `https://placehold.co/100x100.png?text=${userData.name?.charAt(0)}`,
            quizHistory: userData.quizHistory || [],
        };
    }
     // Fallback for user just created
    return {
        name: currentUser?.displayName || 'Student',
        avatarUrl: currentUser?.photoURL || `https://placehold.co/100x100.png?text=${currentUser?.displayName?.charAt(0)}`,
        quizHistory: [], // Placeholder
    };
};

export const getUserById = async (id: string): Promise<Student | null> => {
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const data = userSnap.data();
        const quizHistory = data.quizHistory || [];
        const averageScore = quizHistory.length > 0
            ? Math.round(quizHistory.reduce((acc: number, curr: QuizAttempt) => acc + (curr.score / curr.total) * 100, 0) / quizHistory.length)
            : 0;

        return {
            id: userSnap.id,
            name: data.name,
            email: data.email,
            avatarUrl: data.photoURL || `https://placehold.co/100x100.png?text=${data.name.charAt(0)}`,
            quizzesTaken: quizHistory.length,
            averageScore: averageScore,
        } as Student;
    } else {
        return null;
    }
};

export const getStudents = async (): Promise<Student[]> => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "student"));
    const querySnapshot = await getDocs(q);

    const studentList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const quizHistory = data.quizHistory || [];
        const averageScore = quizHistory.length > 0
            ? Math.round(quizHistory.reduce((acc: number, curr: QuizAttempt) => acc + (curr.score / curr.total) * 100, 0) / quizHistory.length)
            : 0;

        return {
            id: doc.id,
            name: data.name,
            email: data.email,
            avatarUrl: data.photoURL || `https://placehold.co/100x100.png?text=${data.name.charAt(0)}`,
            quizzesTaken: quizHistory.length,
            averageScore: averageScore,
        } as Student;
    });

    return studentList;
};

export const deleteStudent = async (id: string): Promise<void> => {
    const studentRef = doc(db, 'users', id);
    await deleteDoc(studentRef);
};

export const getQuizHistoryForUser = async (userId: string): Promise<QuizAttempt[]> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const userData = userSnap.data();
        return (userData.quizHistory || []).sort((a: QuizAttempt, b: QuizAttempt) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
}

export const addQuizAttempt = async (userId: string, attempt: Omit<QuizAttempt, 'date'>) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        const newAttempt = {
            ...attempt,
            date: new Date().toISOString()
        };
        const updatedHistory = [...(userData.quizHistory || []), newAttempt];
        await updateDoc(userRef, { quizHistory: updatedHistory });
    }
};

export const updateUserOnboarding = async (userId: string): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isNewUser: false });
};


// --- Announcements ---
export const getAnnouncements = async (): Promise<Announcement[]> => {
    const announcementsCol = collection(db, 'announcements');
    const announcementSnapshot = await getDocs(announcementsCol);
    const announcementList = announcementSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
    // Sort by date descending
    return announcementList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addAnnouncement = async (announcement: Omit<Announcement, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'announcements'), announcement);
    return docRef.id;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
    const announcementRef = doc(db, 'announcements', id);
    await deleteDoc(announcementRef);
};

export const markAnnouncementsAsRead = async () => {
    // This function remains client-side as it deals with localStorage
    const announcements = await getAnnouncements();
    const allIds = announcements.map(a => a.id);
    if (typeof window !== 'undefined') {
        localStorage.setItem('readAnnouncementIds', JSON.stringify(allIds));
    }
};

// --- Subjects (Categories) ---
export const getSubjects = async (): Promise<string[]> => {
    const subjectsCol = collection(db, 'subjects');
    const subjectSnapshot = await getDocs(subjectsCol);
    const subjectList = subjectSnapshot.docs.map(doc => doc.data().name as string);
    return subjectList.sort();
};

export const addSubject = async (subjectName: string): Promise<void> => {
    // Check if subject already exists to avoid duplicates
    const subjectsRef = collection(db, "subjects");
    const q = query(subjectsRef, where("name", "==", subjectName));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        await addDoc(subjectsRef, { name: subjectName });
    } else {
        console.log(`Subject "${subjectName}" already exists.`);
    }
};

export const deleteSubject = async (subject: string): Promise<void> => {
    const batch = writeBatch(db);

    // Find and delete the subject document from the 'subjects' collection
    const subjectsRef = collection(db, "subjects");
    const subjectQuery = query(subjectsRef, where("name", "==", subject));
    const subjectSnapshot = await getDocs(subjectQuery);
    subjectSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Find and delete all notes with the subject
    const notesRef = collection(db, "notes");
    const notesQuery = query(notesRef, where("category", "==", subject));
    const notesSnapshot = await getDocs(notesQuery);
    notesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Find and delete all quizzes with the subject
    const quizzesRef = collection(db, "quizzes");
    const quizzesQuery = query(quizzesRef, where("category", "==", subject));
    const quizzesSnapshot = await getDocs(quizzesQuery);
    quizzesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();
};
