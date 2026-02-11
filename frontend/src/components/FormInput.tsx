"use client";

import React, { useState, useRef, useCallback } from 'react';

/**
 * FormInputProps interface
 */
interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password' | 'url';
  placeholder?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  currencySymbol?: string;
  showClearButton?: boolean;
  onClear?: () => void;
  className?: string;
  inputClassName?: string;
  id?: string;
}

/**
 * Enhanced FormInput component with optional currency symbol and clear button
 */
export function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error,
  helpText,
  required = false,
  disabled = false,
  maxLength,
  min,
  max,
  step,
  currencySymbol,
  showClearButton = false,
  onClear,
  className = '',
  inputClassName = '',
  id,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  }, [onChange, onClear]);

  const displayValue = value !== undefined && value !== null ? String(value) : '';

  return (
    <div className={`space-y-1 ${className}`}>
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      
      <div className="relative">
        {currencySymbol && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 font-medium">{currencySymbol}</span>
          </div>
        )}
        
        <input
          ref={inputRef}
          id={inputId}
          type={type}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            [
              error ? errorId : undefined,
              helpText ? helpId : undefined
            ].filter(Boolean).join(' ') || undefined
          }
          aria-required={required}
          className={`
            block w-full px-4 py-2 border rounded-lg transition-colors
            ${currencySymbol ? 'pl-10' : ''}
            ${showClearButton ? 'pr-10' : ''}
            ${
              error 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
            }
            ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            ${inputClassName}
          `}
        />
        
        {/* Clear button */}
        {showClearButton && displayValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear input"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p 
          id={errorId} 
          className="text-red-500 text-xs" 
          role="alert"
        >
          {error}
        </p>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <p 
          id={helpId} 
          className="text-gray-500 dark:text-gray-400 text-xs"
        >
          {helpText}
        </p>
      )}
    </div>
  );
}

/**
 * CurrencyInput component for STX/currency inputs
 */
interface CurrencyInputProps extends Omit<FormInputProps, 'currencySymbol'> {
  currency?: string;
  decimals?: number;
}

export function CurrencyInput({
  currency = 'STX',
  decimals = 6,
  ...props
}: CurrencyInputProps) {
  const formatValue = (val: string) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <FormInput
      {...props}
      type="number"
      step={`0.${'0'.repeat(decimals - 1)}1`}
      currencySymbol={currency}
      showClearButton
      inputClassName="font-mono"
    />
  );
}

/**
 * SearchInput component with search icon
 */
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
