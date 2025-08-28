import React from 'react';
import { Plus, BookOpen, Upload } from 'lucide-react';

interface EmptyStateProps {
  onAddQuestion: () => void;
  onShowTutorial: () => void;
}

export function EmptyState({ onAddQuestion, onShowTutorial }: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <BookOpen className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Quiz Platform
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Get started by adding your first questions or take the tutorial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={onAddQuestion}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl p-8 text-center transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Add Questions</h3>
            <p className="text-gray-400">Create your first quiz questions to get started</p>
          </button>

          <button
            onClick={onShowTutorial}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl p-8 text-center transition-all duration-200 transform hover:scale-105"
          >
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Take Tutorial</h3>
            <p className="text-gray-400">Learn how to use all the platform features</p>
          </button>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center opacity-75">
            <Eye className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Flashcard Mode</h3>
            <p className="text-gray-400">Study with flipping cards (add questions first)</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">What you can do:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="space-y-2">
              <p>• Create multiple choice questions</p>
              <p>• Add true/false questions</p>
              <p>• Include short answer questions</p>
              <p>• Set optional time limits</p>
            </div>
            <div className="space-y-2">
              <p>• Track your quiz progress</p>
              <p>• Study in review mode</p>
              <p>• Import/export question sets</p>
              <p>• Get detailed feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}