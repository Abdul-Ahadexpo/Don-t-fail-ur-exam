import { useState, useEffect, useRef } from 'react';

export function useTimer(initialTime: number, onTimeUp?: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            onTimeUp?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining, onTimeUp]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = (newTime: number = initialTime) => {
    setTimeRemaining(newTime);
    setIsActive(false);
  };

  return {
    timeRemaining,
    isActive,
    start,
    pause,
    reset,
  };
}