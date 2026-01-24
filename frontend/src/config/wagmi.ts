import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, optimism, polygon, base } from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID';

if (!projectId || projectId === 'YOUR_PROJECT_ID') {
  console.warn('Please set NEXT_PUBLIC_REOWN_PROJECT_ID in your environment variables');
}

// Supported networks - explicitly typed as tuple
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, arbitrum, optimism, polygon, base];

/**
 * Wagmi Adapter configuration for Reown AppKit.
 * Configured with cookie storage for SSR compatibility.
 */
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
