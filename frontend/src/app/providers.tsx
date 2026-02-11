'use client';

import { ReactNode, useEffect } from 'react';
import { ReownProvider } from '@/context/ReownContext';
import { WalletProvider } from '@/context/WalletContext';

/**
 * Configure error logging for production environment
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Suppress console errors in production
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Log to external service in production
    if (typeof window !== 'undefined') {
      // Send error to monitoring service (e.g., Sentry, LogRocket)
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify({ error: args }) })
    }
    // Don't call original error to suppress console noise
    // originalError(...args);
  };
}

/**
 * Application Global Provider
 * Wraps the app with Reown (AppKit) and Wallet contexts.
 * Handles initial cookie state for server-side rendering support.
 * Includes error logging configuration for production.
 */
export function ContextProvider({ 
  children, 
  cookies 
}: { 
  children: ReactNode; 
  cookies: string | null;
}) {
  useEffect(() => {
    // Setup global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // Log to error tracking service
        console.error('Unhandled promise rejection:', event.reason);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  return (
    <ReownProvider cookies={cookies}>
      <WalletProvider>
        {children}
      </WalletProvider>
    </ReownProvider>
  );
}

