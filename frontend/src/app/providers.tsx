'use client';

import { ReactNode } from 'react';
import { ReownProvider } from '@/context/ReownContext';
import { WalletProvider } from '@/context/WalletContext';

export function ContextProvider({ 
  children, 
  cookies 
}: { 
  children: ReactNode; 
  cookies: string | null;
}) {
  return (
    <ReownProvider cookies={cookies}>
      <WalletProvider>
        {children}
      </WalletProvider>
    </ReownProvider>
  );
}
