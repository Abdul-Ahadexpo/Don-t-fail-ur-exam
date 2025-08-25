import { SharedQuiz, Question } from '../types/quiz';

export function generateShareableLink(quizId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}?quiz=${quizId}`;
}

export function generateQuizId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function createSharedQuiz(
  questions: Question[],
  title: string,
  creatorName: string,
  settings: SharedQuiz['settings'],
  description?: string,
  expirationDays?: number
): SharedQuiz {
  const id = generateQuizId();
  const now = new Date();
  const expiresAt = expirationDays 
    ? new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  return {
    id,
    title,
    description,
    questions: questions.map(q => ({ ...q, id: `${id}_${q.id}` })),
    createdBy: creatorName,
    createdAt: now.toISOString(),
    expiresAt,
    settings,
    attempts: [],
    isActive: true
  };
}

export function saveSharedQuiz(sharedQuiz: SharedQuiz): void {
  const existingQuizzes = getSharedQuizzes();
  const updatedQuizzes = existingQuizzes.filter(q => q.id !== sharedQuiz.id);
  updatedQuizzes.push(sharedQuiz);
  localStorage.setItem('shared-quizzes', JSON.stringify(updatedQuizzes));
}

export function getSharedQuizzes(): SharedQuiz[] {
  try {
    const stored = localStorage.getItem('shared-quizzes');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getSharedQuiz(id: string): SharedQuiz | null {
  const quizzes = getSharedQuizzes();
  const quiz = quizzes.find(q => q.id === id);
  
  // Check if quiz is expired
  if (quiz && quiz.expiresAt && new Date() > new Date(quiz.expiresAt)) {
    quiz.isActive = false;
    saveSharedQuiz(quiz);
  }
  
  return quiz || null;
}

export function addAttemptToSharedQuiz(quizId: string, attempt: any): void {
  const quiz = getSharedQuiz(quizId);
  if (quiz) {
    quiz.attempts.push({ ...attempt, sharedQuizId: quizId });
    saveSharedQuiz(quiz);
  }
}