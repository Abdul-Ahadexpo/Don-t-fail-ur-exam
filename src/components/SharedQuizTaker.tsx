import React, { useState, useEffect } from 'react';
import { SharedQuiz, QuizAnswer, QuizAttempt } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import { Timer } from './Timer';
import { Results } from './Results';
import { useTimer } from '../hooks/useTimer';
import { isAnswerCorrect } from '../utils/answerMatching';
import { addAttemptToSharedQuiz } from '../utils/shareUtils';
import { ChevronRight, Play, User } from 'lucide-react';

interface SharedQuizTakerProps {
  sharedQuiz: SharedQuiz;
  onComplete: () => void;
}

export function SharedQuizTaker({ sharedQuiz, onComplete }: SharedQuizTakerProps) {
  const [participantName, setParticipantName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [shuffledQuestions] = useState(() => 
    sharedQuiz.settings.randomOrder 
      ? [...sharedQuiz.questions].sort(() => Math.random() - 0.5)
      : sharedQuiz.questions
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const totalTimeInSeconds = sharedQuiz.settings.timeLimit ? sharedQuiz.settings.timeLimit * 60 : 0;
  const { timeRemaining, isActive, start, pause } = useTimer(
    totalTimeInSeconds,
    () => completeQuiz()
  );

  useEffect(() => {
    if (hasStarted && sharedQuiz.settings.timeLimit) {
      start();
    }
  }, [hasStarted, sharedQuiz.settings.timeLimit, start]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const userAnswer = answers.find(a => a.questionId === currentQuestion?.id)?.userAnswer || '';

  const handleStart = () => {
    if (sharedQuiz.settings.collectNames && !participantName.trim()) {
      alert('Please enter your name to continue.');
      return;
    }
    setHasStarted(true);
  };

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
      answers,
      participantName: participantName || 'Anonymous',
      sharedQuizId: sharedQuiz.id
    };

    addAttemptToSharedQuiz(sharedQuiz.id, attempt);
    setIsComplete(true);
  };

  // Start screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
            <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">{sharedQuiz.title}</h1>
            
            {sharedQuiz.description && (
              <p className="text-gray-300 mb-6">{sharedQuiz.description}</p>
            )}

            <div className="bg-gray-700 rounded-xl p-6 mb-6 border border-gray-600">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{sharedQuiz.questions.length}</div>
                  <div className="text-sm text-gray-400">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {sharedQuiz.settings.timeLimit || '∞'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {sharedQuiz.settings.timeLimit ? 'Minutes' : 'No Limit'}
                  </div>
                </div>
              </div>
            </div>

            {sharedQuiz.settings.collectNames && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div className="text-sm text-gray-400 mb-6">
              <p>Created by: <span className="font-semibold text-gray-300">{sharedQuiz.createdBy}</span></p>
              {sharedQuiz.settings.randomOrder && <p>• Questions will be in random order</p>}
              {sharedQuiz.settings.allowRetakes && <p>• You can retake this quiz</p>}
            </div>

            <button
              onClick={handleStart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (isComplete) {
    const totalScore = answers.reduce((sum, answer) => {
      return sum + (answer.partialScore || (answer.isCorrect ? 1 : 0));
    }, 0);
    const score = Math.round((totalScore / shuffledQuestions.length) * 100);

    if (!sharedQuiz.settings.showResults) {
      return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <ChevronRight className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Quiz Submitted!</h1>
              <p className="text-gray-300 mb-6">
                Thank you for taking "{sharedQuiz.title}". Your responses have been recorded.
              </p>
              <button
                onClick={onComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Results 
        score={score} 
        answers={answers} 
        totalQuestions={shuffledQuestions.length}
        onRetake={sharedQuiz.settings.allowRetakes ? () => window.location.reload() : undefined}
      />
    );
  }

  // Quiz taking screen
  const hasAnswered = userAnswer.trim() !== '';
  const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{sharedQuiz.title}</h1>
              {participantName && (
                <p className="text-gray-400">Taking as: {participantName}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {sharedQuiz.settings.timeLimit && (
                <Timer 
                  timeRemaining={timeRemaining} 
                  totalTime={totalTimeInSeconds} 
                  isActive={isActive} 
                />
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