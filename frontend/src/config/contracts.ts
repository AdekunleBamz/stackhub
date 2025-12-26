// Contract addresses - MAINNET DEPLOYED
export const CONTRACTS = {
  NFT_MARKETPLACE: "SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stackhub-nft-marketplace",
  TOKEN_LAUNCHPAD: "SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stackhub-token-launchpad", 
  STAKING_VAULT: "SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stackhub-staking-vault",
  SERVICE_REGISTRY: "SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stackhub-service-registry",
};

// Network configuration
export const NETWORK = {
  MAINNET: "https://api.hiro.so",
  TESTNET: "https://api.testnet.hiro.so",
};

// Fee constants (in microstacks, 1 STX = 1,000,000 microstacks)
export const FEES = {
  NFT_SALE_FEE: 1.25, // 1.25%
  TOKEN_CREATION: 5000000, // 5 STX
  STAKING_WITHDRAW: 0.5, // 0.5%
  STAKING_EARLY: 2.5, // 2.5%
  SERVICE_LISTING: 2500000, // 2.5 STX
  SERVICE_TX: 1.5, // 1.5%
};
