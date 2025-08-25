import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { CheckCircle, XCircle, Award } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  userAnswer?: string;
  showResult?: boolean;
  isReviewMode?: boolean;
  partialScore?: number;
  matchedWords?: string[];
  totalWords?: number;
}

export function QuestionCard({ 
  question, 
  onAnswer, 
  userAnswer, 
  showResult, 
  isReviewMode,
  partialScore,
  matchedWords,
  totalWords
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || '');

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (!isReviewMode) {
      onAnswer(answer);
    }
  };

  const isCorrect = showResult && selectedAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
  const isIncorrect = showResult && selectedAnswer && !isCorrect;
  const hasPartialCredit = showResult && partialScore !== undefined && partialScore > 0 && partialScore < 1;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl mx-auto transform transition-all duration-300 hover:border-gray-600">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white leading-relaxed">
          {question.question}
        </h2>
        
        {/* Partial Credit Display */}
        {hasPartialCredit && (
          <div className="mt-4 p-4 bg-amber-900/30 rounded-lg border-l-4 border-amber-400">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-semibold">
                Partial Credit: {Math.round(partialScore * 100)}%
              </span>
            </div>
            <p className="text-amber-200 text-sm">
              Matched {matchedWords?.length || 0} out of {totalWords || 0} key words
            </p>
            {matchedWords && matchedWords.length > 0 && (
              <p className="text-amber-200 text-sm mt-1">
                Matched words: <span className="font-semibold">{matchedWords.join(', ')}</span>
              </p>
            )}
          </div>
        )}
        
        {showResult && question.explanation && (
          <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border-l-4 border-blue-400">
            <p className="text-blue-300 text-sm">{question.explanation}</p>
          </div>
        )}
      </div>

      {question.type === 'multiple-choice' && (
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = showResult && option === question.correctAnswer;
            const isWrongSelection = showResult && isSelected && !isCorrectOption;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isReviewMode && showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isCorrectOption && showResult
                    ? 'border-green-500 bg-green-900/30 text-green-300'
                    : isWrongSelection
                    ? 'border-red-500 bg-red-900/30 text-red-300'
                    : isSelected
                    ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {showResult && isWrongSelection && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'true-false' && (
        <div className="space-y-3">
          {['true', 'false'].map((option) => {
            const isSelected = selectedAnswer.toLowerCase() === option;
            const isCorrectOption = showResult && option === question.correctAnswer.toLowerCase();
            const isWrongSelection = showResult && isSelected && !isCorrectOption;

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={isReviewMode && showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 capitalize ${
                  isCorrectOption && showResult
                    ? 'border-green-500 bg-green-900/30 text-green-300'
                    : isWrongSelection
                    ? 'border-red-500 bg-red-900/30 text-red-300'
                    : isSelected
                    ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {showResult && isWrongSelection && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'short-answer' && (
        <div className="space-y-4">
          <input
            type="text"
            value={selectedAnswer}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isReviewMode && onAnswer(selectedAnswer)}
            disabled={isReviewMode && showResult}
            placeholder="Type your answer here..."
            className={`w-full p-4 border-2 rounded-lg text-lg transition-all duration-200 ${
              showResult
                ? isCorrect
                  ? 'border-green-500 bg-green-900/30 text-green-300'
                  : isIncorrect
                  ? 'border-red-500 bg-red-900/30 text-red-300'
                  : 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:outline-none'
            }`}
          />
          {showResult && question.correctAnswer && (
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-300">
                Correct answer: <strong>{question.correctAnswer}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}