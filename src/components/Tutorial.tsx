import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, BookOpen, Settings, BarChart3, Plus, Upload, Download, Clock } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to Quiz Platform",
    content: "This tutorial will guide you through all the features of our quiz platform. Let's get started!",
    icon: <Play className="w-12 h-12 text-blue-400" />
  },
  {
    title: "Adding Questions",
    content: "First, you'll need to add questions. Click the 'Manage' button on the home page, then use the 'Add Question' button. You can create multiple choice, true/false, or short answer questions.",
    icon: <Plus className="w-12 h-12 text-green-400" />
  },
  {
    title: "Question Types",
    content: "• Multiple Choice: Create questions with 4 options\n• True/False: Simple yes/no questions\n• Short Answer: Text input questions\n\nEach question can have an optional explanation that appears after answering.",
    icon: <Settings className="w-12 h-12 text-purple-400" />
  },
  {
    title: "Taking a Quiz",
    content: "Once you have questions, click 'Start Quiz' from the home page. Questions are shown one at a time in random order. Answer each question and click 'Next' to continue.",
    icon: <Play className="w-12 h-12 text-blue-400" />
  },
  {
    title: "Quiz Settings",
    content: "Before starting a quiz, you can:\n• Set a time limit (optional)\n• Enable/disable random question order\n• The timer will count down and automatically submit when time runs out",
    icon: <Clock className="w-12 h-12 text-amber-400" />
  },
  {
    title: "Results & Feedback",
    content: "After completing a quiz, you'll see:\n• Your score as a percentage\n• Number of correct vs total questions\n• Review of incorrect answers with explanations\n• Options to retake or review",
    icon: <BarChart3 className="w-12 h-12 text-indigo-400" />
  },
  {
    title: "Review Mode",
    content: "Use Review Mode to study all questions with their correct answers. This is perfect for learning and preparation. Navigate through questions at your own pace.",
    icon: <BookOpen className="w-12 h-12 text-green-400" />
  },
  {
    title: "Progress Tracking",
    content: "The Progress Tracker saves all your quiz attempts locally. View your best score, average performance, and recent attempts. Track your improvement over time!",
    icon: <BarChart3 className="w-12 h-12 text-purple-400" />
  },
  {
    title: "Import & Export",
    content: "Share question sets easily:\n• Export: Download your questions as a JSON file\n• Import: Upload question files from others\n• Perfect for teachers sharing with students or collaborative studying",
    icon: <Upload className="w-12 h-12 text-cyan-400" />
  },
  {
    title: "Ready to Start!",
    content: "You're all set! Start by adding some questions in the Question Manager, then take your first quiz. Remember, all your progress is saved locally in your browser.",
    icon: <Play className="w-12 h-12 text-green-400" />
  }
];

export function Tutorial({ onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Tutorial</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
            <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {currentStepData.icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {currentStepData.title}
          </h3>
          <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
            {currentStepData.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            <span>{currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}