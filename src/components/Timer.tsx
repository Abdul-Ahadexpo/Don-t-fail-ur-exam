import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
}

export function Timer({ timeRemaining, totalTime, isActive }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / totalTime) * 100;

  const getColorClass = () => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
      <Clock className={`w-5 h-5 ${getColorClass()}`} />
      <span className={`font-mono text-lg font-semibold ${getColorClass()}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      {!isActive && (
        <span className="text-sm text-gray-400 ml-2">(Paused)</span>
      )}
    </div>
  );
}