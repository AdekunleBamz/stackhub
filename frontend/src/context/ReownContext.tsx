'use client';

import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ReactNode, useState } from 'react';
import { wagmiAdapter, projectId, networks } from '@/config/wagmi';

// Set up metadata
const metadata = {
  name: 'StackHub',
  description: 'DeFi Platform on Stacks - NFT Marketplace, Token Launchpad, Staking & Services',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://stackhub.app',
  icons: ['/logo.png'],
};

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: networks[0],
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'farcaster'],
    emailShowWallets: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#7c3aed',
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#7c3aed',
  },
});

export function ReownProvider({ children }: { children: ReactNode; cookies?: string | null }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
