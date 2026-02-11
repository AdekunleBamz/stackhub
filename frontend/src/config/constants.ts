/**
 * StackHub Constants
 * Centralized configuration values for the platform.
 */

// ============================================
// STACKS NETWORK CONFIGURATION
// ============================================

export const STACKS_NETWORK = {
  MAINNET: {
    name: 'mainnet',
    url: 'https://api.hiro.so',
    explorerUrl: 'https://explorer.stacks.co',
  },
  TESTNET: {
    name: 'testnet', 
    url: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.stacks.co/?chain=testnet',
  },
} as const;

// Current active network
export const ACTIVE_NETWORK = STACKS_NETWORK.MAINNET;

// ============================================
// DEPLOYER ADDRESS
// ============================================

export const DEPLOYER_ADDRESS = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N';

// ============================================
// CONTRACT NAMES
// ============================================

export const CONTRACT_NAMES = {
  NFT_MARKETPLACE: 'stackhub-nft-marketplace-v2q',
  TOKEN_LAUNCHPAD: 'stackhub-token-launchpad-v2q',
  STAKING_VAULT: 'stackhub-staking-vault-v2q',
  SERVICE_REGISTRY: 'stackhub-service-registry-v2q',
} as const;

// ============================================
// FULL CONTRACT PRINCIPALS
// ============================================

export const CONTRACTS = {
  NFT_MARKETPLACE: `${DEPLOYER_ADDRESS}.${CONTRACT_NAMES.NFT_MARKETPLACE}`,
  TOKEN_LAUNCHPAD: `${DEPLOYER_ADDRESS}.${CONTRACT_NAMES.TOKEN_LAUNCHPAD}`,
  STAKING_VAULT: `${DEPLOYER_ADDRESS}.${CONTRACT_NAMES.STAKING_VAULT}`,
  SERVICE_REGISTRY: `${DEPLOYER_ADDRESS}.${CONTRACT_NAMES.SERVICE_REGISTRY}`,
} as const;

// ============================================
// CONVERSION CONSTANTS
// ============================================

/** 1 STX = 1,000,000 micro-STX */
export const MICROSTX_PER_STX = 1_000_000;

/** Convert STX to micro-STX */
export const toMicroSTX = (stx: number): number => Math.floor(stx * MICROSTX_PER_STX);

/** Convert micro-STX to STX */
export const fromMicroSTX = (microStx: number): number => microStx / MICROSTX_PER_STX;

// ============================================
// PLATFORM FEES (in percentages and micro-STX)
// ============================================

export const PLATFORM_FEES = {
  // Percentage-based fees
  NFT_SALE_PERCENTAGE: 1.25,      // 1.25% of sale price
  STAKING_WITHDRAW_PERCENTAGE: 0.5, // 0.5% withdrawal fee
  STAKING_EARLY_PERCENTAGE: 2.5,  // 2.5% early withdrawal penalty
  SERVICE_TX_PERCENTAGE: 1.5,     // 1.5% service transaction fee

  // Fixed fees in micro-STX
  TOKEN_CREATION_FEE: 5_000_000,   // 5 STX
  SERVICE_LISTING_FEE: 2_500_000,  // 2.5 STX
} as const;

// ============================================
// STAKING CONFIGURATION
// ============================================

export const STAKING_CONFIG = {
  MIN_STAKE_AMOUNT: 1_000_000,    // 1 STX minimum
  LOCK_PERIOD_BLOCKS: 2100,       // ~14.5 days (assuming 10 min blocks)
  APY_BASE_RATE: 5,               // 5% base APY
} as const;

// ============================================
// NFT MARKETPLACE LIMITS
// ============================================

export const NFT_LIMITS = {
  MAX_URI_LENGTH: 256,
  MIN_LISTING_PRICE: 1000,        // 0.001 STX
  MAX_ROYALTY_PERCENTAGE: 10,     // 10% max royalty
} as const;

// ============================================
// TOKEN LAUNCHPAD LIMITS
// ============================================

export const TOKEN_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 32,
  SYMBOL_MIN_LENGTH: 2,
  SYMBOL_MAX_LENGTH: 5,
  MAX_DECIMALS: 18,
  MAX_SUPPLY: Number.MAX_SAFE_INTEGER,
} as const;

// ============================================
// SERVICE REGISTRY LIMITS
// ============================================

export const SERVICE_LIMITS = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 64,
  MIN_SERVICE_PRICE: 100_000,     // 0.1 STX
} as const;

// ============================================
// UI CONFIGURATION
// ============================================

export const UI_CONFIG = {
  TOAST_DURATION: 5000,           // 5 seconds
  DEBOUNCE_DELAY: 300,            // 300ms
  PAGINATION_SIZE: 20,
  MAX_RETRIES: 3,
} as const;
