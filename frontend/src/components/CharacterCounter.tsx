import React, { memo, useMemo } from 'react';

interface CharacterCounterProps {
  current: number;
  max: number;
  showWarning?: boolean;
  warningThreshold?: number;
}

/**
 * CharacterCounter Component
 * Displays input character count with visual feedback when approaching limit.
 * Memoized to prevent unnecessary re-renders.
 */
export const CharacterCounter = memo(function CharacterCounter({
  current,
  max,
  showWarning = true,
  warningThreshold = 0.8,
}: CharacterCounterProps) {
  const percentage = useMemo(() => (current / max) * 100, [current, max]);
  const isWarning = showWarning && percentage >= (warningThreshold * 100);
  const isFull = percentage >= 100;

  const progressColor = useMemo(() => {
    if (isFull) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-green-500';
  }, [isFull, isWarning]);

  const textColor = useMemo(() => {
    if (isFull) return 'text-red-600';
    if (isWarning) return 'text-yellow-600';
    return 'text-gray-500';
  }, [isFull, isWarning]);

  return (
    <div className="flex items-center gap-2 mt-1">
      {/* Progress bar */}
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-200 ${progressColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`Character count: ${current} of ${max}`}
        />
      </div>

      {/* Character count text */}
      <span
        className={`text-xs font-medium whitespace-nowrap ${textColor}`}
        aria-hidden="true"
      >
        {current}/{max}
      </span>
    </div>
  );
});

export default CharacterCounter;
