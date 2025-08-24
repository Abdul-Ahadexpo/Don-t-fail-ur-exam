import React from 'react';
import { QuizAttempt } from '../types/quiz';
import { Trophy, Calendar, Clock, Target } from 'lucide-react';

interface ProgressTrackerProps {
  attempts: QuizAttempt[];
}

export function ProgressTracker({ attempts }: ProgressTrackerProps) {
  const sortedAttempts = [...attempts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const bestScore = Math.max(...attempts.map(a => a.score), 0);
  const averageScore = attempts.length > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0;
  const totalQuizzes = attempts.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  if (attempts.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Quiz Attempts Yet</h3>
        <p className="text-gray-400">Take your first quiz to see your progress here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Best Score</p>
              <p className="text-2xl font-bold text-blue-600">{bestScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-green-600">{averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Attempts</p>
              <p className="text-2xl font-bold text-purple-600">{totalQuizzes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Attempts</h3>
        <div className="space-y-4">
          {sortedAttempts.slice(0, 10).map((attempt) => (
            <div
              key={attempt.id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(attempt.score)}`}>
                  {attempt.score}%
                </div>
                <div>
                  <p className="font-medium text-white">
                    {attempt.score >= 80 ? 'Excellent!' : attempt.score >= 60 ? 'Good job!' : 'Keep practicing!'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {attempt.answers.filter(a => a.isCorrect).length}/{attempt.totalQuestions} correct
                  </p>
                </div>
              </div>

              <div className="text-right text-sm text-gray-400">
                <div className="flex items-center space-x-1 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(attempt.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(attempt.timeSpent)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedAttempts.length > 10 && (
          <p className="text-center text-gray-400 text-sm mt-4">
            Showing 10 most recent attempts out of {sortedAttempts.length} total
          </p>
        )}
      </div>
    </div>
  );
}