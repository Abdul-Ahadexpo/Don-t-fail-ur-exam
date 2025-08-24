import React from 'react';
import { X, Play, Plus, BookOpen, BarChart3, Settings, Upload, Download, Clock, CheckCircle } from 'lucide-react';

interface HowToUseProps {
  onClose: () => void;
}

export function HowToUse({ onClose }: HowToUseProps) {
  const features = [
    {
      icon: <Plus className="w-6 h-6 text-green-400" />,
      title: "Add Questions",
      description: "Create multiple choice, true/false, or short answer questions with optional explanations."
    },
    {
      icon: <Play className="w-6 h-6 text-blue-400" />,
      title: "Take Quizzes",
      description: "Answer questions one by one in random order. Set optional time limits for extra challenge."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-purple-400" />,
      title: "Review Mode",
      description: "Study all questions with their correct answers at your own pace."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
      title: "Track Progress",
      description: "View your quiz history, best scores, and improvement over time."
    },
    {
      icon: <Upload className="w-6 h-6 text-cyan-400" />,
      title: "Import/Export",
      description: "Share question sets with others or backup your questions as JSON files."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Add Your First Questions",
      description: "Click 'Manage Questions' → 'Add Question' to create your quiz content."
    },
    {
      number: "2",
      title: "Configure Quiz Settings",
      description: "Set time limits and question randomization preferences on the home page."
    },
    {
      number: "3",
      title: "Start Taking Quizzes",
      description: "Click 'Start Quiz' to begin. Answer questions and get instant feedback."
    },
    {
      number: "4",
      title: "Review and Improve",
      description: "Use Review Mode to study and track your progress over time."
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 rounded-full p-2">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">How to Use Quiz Platform</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Quick Start Steps */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Start Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  {feature.icon}
                  <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Question Types</h3>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <h4 className="text-lg font-semibold text-white">Multiple Choice</h4>
              </div>
              <p className="text-gray-300 mb-3">Create questions with 4 answer options. Perfect for testing specific knowledge.</p>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <p className="text-white font-medium mb-2">Example: What is the capital of France?</p>
                <div className="space-y-1 text-gray-300">
                  <p>A) London</p>
                  <p>B) Berlin</p>
                  <p className="text-green-400 font-medium">C) Paris ✓</p>
                  <p>D) Madrid</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h4 className="text-lg font-semibold text-white">True/False</h4>
              </div>
              <p className="text-gray-300 mb-3">Simple yes/no questions for quick assessments.</p>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <p className="text-white font-medium mb-2">Example: The Earth is flat.</p>
                <div className="space-y-1 text-gray-300">
                  <p className="text-green-400 font-medium">False ✓</p>
                  <p>True</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                <h4 className="text-lg font-semibold text-white">Short Answer</h4>
              </div>
              <p className="text-gray-300 mb-3">Text input questions for open-ended responses.</p>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <p className="text-white font-medium mb-2">Example: What is the largest planet in our solar system?</p>
                <div className="text-gray-300">
                  <p className="text-green-400 font-medium">Answer: Jupiter</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Pro Tips</h3>
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
            <div className="space-y-3 text-gray-300">
              <p>• Add explanations to your questions to help with learning</p>
              <p>• Use the timer feature to simulate exam conditions</p>
              <p>• Export your questions to share with classmates or backup</p>
              <p>• Review Mode is perfect for studying before exams</p>
              <p>• Track your progress to see improvement over time</p>
              <p>• Questions are automatically shuffled for each quiz attempt</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Got it, let's start!
          </button>
        </div>
      </div>
    </div>
  );
}