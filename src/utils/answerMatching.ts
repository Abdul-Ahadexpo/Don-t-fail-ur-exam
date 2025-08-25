// Advanced answer matching utilities

export function calculateWordSimilarity(userAnswer: string, correctAnswer: string): {
  score: number;
  matchedWords: string[];
  totalWords: number;
} {
  // Normalize answers: lowercase, remove punctuation, split into words
  const normalizeText = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  };

  const userWords = normalizeText(userAnswer);
  const correctWords = normalizeText(correctAnswer);

  if (correctWords.length === 0) return { score: 0, matchedWords: [], totalWords: 0 };

  // Find exact matches
  const matchedWords: string[] = [];
  const correctWordsSet = new Set(correctWords);

  userWords.forEach(word => {
    if (correctWordsSet.has(word) && !matchedWords.includes(word)) {
      matchedWords.push(word);
    }
  });

  // Calculate similarity score
  const score = matchedWords.length / correctWords.length;

  return {
    score: Math.min(score, 1), // Cap at 100%
    matchedWords,
    totalWords: correctWords.length
  };
}

export function isAnswerCorrect(
  userAnswer: string, 
  correctAnswer: string, 
  questionType: string,
  partialCredit: boolean = false
): { isCorrect: boolean; partialScore?: number; matchedWords?: string[]; totalWords?: number } {
  
  if (questionType === 'short-answer' && partialCredit) {
    const similarity = calculateWordSimilarity(userAnswer, correctAnswer);
    return {
      isCorrect: similarity.score >= 0.7, // 70% word match = correct
      partialScore: similarity.score,
      matchedWords: similarity.matchedWords,
      totalWords: similarity.totalWords
    };
  }

  // For multiple choice and true/false, use exact matching
  const isExactMatch = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  
  return {
    isCorrect: isExactMatch,
    partialScore: isExactMatch ? 1 : 0
  };
}