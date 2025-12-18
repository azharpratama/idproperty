# IDProperty - RWA Real Estate Tokenization Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A decentralized application (dApp) for tokenizing real estate assets in Indonesia, built on Mantle Sepolia Testnet. This platform enables fractional ownership of property through ERC-20 compliant security tokens with built-in KYC compliance.

## 🚀 Live Demo

- **Frontend**: [https://idproperty.vercel.app/](https://idproperty.vercel.app/)

## 📋 Deployed Contracts (Mantle Sepolia)

| Contract | Address | Status |
|----------|---------|--------|
| KYCRegistry | [`0xeaea25d2021e069aa6858b133e727b63ea5bce92`](https://sepolia.mantlescan.xyz/address/0xeaea25d2021e069aa6858b133e727b63ea5bce92#code) | ✅ Verified |
| IndonesiaPropertyToken | [`0x96437740de3af7f644557f6c3371b86525d595e7`](https://sepolia.mantlescan.xyz/address/0x96437740de3af7f644557f6c3371b86525d595e7#code) | ✅ Verified |

## ✨ Features

### Core Functionality
- **Property Tokenization**: View tokenized property details including location, valuation, and legal documents
- **KYC Compliance**: Integrated KYC verification system with multiple levels (Basic, Verified, Accredited)
- **Token Transfers**: Transfer tokens between verified investors with real-time balance updates
- **Portfolio Management**: Track your token holdings and ownership percentage
- **Admin Dashboard**: Manage KYC registrations, freeze accounts, and perform force transfers
- **Multi-wallet Support**: Connect via MetaMask, Rainbow, Coinbase Wallet, and more

### Security & Best Practices
- 97 comprehensive smart contract tests
- Custom errors for gas optimization
- Pausable for emergency stops
- Two-step admin transfer
- Access control with admin functions
- Freeze/unfreeze accounts for AML compliance
- Investment limits enforcement (min/max)

## 🏗️ Project Structure

```
idproperty/
├── contract/                    # Smart contracts (Foundry)
│   ├── src/
│   │   ├── KYCRegistry.sol      # KYC verification (2.5 KB)
│   │   └── IndonesiaPropertyToken.sol  # ERC-20 token (6.0 KB)
│   ├── test/
│   │   ├── KYCRegistry.t.sol    # 38 tests
│   │   └── IndonesiaPropertyToken.t.sol  # 59 tests
│   ├── script/
│   │   └── Deploy.s.sol         # Deployment script
│   └── foundry.toml
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── config/              # Contract ABIs & config
│   │   ├── hooks/               # Web3 hooks
│   │   ├── pages/               # App pages
│   │   └── lib/                 # Utilities
│   └── package.json
├── .env.example                 # Environment template
└── README.md                    # This file
```

## ⚡ Quick Start

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js 18+
- MetaMask or compatible Web3 wallet

### Installation
```bash
# Clone repository
git clone https://github.com/azharpratama/idproperty
cd idproperty

# Install contract dependencies
cd contract && forge install

# Install frontend dependencies
cd ../frontend && npm install
```

## 🔧 Smart Contract Development

### Build Contract
```bash
cd contract
forge build
```

### Run Tests
```bash
cd contract

# Run all tests
forge test

# Run with gas report
forge test --gas-report

# Run with verbosity
forge test -vvv
```

Expected: All 97 tests passing ✅

### Deploy Contract
```bash
cd contract

# 1. Configure ../.env with your PRIVATE_KEY
# 2. Deploy to Mantle Sepolia
forge script script/Deploy.s.sol \
  --rpc-url https://rpc.sepolia.mantle.xyz \
  --broadcast \
  --verify \
  -vvvv
```

### Interact with Contract (using Cast)
```bash
# Check contract balance
cast call <CONTRACT_ADDRESS> "totalSupply()" --rpc-url https://rpc.sepolia.mantle.xyz

# Get token name
cast call <CONTRACT_ADDRESS> "name()" --rpc-url https://rpc.sepolia.mantle.xyz
```

## 🌐 Frontend Development

### Development Server
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

### Build for Production
```bash
cd frontend
npm run build
```

### Available Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Platform overview and key statistics |
| Property | `/property` | Detailed property information |
| Portfolio | `/portfolio` | User's token holdings |
| Transfer | `/transfer` | Send tokens to other investors |
| KYC Status | `/kyc` | View KYC verification status |
| Admin | `/admin` | Admin functions (owner only) |

## 📋 Contract Interface

### KYCRegistry

| Function | Description | Access |
|----------|-------------|--------|
| `registerInvestor(address, level, countryCode, validDays)` | Register KYC verified investor | Admin |
| `updateInvestor(address, newLevel)` | Update KYC level | Admin |
| `revokeInvestor(address)` | Revoke KYC (blacklist) | Admin |
| `isVerified(address)` | Check if investor is verified | Public |
| `meetsLevel(address, level)` | Check minimum KYC level | Public |

### IndonesiaPropertyToken

| Function | Description | Access |
|----------|-------------|--------|
| `transfer(to, value)` | Transfer tokens (KYC required) | Public |
| `freezeAccount(account, reason)` | Freeze account (AML) | Admin |
| `unfreezeAccount(account)` | Unfreeze account | Admin |
| `forceTransfer(from, to, value)` | Force transfer (legal) | Admin |
| `getOwnershipPercent(owner)` | Get ownership % (basis points) | Public |
| `canTransfer(from, to, value)` | Check if transfer allowed | Public |

## 🔐 KYC Levels

| Level | Code | Requirements |
|-------|------|--------------|
| NONE | 0 | Not verified |
| BASIC | 1 | KTP only |
| VERIFIED | 2 | KTP + NPWP |
| ACCREDITED | 3 | KTP + NPWP + Asset Proof |

## 🔧 Tech Stack

### Smart Contracts
- Solidity 0.8.30
- Foundry (Forge, Cast, Anvil)

### Frontend
- React 19, TypeScript, Vite 6
- Tailwind CSS 4
- Wagmi 2, Viem 2, RainbowKit 2
- TanStack React Query 5

## 📄 Environment Variables

### Root `.env` (for contract deployment)
```bash
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_mantlescan_api_key
```

### Frontend `.env`
```bash
VITE_CONTRACT_ADDRESS=0x96437740de3af7f644557f6c3371b86525d595e7
VITE_KYC_REGISTRY_ADDRESS=0xeaea25d2021e069aa6858b133e727b63ea5bce92
```

## 🔗 Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Mantle Sepolia Explorer](https://sepolia.mantlescan.xyz/)
- [Mantle Sepolia Faucet](https://faucet.sepolia.mantle.xyz)
- [ERC-3643 Security Token Standard](https://www.erc3643.org/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Azhar Aditya Pratama**
- GitHub: [@azharpratama](https://github.com/azharpratama)

Built for **[HackQuest Indonesia: Co-Learning Camp 6 - Mantle](https://www.hackquest.io/)**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Azhar Aditya Pratama
