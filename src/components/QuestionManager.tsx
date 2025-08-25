import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { Plus, Trash2, Edit, Save, X, Upload, Download } from 'lucide-react';

interface QuestionManagerProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

export function QuestionManager({ questions, onQuestionsChange }: QuestionManagerProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      partialCredit: false
    };
    setEditingQuestion(newQuestion);
    setShowAddForm(true);
  };

  const handleSaveQuestion = (question: Question) => {
    if (questions.find(q => q.id === question.id)) {
      // Update existing question
      onQuestionsChange(questions.map(q => q.id === question.id ? question : q));
    } else {
      // Add new question
      onQuestionsChange([...questions, question]);
    }
    setEditingQuestion(null);
    setShowAddForm(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      onQuestionsChange(questions.filter(q => q.id !== id));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-questions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedQuestions = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedQuestions)) {
            onQuestionsChange(importedQuestions);
            alert(`Imported ${importedQuestions.length} questions successfully!`);
          } else {
            alert('Invalid file format. Please upload a valid JSON file.');
          }
        } catch (error) {
          alert('Error reading file. Please make sure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Question Manager</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAddQuestion}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
          <label className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    question.type === 'multiple-choice' 
                      ? 'bg-blue-100 text-blue-800'
                      : question.type === 'true-false'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {question.type}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2">{question.question}</h3>
                {question.type === 'multiple-choice' && question.options && (
                  <ul className="text-sm text-gray-400 ml-4">
                    {question.options.map((option, index) => (
                      <li key={index} className={`${option === question.correctAnswer ? 'font-semibold text-green-400' : ''}`}>
                        {index + 1}. {option}
                      </li>
                    ))}
                  </ul>
                )}
                {question.type !== 'multiple-choice' && (
                  <p className="text-sm text-green-400 font-semibold">Answer: {question.correctAnswer}</p>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setEditingQuestion(question)}
                  className="p-2 text-blue-400 hover:bg-gray-700 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="p-2 text-red-400 hover:bg-gray-700 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Question Modal */}
      {(editingQuestion || showAddForm) && (
        <QuestionForm
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => {
            setEditingQuestion(null);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
}

interface QuestionFormProps {
  question: Question | null;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

function QuestionForm({ question, onSave, onCancel }: QuestionFormProps) {
  const [formData, setFormData] = useState<Question>(
    question || {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      partialCredit: false
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.correctAnswer.trim()) {
      alert('Please fill in the question and correct answer.');
      return;
    }
    onSave(formData);
  };

  const handleTypeChange = (type: Question['type']) => {
    const newFormData = { ...formData, type };
    if (type !== 'multiple-choice') {
      newFormData.options = undefined;
    } else if (!newFormData.options) {
      newFormData.options = ['', '', '', ''];
    }
    setFormData(newFormData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {question ? 'Edit Question' : 'Add Question'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Question Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value as Question['type'])}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Question
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="Enter your question here..."
              required
            />
          </div>

          {formData.type === 'multiple-choice' && formData.options && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Options
              </label>
              {formData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options!];
                    newOptions[index] = e.target.value;
                    setFormData({ ...formData, options: newOptions });
                  }}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white mb-2"
                  placeholder={`Option ${index + 1}`}
                  required
                />
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correct Answer
            </label>
            {formData.type === 'multiple-choice' ? (
              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                required
              >
                <option value="">Select the correct answer</option>
                {formData.options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : formData.type === 'true-false' ? (
              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                required
              >
                <option value="">Select true or false</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <input
                type="text"
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter the correct answer"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Explanation (Optional)
            </label>
            <textarea
              value={formData.explanation || ''}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={2}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="Explain why this is the correct answer..."
            />
          </div>

          {formData.type === 'short-answer' && (
            <div>
              <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <input
                  type="checkbox"
                  checked={formData.partialCredit || false}
                  onChange={(e) => setFormData({ ...formData, partialCredit: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-gray-300 font-medium">Enable Partial Credit</span>
                  <p className="text-gray-400 text-sm">Award points based on word matching (recommended for short answers)</p>
                </div>
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}