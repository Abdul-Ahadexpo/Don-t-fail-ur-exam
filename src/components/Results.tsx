import React from 'react';
import { QuizAnswer } from '../types/quiz';
import { Trophy, RotateCcw, BookOpen, Share2, CheckCircle, XCircle } from 'lucide-react';

interface ResultsProps {
  score: number;
  answers: QuizAnswer[];
  totalQuestions: number;
  onRetake?: () => void;
  onReview?: () => void;
}

export function Results({ score, answers, totalQuestions, onRetake, onReview }: ResultsProps) {
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = answers.filter(a => !a.isCorrect);

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-amber-100 border-amber-200';
    return 'bg-red-100 border-red-200';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Results',
        text: `I scored ${score}% on the quiz! (${correctAnswers}/${totalQuestions} correct)`,
      });
    } else {
      // Fallback: copy to clipboard
      const text = `I scored ${score}% on the quiz! (${correctAnswers}/${totalQuestions} correct)`;
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Display */}
        <div className={`bg-gray-800 rounded-2xl border-2 p-8 mb-8 ${getScoreBgColor()}`}>
          <div className="text-center">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${getScoreColor()}`} />
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h1>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
              {score}%
            </div>
            <p className="text-xl text-gray-300 mb-6">
              You got <span className="font-semibold">{correctAnswers}</span> out of{' '}
              <span className="font-semibold">{totalQuestions}</span> questions correct
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {onRetake && (
                <button
                  onClick={onRetake}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Retake Quiz</span>
                </button>
              )}
              {onReview && (
                <button
                  onClick={onReview}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Review Mode</span>
                </button>
              )}
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Results</span>
              </button>
            </div>
          </div>
        </div>

        {/* Incorrect Answers Review */}
        {incorrectAnswers.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <XCircle className="w-6 h-6 text-red-600 mr-2" />
              Questions to Review ({incorrectAnswers.length})
            </h2>
            
            <div className="space-y-6">
              {incorrectAnswers.map((answer, index) => (
                <div key={answer.questionId} className="border-l-4 border-red-400 pl-4 py-3 bg-red-900/20 rounded-r-lg">
                  <h3 className="font-semibold text-white mb-2">
                    {answer.question.question}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-red-300">
                        Your answer: <span className="font-semibold">{answer.userAnswer || 'No answer'}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-300">
                        Correct answer: <span className="font-semibold">{answer.question.correctAnswer}</span>
                      </span>
                    </div>
                    {answer.question.explanation && (
                      <p className="text-blue-300 mt-2 italic">{answer.question.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}