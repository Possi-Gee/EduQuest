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

export interface User {
  name: string;
  avatarUrl: string;
  quizHistory: QuizAttempt[];
}
