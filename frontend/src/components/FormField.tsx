import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
}

/**
 * FormField Component
 * Wrapper component for form fields with consistent styling, error handling, and help text.
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helpText,
  required = false,
  children,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input field slot */}
      <div className="relative">{children}</div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 mt-1 p-2 bg-red-50 rounded">
          <span className="text-red-500 font-medium text-sm mt-0.5">⚠</span>
          <p className="text-red-600 text-xs flex-1">{error}</p>
        </div>
      )}

      {/* Help text */}
      {helpText && !error && (
        <p className="text-xs text-gray-500 leading-relaxed">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;
