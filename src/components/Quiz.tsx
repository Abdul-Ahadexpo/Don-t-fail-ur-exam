import React, { useState, useEffect } from 'react';
import { Question, QuizAnswer, QuizAttempt } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import { Timer } from './Timer';
import { Results } from './Results';
import { useTimer } from '../hooks/useTimer';
import { isAnswerCorrect } from '../utils/answerMatching';
import { ChevronRight, Play, Pause } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onComplete: (attempt: QuizAttempt) => void;
  timeLimit?: number; // in minutes
}

export function Quiz({ questions, onComplete, timeLimit }: QuizProps) {
  const [shuffledQuestions] = useState(() => [...questions].sort(() => Math.random() - 0.5));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const totalTimeInSeconds = timeLimit ? timeLimit * 60 : 0;
  const { timeRemaining, isActive, start, pause } = useTimer(
    totalTimeInSeconds,
    () => completeQuiz()
  );

  useEffect(() => {
    if (timeLimit) {
      start();
    }
  }, [timeLimit, start]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const userAnswer = answers.find(a => a.questionId === currentQuestion?.id)?.userAnswer || '';

  const handleAnswer = (answer: string) => {
    const result = isAnswerCorrect(
      answer, 
      currentQuestion.correctAnswer, 
      currentQuestion.type,
      currentQuestion.partialCredit
    );
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect: result.isCorrect,
      question: currentQuestion,
      partialScore: result.partialScore,
      matchedWords: result.matchedWords,
      totalWords: result.totalWords
    };

    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    setAnswers([...updatedAnswers, newAnswer]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    // Calculate score using partial credit
    const totalScore = answers.reduce((sum, answer) => {
      return sum + (answer.partialScore || (answer.isCorrect ? 1 : 0));
    }, 0);
    const score = (totalScore / shuffledQuestions.length) * 100;
    
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: Math.round(score),
      totalQuestions: shuffledQuestions.length,
      timeSpent,
      answers
    };

    setIsComplete(true);
    onComplete(attempt);
  };

  if (isComplete) {
    const score = (answers.filter(a => a.isCorrect).length / shuffledQuestions.length) * 100;
    return <Results score={Math.round(score)} answers={answers} totalQuestions={shuffledQuestions.length} />;
  }

  const hasAnswered = userAnswer.trim() !== '';
  const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-white">Quiz in Progress</h1>
            <div className="flex items-center space-x-4">
              {timeLimit && (
                <div className="flex items-center space-x-2">
                  <Timer 
                    timeRemaining={timeRemaining} 
                    totalTime={totalTimeInSeconds} 
                    isActive={isActive} 
                  />
                  <button
                    onClick={isActive ? pause : start}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-500"
                  >
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <ProgressBar 
            current={currentQuestionIndex + 1} 
            total={shuffledQuestions.length} 
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            userAnswer={userAnswer}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              hasAnswered
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{isLastQuestion ? 'Complete Quiz' : 'Next Question'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}