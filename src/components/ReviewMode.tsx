import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface ReviewModeProps {
  questions: Question[];
  onExit: () => void;
}

export function ReviewMode({ questions, onExit }: ReviewModeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  const handlePrevious = () => {
    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-white">Review Mode</h1>
            </div>
            <button
              onClick={onExit}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors border border-gray-600"
            >
              Exit Review
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
            <div className="text-center text-gray-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            onAnswer={() => {}} // No-op in review mode
            userAnswer={currentQuestion.correctAnswer}
            showResult={true}
            isReviewMode={true}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentQuestionIndex === questions.length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}