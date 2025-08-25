import React, { useState } from 'react';
import { SharedQuiz } from './types/quiz';
import { Question, QuizAttempt } from './types/quiz';
import { Quiz } from './components/Quiz';
import { QuestionManager } from './components/QuestionManager';
import { ProgressTracker } from './components/ProgressTracker';
import { ReviewMode } from './components/ReviewMode';
import { Results } from './components/Results';
import { Tutorial } from './components/Tutorial';
import { HowToUse } from './components/HowToUse';
import { EmptyState } from './components/EmptyState';
import { ShareQuiz } from './components/ShareQuiz';
import { SharedQuizTaker } from './components/SharedQuizTaker';
import { SharedQuizManager } from './components/SharedQuizManager';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sampleQuestions } from './data/sampleQuestions';
import { getSharedQuiz } from './utils/shareUtils';
import { BookOpen, Play, Settings, BarChart3, Clock, HelpCircle, GraduationCap, Share2, Users } from 'lucide-react';

type AppMode = 'home' | 'quiz' | 'results' | 'review' | 'manage' | 'progress' | 'shared-quiz' | 'shared-manager';

function App() {
  // Check for shared quiz in URL
  const urlParams = new URLSearchParams(window.location.search);
  const sharedQuizId = urlParams.get('quiz');
  const [sharedQuiz, setSharedQuiz] = useState<SharedQuiz | null>(
    sharedQuizId ? getSharedQuiz(sharedQuizId) : null
  );
  
  const [questions, setQuestions] = useLocalStorage<Question[]>('quiz-questions', sampleQuestions);
  const [attempts, setAttempts] = useLocalStorage<QuizAttempt[]>('quiz-attempts', []);
  const [currentMode, setCurrentMode] = useState<AppMode>('home');
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showShareQuiz, setShowShareQuiz] = useState(false);
  const [quizSettings, setQuizSettings] = useState({
    timeLimit: 0, // 0 means no time limit
    randomOrder: true,
  });

  const handleStartQuiz = () => {
    setCurrentMode('quiz');
  };

  const handleCompleteQuiz = (attempt: QuizAttempt) => {
    setAttempts([...attempts, attempt]);
    setCurrentAttempt(attempt);
    setCurrentMode('results');
  };

  const handleRetakeQuiz = () => {
    setCurrentMode('quiz');
  };

  const handleReviewMode = () => {
    setCurrentMode('review');
  };

  const handleShareQuiz = () => {
    if (questions.length === 0) {
      alert('Please add some questions before sharing a quiz.');
      return;
    }
    setShowShareQuiz(true);
  };

  const handleQuizShared = (newSharedQuiz: SharedQuiz) => {
    setShowShareQuiz(false);
    // Optionally redirect to shared quiz manager
  };

  const handleSharedQuizComplete = () => {
    // Clear URL and return to home
    window.history.replaceState({}, document.title, window.location.pathname);
    setSharedQuiz(null);
    setCurrentMode('home');
  };

  const renderContent = () => {
    // Handle shared quiz taking
    if (currentMode === 'shared-quiz' && sharedQuiz) {
      if (!sharedQuiz.isActive) {
        return (
          <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Quiz Not Available</h1>
                <p className="text-gray-300 mb-6">
                  This quiz is no longer active or has expired.
                </p>
                <button
                  onClick={handleSharedQuizComplete}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <SharedQuizTaker 
          sharedQuiz={sharedQuiz} 
          onComplete={handleSharedQuizComplete}
        />
      );
    }

    switch (currentMode) {
      case 'quiz':
        return (
          <Quiz
            questions={questions}
            onComplete={handleCompleteQuiz}
            timeLimit={quizSettings.timeLimit || undefined}
          />
        );
      case 'results':
        return currentAttempt ? (
          <Results
            score={currentAttempt.score}
            answers={currentAttempt.answers}
            totalQuestions={currentAttempt.totalQuestions}
            onRetake={handleRetakeQuiz}
            onReview={handleReviewMode}
          />
        ) : null;
      case 'review':
        return (
          <ReviewMode
            questions={questions}
            onExit={() => setCurrentMode('home')}
          />
        );
      case 'manage':
        return (
          <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => setCurrentMode('home')}
                className="mb-6 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                ← Back to Home
              </button>
              <QuestionManager
                questions={questions}
                onQuestionsChange={setQuestions}
              />
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Progress Tracker</h1>
                <button
                  onClick={() => setCurrentMode('home')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Back to Home
                </button>
              </div>
              <ProgressTracker attempts={attempts} />
            </div>
          </div>
        );
      case 'shared-manager':
        return (
          <SharedQuizManager
            onClose={() => setCurrentMode('home')}
          />
        );
      default:
        // Show empty state if no questions exist
        if (questions.length === 0) {
          return (
            <EmptyState
              onAddQuestion={() => setCurrentMode('manage')}
              onShowTutorial={() => setShowTutorial(true)}
            />
          );
        }

        return (
          <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12 relative">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Doro Quiz 
                </h1>
                <p className="text-xl text-gray-400">
                  Test your knowledge with interactive quizzes
                </p>
                
                {/* Help Buttons */}
                <div className="absolute top-0 right-0 flex space-x-2">
                  <button
                    onClick={() => setShowHowToUse(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 group"
                    title="How to Use"
                  >
                    <HelpCircle className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                  </button>
                  <button
                    onClick={() => setShowTutorial(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 group"
                    title="Tutorial"
                  >
                    <GraduationCap className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Quiz Settings */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Quiz Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time Limit (minutes, 0 = no limit)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={quizSettings.timeLimit}
                      onChange={(e) => setQuizSettings({
                        ...quizSettings,
                        timeLimit: parseInt(e.target.value) || 0
                      })}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="randomOrder"
                      checked={quizSettings.randomOrder}
                      onChange={(e) => setQuizSettings({
                        ...quizSettings,
                        randomOrder: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="randomOrder" className="ml-2 text-sm text-gray-300">
                      Randomize question order
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <button
                  onClick={handleStartQuiz}
                  disabled={questions.length === 0}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-6 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Play className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Start Quiz</h3>
                  <p className="text-sm text-gray-400">{questions.length} questions available</p>
                </button>

                <button
                  onClick={() => setCurrentMode('review')}
                  disabled={questions.length === 0}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-6 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <BookOpen className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Review Mode</h3>
                  <p className="text-sm text-gray-400">Study questions with answers</p>
                </button>

                <button
                  onClick={() => setCurrentMode('progress')}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-6 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
                >
                  <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Progress</h3>
                  <p className="text-sm text-gray-400">{attempts.length} attempts recorded</p>
                </button>

                <button
                  onClick={() => setCurrentMode('manage')}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-6 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
                >
                  <Settings className="w-8 h-8 text-amber-600 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Manage</h3>
                  <p className="text-sm text-gray-400">Add, edit, or import questions</p>
                </button>

                <button
                  onClick={handleShareQuiz}
                  disabled={questions.length === 0}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-6 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Share2 className="w-8 h-8 text-cyan-600 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Share Quiz</h3>
                  <p className="text-sm text-gray-400">Create shareable quiz links</p>
                </button>

                <button
                  onClick={() => setCurrentMode('shared-manager')}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-6 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
                >
                  <Users className="w-8 h-8 text-indigo-600 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Shared Quizzes</h3>
                  <p className="text-sm text-gray-400">Manage shared quiz results</p>
                </button>
              </div>

              {/* Recent Stats */}
              {attempts.length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.max(...attempts.map(a => a.score), 0)}%
                      </div>
                      <div className="text-sm text-blue-400">Best Score</div>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)}%
                      </div>
                      <div className="text-sm text-green-400">Average Score</div>
                    </div>
                    <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {attempts.length}
                      </div>
                      <div className="text-sm text-purple-400">Total Attempts</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      {showHowToUse && <HowToUse onClose={() => setShowHowToUse(false)} />}
      {showShareQuiz && (
        <ShareQuiz
          questions={questions}
          onClose={() => setShowShareQuiz(false)}
          onQuizShared={handleQuizShared}
        />
      )}
    </>
  );
}

export default App;
