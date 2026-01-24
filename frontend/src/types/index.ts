/**
 * StackHub Type Definitions
 * Shared TypeScript interfaces for the platform.
 */

// ============================================
// NFT MARKETPLACE TYPES
// ============================================

export interface NFT {
  id: number;
  owner: string;
  uri: string;
  createdAt: number;
}

export interface NFTListing {
  tokenId: number;
  seller: string;
  price: number;  // in micro-STX
  listedAt: number;
  active: boolean;
}

export interface NFTSale {
  tokenId: number;
  seller: string;
  buyer: string;
  price: number;
  fee: number;
  timestamp: number;
  txId: string;
}

// ============================================
// TOKEN LAUNCHPAD TYPES
// ============================================

export interface Token {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  creator: string;
  createdAt: number;
  contractId?: string;
}

export interface TokenHolder {
  address: string;
  balance: number;
  percentage: number;
}

// ============================================
// STAKING VAULT TYPES
// ============================================

export interface StakeInfo {
  staker: string;
  amount: number;  // in micro-STX
  stakedAt: number;
  lockUntil: number;
  pendingRewards: number;
}

export interface UnstakeRequest {
  staker: string;
  amount: number;
  requestedAt: number;
  availableAt: number;
  status: 'pending' | 'ready' | 'completed';
}

export interface StakingStats {
  totalStaked: number;
  totalStakers: number;
  currentAPY: number;
  rewardsDistributed: number;
}

// ============================================
// SERVICE REGISTRY TYPES
// ============================================

export interface Service {
  id: number;
  title: string;
  provider: string;
  price: number;  // in micro-STX
  active: boolean;
  createdAt: number;
  totalSales: number;
  rating?: number;
}

export interface ServicePayment {
  serviceId: number;
  payer: string;
  provider: string;
  amount: number;
  fee: number;
  timestamp: number;
  txId: string;
}

// ============================================
// WALLET & TRANSACTION TYPES
// ============================================

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  network: 'mainnet' | 'testnet';
}

export interface TransactionResult {
  success: boolean;
  txId?: string;
  error?: string;
  blockHeight?: number;
}

export type TransactionStatus = 
  | 'pending'
  | 'success'
  | 'failed'
  | 'dropped';

export interface TransactionInfo {
  txId: string;
  type: string;
  status: TransactionStatus;
  sender: string;
  blockHeight?: number;
  timestamp?: number;
}

// ============================================
// UI & FORM TYPES
// ============================================

export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface SortParams<T = string> {
  field: T;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: number;
  dateTo?: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
