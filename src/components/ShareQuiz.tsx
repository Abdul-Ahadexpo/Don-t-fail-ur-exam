import React, { useState } from 'react';
import { Question, SharedQuiz } from '../types/quiz';
import { createSharedQuiz, generateShareableLink, saveSharedQuiz } from '../utils/shareUtils';
import { X, Share2, Copy, Clock, Users, Settings, Eye, RefreshCw } from 'lucide-react';

interface ShareQuizProps {
  questions: Question[];
  onClose: () => void;
  onQuizShared: (sharedQuiz: SharedQuiz) => void;
}

export function ShareQuiz({ questions, onClose, onQuizShared }: ShareQuizProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creatorName: '',
    timeLimit: 0,
    randomOrder: true,
    allowRetakes: true,
    showResults: true,
    collectNames: true,
    expirationDays: 7
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createdQuiz, setCreatedQuiz] = useState<SharedQuiz | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.creatorName.trim()) {
      alert('Please fill in the title and your name.');
      return;
    }

    setIsCreating(true);
    
    try {
      const sharedQuiz = createSharedQuiz(
        questions,
        formData.title,
        formData.creatorName,
        {
          timeLimit: formData.timeLimit || undefined,
          randomOrder: formData.randomOrder,
          allowRetakes: formData.allowRetakes,
          showResults: formData.showResults,
          collectNames: formData.collectNames
        },
        formData.description,
        formData.expirationDays
      );

      saveSharedQuiz(sharedQuiz);
      setCreatedQuiz(sharedQuiz);
      onQuizShared(sharedQuiz);
    } catch (error) {
      alert('Error creating shared quiz. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = () => {
    if (createdQuiz) {
      const link = generateShareableLink(createdQuiz.id);
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    }
  };

  const shareNative = () => {
    if (createdQuiz && navigator.share) {
      navigator.share({
        title: createdQuiz.title,
        text: `Take this quiz: ${createdQuiz.title}`,
        url: generateShareableLink(createdQuiz.id)
      });
    }
  };

  if (createdQuiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Shared Successfully!</h2>
            <p className="text-gray-300">Your quiz is now live and ready to be shared</p>
          </div>

          <div className="bg-gray-700 rounded-xl p-6 mb-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">{createdQuiz.title}</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Questions:</strong> {createdQuiz.questions.length}</p>
              <p><strong>Created by:</strong> {createdQuiz.createdBy}</p>
              <p><strong>Expires:</strong> {createdQuiz.expiresAt ? new Date(createdQuiz.expiresAt).toLocaleDateString() : 'Never'}</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-600">
            <p className="text-sm text-gray-400 mb-2">Share this link:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={generateShareableLink(createdQuiz.id)}
                readOnly
                className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
              />
              <button
                onClick={copyLink}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {navigator.share && (
              <button
                onClick={shareNative}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Share Quiz</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter quiz title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
              <input
                type="text"
                value={formData.creatorName}
                onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="Describe what this quiz is about..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time Limit (minutes, 0 = no limit)
              </label>
              <input
                type="number"
                min="0"
                max="180"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Expires After (days)</label>
              <select
                value={formData.expirationDays}
                onChange={(e) => setFormData({ ...formData, expirationDays: parseInt(e.target.value) })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>1 week</option>
                <option value={14}>2 weeks</option>
                <option value={30}>1 month</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quiz Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <input
                  type="checkbox"
                  checked={formData.randomOrder}
                  onChange={(e) => setFormData({ ...formData, randomOrder: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Randomize question order</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <input
                  type="checkbox"
                  checked={formData.allowRetakes}
                  onChange={(e) => setFormData({ ...formData, allowRetakes: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Allow retakes</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <input
                  type="checkbox"
                  checked={formData.showResults}
                  onChange={(e) => setFormData({ ...formData, showResults: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Show results to participants</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <input
                  type="checkbox"
                  checked={formData.collectNames}
                  onChange={(e) => setFormData({ ...formData, collectNames: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Collect participant names</span>
              </label>
            </div>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-blue-300">Ready to Share</span>
            </div>
            <p className="text-blue-200 text-sm">
              This quiz contains <strong>{questions.length} questions</strong>. 
              Once shared, participants can take the quiz and you'll be able to see their results.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  <span>Create & Share</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}