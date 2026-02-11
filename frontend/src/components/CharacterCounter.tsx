import React from 'react';

interface CharacterCounterProps {
  current: number;
  max: number;
  showWarning?: boolean;
  warningThreshold?: number;
}

/**
 * CharacterCounter Component
 * Displays input character count with visual feedback when approaching limit.
 */
export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  current,
  max,
  showWarning = true,
  warningThreshold = 0.8,
}) => {
  const percentage = (current / max) * 100;
  const isWarning = showWarning && percentage >= (warningThreshold * 100);
  const isFull = percentage >= 100;

  return (
    <div className="flex items-center gap-2 mt-1">
      {/* Progress bar */}
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-200 ${
            isFull
              ? 'bg-red-500'
              : isWarning
                ? 'bg-yellow-500'
                : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Character count text */}
      <span
        className={`text-xs font-medium whitespace-nowrap ${
          isFull
            ? 'text-red-600'
            : isWarning
              ? 'text-yellow-600'
              : 'text-gray-500'
        }`}
      >
        {current}/{max}
      </span>
    </div>
  );
};

export default CharacterCounter;
