/**
 * Stacks API Client
 * Wrapper for Hiro API endpoints to fetch blockchain data.
 */

const MAINNET_API = 'https://api.hiro.so';

/**
 * API Response Types
 */
export interface AccountBalance {
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
  };
  fungible_tokens: Record<string, { balance: string }>;
  non_fungible_tokens: Record<string, { count: string }>;
}

export interface Transaction {
  tx_id: string;
  tx_type: string;
  tx_status: string;
  block_height: number;
  burn_block_time: number;
  sender_address: string;
}

export interface NFTHolding {
  asset_identifier: string;
  value: {
    repr: string;
  };
}

export interface ContractInfo {
  tx_id: string;
  canonical: boolean;
  contract_id: string;
  block_height: number;
  source_code: string;
}

/**
 * Fetch account balance for a Stacks address.
 * @param address - The Stacks address to query.
 */
export async function getAccountBalance(address: string): Promise<AccountBalance> {
  const response = await fetch(`${MAINNET_API}/extended/v1/address/${address}/balances`);
  if (!response.ok) {
    throw new Error(`Failed to fetch balance: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch recent transactions for an address.
 * @param address - The Stacks address to query.
 * @param limit - Number of transactions to fetch (default: 20).
 */
export async function getTransactions(address: string, limit: number = 20): Promise<{ results: Transaction[] }> {
  const response = await fetch(
    `${MAINNET_API}/extended/v1/address/${address}/transactions?limit=${limit}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch transaction details by ID.
 * @param txId - The transaction ID.
 */
export async function getTransaction(txId: string): Promise<Transaction> {
  const response = await fetch(`${MAINNET_API}/extended/v1/tx/${txId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch transaction: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NFT holdings for an address.
 * @param address - The Stacks address to query.
 * @param contractId - Optional contract ID to filter by.
 */
export async function getNFTHoldings(
  address: string, 
  contractId?: string
): Promise<{ results: NFTHolding[] }> {
  let url = `${MAINNET_API}/extended/v1/tokens/nft/holdings?principal=${address}`;
  if (contractId) {
    url += `&asset_identifiers=${contractId}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch NFT holdings: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch contract information.
 * @param contractId - The full contract ID (address.contract-name).
 */
export async function getContractInfo(contractId: string): Promise<ContractInfo> {
  const response = await fetch(`${MAINNET_API}/extended/v1/contract/${contractId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch contract info: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Call a read-only contract function.
 * @param contractId - The full contract ID.
 * @param functionName - The function name to call.
 * @param args - The function arguments as hex-encoded Clarity values.
 * @param senderAddress - The sender address for the read-only call.
 */
export async function callReadOnly(
  contractId: string,
  functionName: string,
  args: string[],
  senderAddress: string
): Promise<{ okay: boolean; result: string }> {
  const [contractAddress, contractName] = contractId.split('.');
  const response = await fetch(
    `${MAINNET_API}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderAddress,
        arguments: args,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to call read-only function: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get current block height.
 */
export async function getCurrentBlockHeight(): Promise<number> {
  const response = await fetch(`${MAINNET_API}/extended/v1/block?limit=1`);
  if (!response.ok) {
    throw new Error(`Failed to fetch block height: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results[0]?.height ?? 0;
}

/**
 * Check if a transaction is confirmed.
 * @param txId - The transaction ID to check.
 */
export async function isTransactionConfirmed(txId: string): Promise<boolean> {
  try {
    const tx = await getTransaction(txId);
    return tx.tx_status === 'success';
  } catch {
    return false;
  }
}
