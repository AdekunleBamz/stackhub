"use client";

/**
 * Input Validation Utilities
 * Centralized validation functions for contract interactions.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate NFT URI format.
 * @param uri - The metadata URI to validate.
 */
export function validateNFTUri(uri: string): ValidationResult {
  if (!uri || uri.trim() === '') {
    return { valid: false, error: 'URI is required' };
  }
  if (uri.length > 256) {
    return { valid: false, error: 'URI must be 256 characters or less' };
  }
  // Basic IPFS/HTTP validation
  if (!uri.startsWith('ipfs://') && !uri.startsWith('http://') && !uri.startsWith('https://')) {
    return { valid: false, error: 'URI must start with ipfs://, http://, or https://' };
  }
  return { valid: true };
}

/**
 * Validate token ID.
 * @param tokenId - The token ID to validate.
 */
export function validateTokenId(tokenId: number): ValidationResult {
  if (tokenId === undefined || tokenId === null) {
    return { valid: false, error: 'Token ID is required' };
  }
  if (!Number.isInteger(tokenId) || tokenId < 0) {
    return { valid: false, error: 'Token ID must be a non-negative integer' };
  }
  return { valid: true };
}

/**
 * Validate price in micro-STX.
 * @param price - The price to validate.
 * @param minPrice - Minimum allowed price (default: 1000 = 0.001 STX).
 */
export function validatePrice(price: number, minPrice: number = 1000): ValidationResult {
  if (price === undefined || price === null) {
    return { valid: false, error: 'Price is required' };
  }
  if (!Number.isFinite(price) || price < minPrice) {
    return { valid: false, error: `Price must be at least ${minPrice / 1000000} STX` };
  }
  return { valid: true };
}

/**
 * Validate token name for launchpad.
 * @param name - The token name to validate.
 */
export function validateTokenName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Token name is required' };
  }
  if (name.length < 2 || name.length > 32) {
    return { valid: false, error: 'Token name must be 2-32 characters' };
  }
  if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
    return { valid: false, error: 'Token name must be alphanumeric' };
  }
  return { valid: true };
}

/**
 * Validate token symbol.
 * @param symbol - The token symbol to validate.
 */
export function validateTokenSymbol(symbol: string): ValidationResult {
  if (!symbol || symbol.trim() === '') {
    return { valid: false, error: 'Symbol is required' };
  }
  if (symbol.length < 2 || symbol.length > 5) {
    return { valid: false, error: 'Symbol must be 2-5 characters' };
  }
  if (!/^[A-Z]+$/.test(symbol)) {
    return { valid: false, error: 'Symbol must be uppercase letters only' };
  }
  return { valid: true };
}

/**
 * Validate token decimals.
 * @param decimals - The decimal places to validate.
 */
export function validateDecimals(decimals: number): ValidationResult {
  if (decimals === undefined || decimals === null) {
    return { valid: false, error: 'Decimals is required' };
  }
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) {
    return { valid: false, error: 'Decimals must be between 0 and 18' };
  }
  return { valid: true };
}

/**
 * Validate initial token supply.
 * @param supply - The supply to validate.
 */
export function validateSupply(supply: number): ValidationResult {
  if (supply === undefined || supply === null) {
    return { valid: false, error: 'Supply is required' };
  }
  if (!Number.isInteger(supply) || supply <= 0) {
    return { valid: false, error: 'Supply must be a positive integer' };
  }
  if (supply > Number.MAX_SAFE_INTEGER) {
    return { valid: false, error: 'Supply exceeds maximum safe value' };
  }
  return { valid: true };
}

/**
 * Validate staking amount.
 * @param amount - The amount to validate in micro-STX.
 * @param minAmount - Minimum stake (default: 1000000 = 1 STX).
 */
export function validateStakeAmount(amount: number, minAmount: number = 1000000): ValidationResult {
  if (amount === undefined || amount === null) {
    return { valid: false, error: 'Amount is required' };
  }
  if (!Number.isFinite(amount) || amount < minAmount) {
    return { valid: false, error: `Minimum stake is ${minAmount / 1000000} STX` };
  }
  return { valid: true };
}

/**
 * Validate service title.
 * @param title - The service title to validate.
 */
export function validateServiceTitle(title: string): ValidationResult {
  if (!title || title.trim() === '') {
    return { valid: false, error: 'Service title is required' };
  }
  if (title.length < 3 || title.length > 64) {
    return { valid: false, error: 'Title must be 3-64 characters' };
  }
  return { valid: true };
}

/**
 * Validate service ID.
 * @param serviceId - The service ID to validate.
 */
export function validateServiceId(serviceId: number): ValidationResult {
  if (serviceId === undefined || serviceId === null) {
    return { valid: false, error: 'Service ID is required' };
  }
  if (!Number.isInteger(serviceId) || serviceId < 0) {
    return { valid: false, error: 'Service ID must be a non-negative integer' };
  }
  return { valid: true };
}
