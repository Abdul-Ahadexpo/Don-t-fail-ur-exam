import React, { useState, useEffect } from 'react';
import { SharedQuiz } from '../types/quiz';
import { getSharedQuizzes, saveSharedQuiz } from '../utils/shareUtils';
import { Users, Calendar, Clock, Eye, EyeOff, BarChart3, Trash2, Copy } from 'lucide-react';

interface SharedQuizManagerProps {
  onClose: () => void;
}

export function SharedQuizManager({ onClose }: SharedQuizManagerProps) {
  const [sharedQuizzes, setSharedQuizzes] = useState<SharedQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<SharedQuiz | null>(null);

  useEffect(() => {
    setSharedQuizzes(getSharedQuizzes());
  }, []);

  const toggleQuizStatus = (quiz: SharedQuiz) => {
    const updatedQuiz = { ...quiz, isActive: !quiz.isActive };
    saveSharedQuiz(updatedQuiz);
    setSharedQuizzes(getSharedQuizzes());
  };

  const deleteQuiz = (quizId: string) => {
    if (confirm('Are you sure you want to delete this shared quiz? This action cannot be undone.')) {
      const updatedQuizzes = sharedQuizzes.filter(q => q.id !== quizId);
      localStorage.setItem('shared-quizzes', JSON.stringify(updatedQuizzes));
      setSharedQuizzes(updatedQuizzes);
    }
  };

  const copyLink = (quizId: string) => {
    const link = `${window.location.origin}?quiz=${quizId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuizStats = (quiz: SharedQuiz) => {
    const attempts = quiz.attempts;
    const avgScore = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0;
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
    
    return { attempts: attempts.length, avgScore, bestScore };
  };

  if (selectedQuiz) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors mb-2"
              >
                ← Back to Shared Quizzes
              </button>
              <h1 className="text-3xl font-bold text-white">{selectedQuiz.title}</h1>
              <p className="text-gray-400">Detailed Results & Analytics</p>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>

          {/* Quiz Info */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{selectedQuiz.questions.length}</div>
                <div className="text-sm text-gray-400">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{selectedQuiz.attempts.length}</div>
                <div className="text-sm text-gray-400">Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {getQuizStats(selectedQuiz).avgScore}%
                </div>
                <div className="text-sm text-gray-400">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">
                  {getQuizStats(selectedQuiz).bestScore}%
                </div>
                <div className="text-sm text-gray-400">Best Score</div>
              </div>
            </div>
          </div>

          {/* Attempts List */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">All Attempts</h2>
            
            {selectedQuiz.attempts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Attempts Yet</h3>
                <p className="text-gray-400">Share your quiz link to start collecting responses!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedQuiz.attempts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((attempt) => (
                    <div key={attempt.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white mb-1">
                            {attempt.participantName || 'Anonymous'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(attempt.date)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold mb-1 ${
                            attempt.score >= 80 ? 'text-green-400' :
                            attempt.score >= 60 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {attempt.score}%
                          </div>
                          <div className="text-sm text-gray-400">
                            {attempt.answers.filter(a => a.isCorrect).length}/{attempt.totalQuestions} correct
                          </div>
                        </div>
                      </div>
                      
                      {/* Show partial credit details */}
                      {attempt.answers.some(a => a.partialScore !== undefined && a.partialScore > 0 && a.partialScore < 1) && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <p className="text-sm text-blue-300 mb-2">Partial Credit Earned:</p>
                          <div className="space-y-1">
                            {attempt.answers
                              .filter(a => a.partialScore !== undefined && a.partialScore > 0 && a.partialScore < 1)
                              .map((answer, idx) => (
                                <div key={idx} className="text-xs text-gray-400">
                                  <span className="text-blue-300">{Math.round(answer.partialScore! * 100)}%</span> - 
                                  Matched {answer.matchedWords?.length || 0}/{answer.totalWords || 0} words
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Shared Quiz Manager</h1>
            <p className="text-gray-400">Manage your shared quizzes and view participant results</p>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>

        {sharedQuizzes.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Shared Quizzes</h3>
            <p className="text-gray-400">Create and share your first quiz to see it here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sharedQuizzes.map((quiz) => {
              const stats = getQuizStats(quiz);
              const isExpired = quiz.expiresAt && new Date() > new Date(quiz.expiresAt);
              
              return (
                <div key={quiz.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{quiz.title}</h3>
                      <p className="text-gray-400 text-sm">Created {formatDate(quiz.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {quiz.isActive && !isExpired ? (
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {isExpired ? 'Expired' : 'Inactive'}
                        </span>
                      )}
                    </div>
                  </div>

                  {quiz.description && (
                    <p className="text-gray-300 text-sm mb-4">{quiz.description}</p>
                  )}

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{quiz.questions.length}</div>
                      <div className="text-xs text-gray-400">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.attempts}</div>
                      <div className="text-xs text-gray-400">Attempts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.avgScore}%</div>
                      <div className="text-xs text-gray-400">Avg Score</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyLink(quiz.id)}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </button>
                      <button
                        onClick={() => setSelectedQuiz(quiz)}
                        className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        <BarChart3 className="w-3 h-3" />
                        <span>View Results</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleQuizStatus(quiz)}
                        className={`p-2 rounded transition-colors ${
                          quiz.isActive 
                            ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }`}
                        title={quiz.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {quiz.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}