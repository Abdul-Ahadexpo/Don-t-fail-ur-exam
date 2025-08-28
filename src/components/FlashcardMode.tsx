import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { ChevronLeft, ChevronRight, RotateCcw, Eye } from 'lucide-react';

interface FlashcardModeProps {
  questions: Question[];
  onExit: () => void;
}

export function FlashcardMode({ questions, onExit }: FlashcardModeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledQuestions] = useState(() => [...questions].sort(() => Math.random() - 0.5));

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handlePrevious = () => {
    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentQuestionIndex(Math.min(shuffledQuestions.length - 1, currentQuestionIndex + 1));
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    const newShuffled = [...questions].sort(() => Math.random() - 0.5);
    setCurrentQuestionIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-white">Flashcard Study Mode</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShuffle}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Shuffle</span>
              </button>
              <button
                onClick={onExit}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors border border-gray-600"
              >
                Exit Flashcards
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
            <div className="text-center text-gray-300">
              Card {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-2xl h-96">
            <div 
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={handleFlip}
            >
              {/* Front of card - Question */}
              <div className="flashcard-front">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center cursor-pointer transform transition-transform hover:scale-105 shadow-2xl">
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      currentQuestion.type === 'multiple-choice' 
                        ? 'bg-blue-100 text-blue-800'
                        : currentQuestion.type === 'true-false'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {currentQuestion.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                  <p className="text-blue-100 text-sm opacity-75">
                    Click to reveal answer
                  </p>
                </div>
              </div>

              {/* Back of card - Answer */}
              <div className="flashcard-back">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center cursor-pointer transform transition-transform hover:scale-105 shadow-2xl">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-green-100 mb-4">Correct Answer:</h3>
                    <div className="text-2xl font-bold text-white mb-4">
                      {currentQuestion.correctAnswer}
                    </div>
                  </div>

                  {/* Show options for multiple choice */}
                  {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                    <div className="w-full mb-4">
                      <h4 className="text-green-100 text-sm mb-2">All Options:</h4>
                      <div className="space-y-1">
                        {currentQuestion.options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`text-sm p-2 rounded ${
                              option === currentQuestion.correctAnswer 
                                ? 'bg-green-500 text-white font-semibold' 
                                : 'bg-green-700 text-green-100'
                            }`}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show explanation if available */}
                  {currentQuestion.explanation && (
                    <div className="w-full">
                      <h4 className="text-green-100 text-sm mb-2">Explanation:</h4>
                      <p className="text-green-100 text-sm italic bg-green-700 p-3 rounded-lg">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}

                  <p className="text-green-100 text-sm opacity-75 mt-4">
                    Click to flip back
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">Progress</div>
            <div className="w-64 bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === shuffledQuestions.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentQuestionIndex === shuffledQuestions.length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .flashcard {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .flashcard.flipped {
          transform: rotateY(180deg);
        }

        .flashcard-front,
        .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 1rem;
        }

        .flashcard-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}