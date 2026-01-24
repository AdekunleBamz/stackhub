"use client";

import { openContractCall } from "@stacks/connect";
import { 
  uintCV, 
  stringAsciiCV,
  PostConditionMode 
} from "@stacks/transactions";
import { CONTRACTS } from "@/config/contracts";

/**
 * Mint a new NFT on the StackHub marketplace.
 * @param uri - The metadata URI for the NFT.
 * Initiates a contract call to `stackhub-nft-marketplace.mint`.
 */
export async function mintNFT(uri: string) {
  const [address, contractName] = CONTRACTS.NFT_MARKETPLACE.split(".");
  
  await openContractCall({
    contractAddress: address,
    contractName: contractName,
    functionName: "mint",
    functionArgs: [stringAsciiCV(uri)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log("Mint NFT TX:", data.txId);
    },
  });
}

/**
 * List an NFT for sale on the marketplace.
 * @param tokenId - The ID of the NFT to list.
 * @param price - The sale price in micro-STX.
 * Calls `stackhub-nft-marketplace.list-nft`.
 */
export async function listNFT(tokenId: number, price: number) {
  const [address, contractName] = CONTRACTS.NFT_MARKETPLACE.split(".");
  
  await openContractCall({
    contractAddress: address,
    contractName: contractName,
    functionName: "list-nft",
    functionArgs: [uintCV(tokenId), uintCV(price)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log("List NFT TX:", data.txId);
    },
  });
}

/**
 * Purchase an NFT from the marketplace.
 * @param tokenId - The ID of the NFT to buy.
 * Calls `stackhub-nft-marketplace.buy-nft`.
 */
export async function buyNFT(tokenId: number) {
  const [address, contractName] = CONTRACTS.NFT_MARKETPLACE.split(".");
  
  await openContractCall({
    contractAddress: address,
    contractName: contractName,
    functionName: "buy-nft",
    functionArgs: [uintCV(tokenId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log("Buy NFT TX:", data.txId);
    },
  });
}

// Token Launchpad Functions
/**
 * Create a new token using the Launchpad.
 * @param name - The name of the token.
 * @param symbol - The token symbol (3-5 chars).
 * @param decimals - Decimal places (usually 6).
 * @param initialSupply - The initial supply value.
 * Calls `stackhub-token-launchpad.create-token`.
 */
export async function createToken(
  name: string,
  symbol: string,
  decimals: number,
  initialSupply: number
) {
  const [address, contractName] = CONTRACTS.TOKEN_LAUNCHPAD.split(".");
  
  await openContractCall({
    contractAddress: address,
    contractName: contractName,
    functionName: "create-token",
    functionArgs: [
      stringAsciiCV(name),
      stringAsciiCV(symbol),
      uintCV(decimals),
      uintCV(initialSupply),
    ],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log("Create Token TX:", data.txId);
    },
  });
}

// Staking Vault Functions
/**
 * Stake STX tokens in the vault.
 * @param amount - The amount to stake in micro-STX.
 * Calls `stackhub-staking-vault.stake`.
 */
export async function stakeSTX(amount: number) {
  const [address, contractName] = CONTRACTS.STAKING_VAULT.split(".");
  
  await openContractCall({
    contractAddress: address,
    contractName: contractName,
    functionName: "stake",
    functionArgs: [uintCV(amount)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log("Stake TX:", data.txId);
    },
  });
}

export async function requestUnstake(amount: number) {
  const [address, contractName] = CONTRACTS.STAKING_VAULT.split(".");
  
  await openContractCall({
    contractAddress: address,
    contractName: contractName,
    functionName: "request-unstake",
    functionArgs: [uintCV(amount)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log("Unstake Request TX:", data.txId);
    },
  });
}

// Service Registry Functions
export async function registerService(title: string, price: number) {
  const [address, contractName] = CONTRACTS.SERVICE_REGISTRY.split(".");
  
  await openContractCall({
    contractAddress: address,
    contractName: contractName,
    functionName: "register-service",
    functionArgs: [stringAsciiCV(title), uintCV(price)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log("Register Service TX:", data.txId);
    },
  });
}

export async function payForService(serviceId: number) {
  const [address, contractName] = CONTRACTS.SERVICE_REGISTRY.split(".");
  
  await openContractCall({
    contractAddress: address,
    contractName: contractName,
    functionName: "pay-service",
    functionArgs: [uintCV(serviceId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log("Pay Service TX:", data.txId);
    },
  });
}
