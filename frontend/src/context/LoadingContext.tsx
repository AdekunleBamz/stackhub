"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Loading State Types
 */
export type LoadingOperation = 
  | 'mint-nft'
  | 'list-nft'
  | 'buy-nft'
  | 'create-token'
  | 'stake'
  | 'unstake'
  | 'register-service'
  | 'pay-service'
  | 'connect-wallet';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  isLoading: (operation: LoadingOperation) => boolean;
  isAnyLoading: () => boolean;
  startLoading: (operation: LoadingOperation) => void;
  stopLoading: (operation: LoadingOperation) => void;
  withLoading: <T>(operation: LoadingOperation, fn: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Loading Provider Component
 * Manages loading states for all async operations.
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const isLoading = useCallback((operation: LoadingOperation): boolean => {
    return loadingStates[operation] ?? false;
  }, [loadingStates]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const startLoading = useCallback((operation: LoadingOperation) => {
    setLoadingStates(prev => ({ ...prev, [operation]: true }));
  }, []);

  const stopLoading = useCallback((operation: LoadingOperation) => {
    setLoadingStates(prev => ({ ...prev, [operation]: false }));
  }, []);

  /**
   * Wrapper function to automatically manage loading state.
   */
  const withLoading = useCallback(async <T,>(
    operation: LoadingOperation,
    fn: () => Promise<T>
  ): Promise<T> => {
    startLoading(operation);
    try {
      return await fn();
    } finally {
      stopLoading(operation);
    }
  }, [startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={{
      isLoading,
      isAnyLoading,
      startLoading,
      stopLoading,
      withLoading,
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Hook to access loading state management.
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
