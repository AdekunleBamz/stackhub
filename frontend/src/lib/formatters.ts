/**
 * Formatting Utilities
 * Helper functions for displaying values in the UI.
 */

const MICROSTX_PER_STX = 1_000_000;

/**
 * Format micro-STX to human-readable STX string.
 * @param microStx - Amount in micro-STX.
 * @param decimals - Number of decimal places (default: 2).
 */
export function formatSTX(microStx: number | string, decimals: number = 2): string {
  const value = typeof microStx === 'string' ? parseInt(microStx, 10) : microStx;
  if (isNaN(value)) return '0 STX';
  const stx = value / MICROSTX_PER_STX;
  return `${stx.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} STX`;
}

/**
 * Format a number with compact notation (e.g., 1.5K, 2.3M).
 * @param value - The number to format.
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Truncate a Stacks address for display.
 * @param address - The full address.
 * @param startChars - Characters to show at start (default: 6).
 * @param endChars - Characters to show at end (default: 4).
 */
export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format a transaction ID for display.
 * @param txId - The transaction ID.
 */
export function formatTxId(txId: string): string {
  if (!txId) return '';
  return truncateAddress(txId, 8, 8);
}

/**
 * Format a date from Unix timestamp.
 * @param timestamp - Unix timestamp in seconds.
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a datetime from Unix timestamp.
 * @param timestamp - Unix timestamp in seconds.
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 hours ago").
 * @param timestamp - Unix timestamp in seconds.
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return formatDate(timestamp);
}

/**
 * Format a percentage value.
 * @param value - The percentage value.
 * @param decimals - Number of decimal places (default: 2).
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format token amount with symbol.
 * @param amount - The raw token amount.
 * @param decimals - Token decimals.
 * @param symbol - Token symbol.
 */
export function formatTokenAmount(amount: number | string, decimals: number, symbol: string): string {
  const value = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  if (isNaN(value)) return `0 ${symbol}`;
  const formatted = value / Math.pow(10, decimals);
  return `${formatted.toLocaleString(undefined, { maximumFractionDigits: decimals })} ${symbol}`;
}

/**
 * Get explorer URL for a transaction.
 * @param txId - The transaction ID.
 * @param isTestnet - Whether to use testnet explorer.
 */
export function getExplorerTxUrl(txId: string, isTestnet: boolean = false): string {
  const base = 'https://explorer.stacks.co/txid';
  const network = isTestnet ? '?chain=testnet' : '';
  return `${base}/${txId}${network}`;
}

/**
 * Get explorer URL for an address.
 * @param address - The Stacks address.
 * @param isTestnet - Whether to use testnet explorer.
 */
export function getExplorerAddressUrl(address: string, isTestnet: boolean = false): string {
  const base = 'https://explorer.stacks.co/address';
  const network = isTestnet ? '?chain=testnet' : '';
  return `${base}/${address}${network}`;
}
