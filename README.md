# StackHub - DeFi Platform on Stacks

A multi-service DeFi platform built on the Stacks blockchain with 4 fee-generating smart contracts.

## 🚀 Live on Mainnet

All contracts are deployed and verified on Stacks Mainnet:

| Contract | Address | Description |
|----------|---------|-------------|
| NFT Marketplace | `SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stackhub-nft-marketplace` | Mint, list, buy NFTs (1.25% platform fee) |
| Token Launchpad | `SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stackhub-token-launchpad` | Create custom tokens (5 STX fee) |
| Staking Vault | `SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stackhub-staking-vault` | Stake STX (0.5% / 2.5% withdrawal fees) |
| Service Registry | `SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stackhub-service-registry` | Register services (2.5 STX + 1.5% tx fee) |

## 📁 Project Structure

```
stackhub/
├── stackhub-contracts/     # Clarity smart contracts
│   ├── contracts/          # Contract source files
│   └── tests/              # Vitest unit tests
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── config/         # Contract configurations
│   └── public/             # Static assets
└── README.md
```

## 🛠️ Smart Contracts

### NFT Marketplace
- **Mint NFTs** with custom metadata URI
- **List NFTs** for sale at any price
- **Buy NFTs** with automatic fee distribution
- Platform fee: **1.25%** on all sales

### Token Launchpad
- **Create custom tokens** with name, symbol, decimals
- **Mint additional tokens** (owner only)
- **Transfer & burn** tokens
- Creation fee: **5 STX**

### Staking Vault
- **Stake STX** to earn rewards
- **Request unstake** after lock period
- Normal withdrawal fee: **0.5%**
- Early withdrawal fee: **2.5%**

### Service Registry
- **Register services** with description and price
- **Pay for services** through the platform
- Listing fee: **2.5 STX**
- Transaction fee: **1.5%**

## 🧪 Running Tests

```bash
cd stackhub-contracts
npm install
npm test
```

All 28 tests should pass.

## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔧 Technologies

- **Smart Contracts**: Clarity (version 4)
- **Testing**: Clarinet SDK + Vitest
- **Frontend**: Next.js 16 + React 19
- **Stacks Wallet**: @stacks/connect (Leather/Hiro Wallet)
- **EVM Wallet**: Reown AppKit + Wagmi (MetaMask, WalletConnect, etc.)
- **Networks**: Stacks Mainnet + EVM chains (Ethereum, Arbitrum, Optimism, Polygon, Base)

## 🔐 Wallet Integration

StackHub supports multiple wallet types:

### Stacks Wallets
- Leather Wallet
- Hiro Wallet
- Xverse

### EVM Wallets (via Reown AppKit)
- MetaMask
- WalletConnect
- Coinbase Wallet
- Social logins (Google, Discord, etc.)

To enable EVM wallet support, get a project ID from [Reown Cloud](https://cloud.reown.com) and add it to your `.env.local`:

```bash
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

## 📜 License

MIT

## 🔗 Links

- [Stacks Explorer](https://explorer.hiro.so)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [Stacks.js Documentation](https://docs.hiro.so/stacks.js)
