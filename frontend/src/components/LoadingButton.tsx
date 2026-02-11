import React from 'react';

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

/**
 * LoadingButton Component
 * Button with built-in loading state management and visual feedback.
 */
export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(
  (
    {
      isLoading = false,
      loadingText = 'Loading...',
      variant = 'primary',
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
      secondary:
        'bg-gradient-to-r from-gray-600 to-slate-600 text-white hover:from-gray-700 hover:to-slate-700',
      success:
        'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700',
      danger:
        'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700',
      warning:
        'bg-gradient-to-r from-orange-600 to-yellow-600 text-white hover:from-orange-700 hover:to-yellow-700',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        <span>{isLoading ? loadingText : children}</span>
      </button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
