
export interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface Quiz {
  id:string;
  title: string;
  category: string;
  questions: QuizQuestion[];
  timeLimit: number; // Time limit in seconds
}

export interface QuizAttempt {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  date: string;
}

// This User type is for the static data, not Firebase auth user
export interface UserData {
  name: string;
  avatarUrl: string;
  quizHistory: QuizAttempt[];
}

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  quizzesTaken: number;
  averageScore: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}
