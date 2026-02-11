"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Toast types for different notification states
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast message interface
 */
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

/**
 * Toast Context interface
 */
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

/**
 * Default toast duration in milliseconds
 */
const DEFAULT_DURATION = 5000;

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    const duration = toast.duration ?? DEFAULT_DURATION;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 8000 });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast functionality
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/**
 * Toast Container - renders all active toasts
 */
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

/**
 * Individual Toast Item with copy functionality
 */
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  
  const styles: Record<ToastType, { bg: string; icon: string; border: string }> = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      icon: '✓',
      border: 'border-green-200 dark:border-green-800',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      icon: '✕',
      border: 'border-red-200 dark:border-red-800',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      icon: '⚠',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      icon: 'ℹ',
      border: 'border-blue-200 dark:border-blue-800',
    },
  };

  const style = styles[toast.type];

  // Extract TX hash from message if present
  const txIdMatch = toast.message?.match(/Transaction ID:\s*([A-Za-z0-9]+)/);
  const txId = txIdMatch ? txIdMatch[1] : null;

  const handleCopy = async () => {
    if (txId) {
      try {
        await navigator.clipboard.writeText(txId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg p-4 shadow-lg animate-in slide-in-from-right fade-in duration-300`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{style.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {toast.message}
              {txId && (
                <button
                  onClick={handleCopy}
                  className="ml-2 inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-mono text-xs bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded transition-colors cursor-pointer"
                  aria-label={copied ? 'Transaction hash copied to clipboard' : 'Copy transaction hash'}
                >
                  <span className="select-all">{txId.slice(0, 8)}...{txId.slice(-4)}</span>
                  {copied ? (
                    <span aria-hidden="true">✓</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              )}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Transaction toast helpers for blockchain operations
 */
export const transactionToasts = {
  pending: (toast: ReturnType<typeof useToast>) => {
    toast.info('Transaction Pending', 'Your transaction is being processed...');
  },
  success: (toast: ReturnType<typeof useToast>, txId?: string) => {
    toast.success(
      'Transaction Successful',
      txId ? `Transaction ID: ${txId.slice(0, 8)}...` : 'Your transaction has been confirmed.'
    );
  },
  error: (toast: ReturnType<typeof useToast>, message?: string) => {
    toast.error('Transaction Failed', message || 'Please try again.');
  },
};
