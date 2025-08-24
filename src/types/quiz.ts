export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  question: Question;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  timeLimit?: number; // in minutes
  timeRemaining?: number; // in seconds
}