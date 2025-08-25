export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation?: string;
  partialCredit?: boolean; // For word-based scoring
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  answers: QuizAnswer[];
  participantName?: string;
  sharedQuizId?: string;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  question: Question;
  partialScore?: number; // 0-1 for word matching
  matchedWords?: string[];
  totalWords?: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  timeLimit?: number; // in minutes
  timeRemaining?: number; // in seconds
}

export interface SharedQuiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  settings: {
    timeLimit?: number;
    randomOrder: boolean;
    allowRetakes: boolean;
    showResults: boolean;
    collectNames: boolean;
  };
  attempts: QuizAttempt[];
  isActive: boolean;
}