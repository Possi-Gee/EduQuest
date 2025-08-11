import type { Note, Quiz, User, Student } from './types';

export const user: User = {
  name: 'Alex',
  avatarUrl: 'https://placehold.co/100x100.png',
  quizHistory: [
    { quizId: '1', quizTitle: 'History of Ancient Rome', score: 8, total: 10, date: '2024-05-10' },
    { quizId: '2', quizTitle: 'Introduction to Algebra', score: 9, total: 10, date: '2024-05-12' },
  ],
};

export const notes: Note[] = [
  {
    id: '1',
    category: 'History',
    title: 'The Roman Republic',
    content: 'The Roman Republic was the era of classical Roman civilization, beginning with the overthrow of the Roman Kingdom, traditionally dated to 509 BC, and ending in 27 BC with the establishment of the Roman Empire. It was during this period that Rome expanded from a small city-state to a vast empire.',
  },
  {
    id: '2',
    category: 'History',
    title: 'The Renaissance',
    content: 'The Renaissance was a period in European history, from the 14th to the 17th century, regarded as the cultural bridge between the Middle Ages and modern history. It started as a cultural movement in Italy in the Late Medieval period and later spread to the rest of Europe.',
  },
  {
    id: '3',
    category: 'Science',
    title: 'The Theory of Relativity',
    content: "Einstein's theory of relativity is a cornerstone of modern physics. It is divided into two parts: special relativity and general relativity. Special relativity deals with the relationship between space and time for objects moving at constant speeds, while general relativity is a theory of gravitation.",
  },
  {
    id: '4',
    category: 'Science',
    title: 'Photosynthesis',
    content: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy, through a process that converts carbon dioxide and water into glucose (sugar) and oxygen. This process is essential for life on Earth.',
  },
];

export const quizzes: Quiz[] = [
  {
    id: '1',
    title: 'History of Ancient Rome',
    timeLimit: 600, // 10 minutes
    questions: [
      {
        question: 'When was Rome founded?',
        options: ['753 BC', '509 BC', '44 BC', '27 BC'],
        answerIndex: 0,
      },
      {
        question: 'Who was the first Emperor of Rome?',
        options: ['Julius Caesar', 'Augustus', 'Nero', 'Constantine'],
        answerIndex: 1,
      },
      {
        question: 'The Punic Wars were fought between Rome and which other power?',
        options: ['Greece', 'Persia', 'Carthage', 'Egypt'],
        answerIndex: 2,
      },
       {
        question: 'What material did the Romans famously use in construction?',
        options: ['Steel', 'Concrete', 'Wood', 'Bronze'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: '2',
    title: 'Introduction to Algebra',
    timeLimit: 300, // 5 minutes
    questions: [
      {
        question: 'What is the value of x in the equation 2x + 3 = 7?',
        options: ['1', '2', '3', '4'],
        answerIndex: 1,
      },
      {
        question: 'What is (a + b)^2?',
        options: ['a^2 + b^2', 'a^2 + 2ab + b^2', 'a^2 - 2ab + b^2', 'a + b + 2'],
        answerIndex: 1,
      },
       {
        question: 'Simplify the expression: 3(x + 4) - 2x',
        options: ['x + 12', '5x + 12', 'x - 12', 'x + 4'],
        answerIndex: 0,
      },
    ],
  },
];

export const students: Student[] = [
  { id: '1', name: 'John Doe', avatarUrl: 'https://placehold.co/100x100.png', quizzesTaken: 5, averageScore: 85 },
  { id: '2', name: 'Jane Smith', avatarUrl: 'https://placehold.co/100x100.png', quizzesTaken: 8, averageScore: 92 },
  { id: '3', name: 'Sam Wilson', avatarUrl: 'https://placehold.co/100x100.png', quizzesTaken: 3, averageScore: 78 },
  { id: '4', name: 'Lisa Ray', avatarUrl: 'https://placehold.co/100x100.png', quizzesTaken: 10, averageScore: 88 },
];


// Helper functions to get data
export const getNotes = () => notes;
export const getNoteById = (id: string) => notes.find(note => note.id === id);
export const getQuizzes = () => quizzes;
export const getQuizById = (id: string) => quizzes.find(quiz => quiz.id === id);
export const getUser = () => user;
export const getStudents = () => students;
