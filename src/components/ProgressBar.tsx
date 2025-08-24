import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full bg-gray-700 rounded-full h-3 ${className}`}>
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="mt-2 text-sm text-gray-400 text-center">
        Question {current} of {total}
      </div>
    </div>
  );
}