"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for debouncing values.
 * @param value - The value to debounce.
 * @param delay - The debounce delay in milliseconds.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing callbacks.
 * @param callback - The callback to debounce.
 * @param delay - The debounce delay in milliseconds.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Custom hook for previous value tracking.
 * @param value - The value to track.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Custom hook for toggle state.
 * @param initialValue - Initial toggle state.
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const set = useCallback((newValue: boolean) => setValue(newValue), []);
  
  return [value, toggle, set];
}

/**
 * Custom hook for local storage state.
 * @param key - The localStorage key.
 * @param initialValue - Initial value if not in storage.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Custom hook for clipboard operations.
 */
export function useClipboard(): {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
} {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setCopied(false);
      return false;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy };
}

/**
 * Custom hook for async operations with loading/error states.
 */
export function useAsync<T, E = Error>() {
  const [state, setState] = useState<{
    loading: boolean;
    data: T | null;
    error: E | null;
  }>({
    loading: false,
    data: null,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ loading: true, data: null, error: null });
    try {
      const data = await asyncFunction();
      setState({ loading: false, data, error: null });
      return data;
    } catch (error) {
      setState({ loading: false, data: null, error: error as E });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, data: null, error: null });
  }, []);

  return { ...state, execute, reset };
}

/**
 * Custom hook for mounting state.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}
/**
 * Custom hook for form validation with error tracking.
 * Provides a reusable validation pattern across forms.
 * @param initialState - Initial field values
 * @param validators - Map of field names to validation functions
 */
export function useFormValidation<T extends Record<string, any>>(
  initialState: T,
  validators: Record<keyof T, (value: any) => { valid: boolean; error?: string }>
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback((field: keyof T) => {
    const validator = validators[field];
    if (!validator) return true;

    const result = validator(values[field]);
    if (result.valid) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    } else {
      setErrors((prev) => ({ ...prev, [field]: result.error }));
    }
    return result.valid;
  }, [values, validators]);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validators).forEach((field) => {
      const result = validators[field as keyof T](values[field as keyof T]);
      if (!result.valid) {
        newErrors[field as keyof T] = result.error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validators]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field);
  }, [validate]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validate,
    validateAll,
    reset,
  };
}