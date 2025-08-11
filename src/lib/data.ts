
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import type { Note, Quiz, UserData, Student, Announcement } from './types';
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
    // This is a placeholder. In a real app, you'd fetch this from your 'users' collection
    // based on the authenticated user's ID.
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return {
        name: currentUser?.displayName || 'Student',
        avatarUrl: currentUser?.photoURL || `https://placehold.co/100x100.png?text=${currentUser?.displayName?.charAt(0)}`,
        quizHistory: [], // Placeholder
    };
};

export const getStudents = async (): Promise<Student[]> => {
    // Fetches documents from the 'users' collection where role is 'student'
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "student"));
    const querySnapshot = await getDocs(q);
    const studentList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            avatarUrl: data.photoURL || `https://placehold.co/100x100.png?text=${data.name.charAt(0)}`,
            quizzesTaken: 0, // Placeholder data
            averageScore: 0, // Placeholder data
        } as Student;
    });
    return studentList;
};

export const deleteStudent = async (id: string): Promise<void> => {
    // Note: This deletes the user's record from your 'users' collection.
    // It does NOT delete their Firebase Auth account. That requires a backend function.
    const studentRef = doc(db, 'users', id);
    await deleteDoc(studentRef);
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
// Subjects are derived from notes and quizzes, so we'll get them from those collections.
export const getSubjects = async (): Promise<string[]> => {
    const notesPromise = getNotes();
    const quizzesPromise = getQuizzes();
    const [notes, quizzes] = await Promise.all([notesPromise, quizzesPromise]);
    const subjects = new Set([...notes.map(n => n.category), ...quizzes.map(q => q.category)]);
    return [...subjects].sort();
};

export const addSubject = async (subject: string): Promise<void> => {
    // Subjects are not a separate collection. They are just fields in notes/quizzes.
    // To "add" a subject, you create a note or quiz with that category.
    // This function could add a placeholder document to a 'subjects' collection if needed,
    // but based on the current setup, it's not necessary. We'll leave this as a no-op
    // for now, but the UI calls it, so the function needs to exist.
    console.log(`A new subject "${subject}" will be available once a note or quiz is added to it.`);
};

export const deleteSubject = async (subject: string): Promise<void> => {
    // This is a complex operation. It requires deleting all notes and quizzes with the subject.
    // A batch write is the most efficient way to do this.
    const batch = writeBatch(db);

    // Find all notes with the subject and add delete operations to the batch
    const notesRef = collection(db, "notes");
    const notesQuery = query(notesRef, where("category", "==", subject));
    const notesSnapshot = await getDocs(notesQuery);
    notesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Find all quizzes with the subject and add delete operations to the batch
    const quizzesRef = collection(db, "quizzes");
    const quizzesQuery = query(quizzesRef, where("category", "==", subject));
    const quizzesSnapshot = await getDocs(quizzesQuery);
    quizzesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();
};
