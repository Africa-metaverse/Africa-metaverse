# 🐧 Penguin Gaming Hub - Deployment Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000` (or next available port)

## 🔧 Smart Contract Deployment

### Prerequisites
- Node.js 18+
- Abstract Chain wallet with testnet ETH
- Private key for deployment

### 1. Set Environment Variables
```bash
export PRIVATE_KEY="your_private_key_here"
```

### 2. Deploy Smart Contract
```bash
npx hardhat run scripts/deploy.js --network abstract
```

### 3. Update Contract Address
After deployment, update the contract address in:
- `src/hooks/useWeb3.ts` (line ~95)
- `src/config/chains.ts`

## 🎮 Features

### ✅ Implemented Features
- **Wallet Connection**: Abstract Wallet & MetaMask support
- **Token Economy**: Buy, earn, and transfer PENGU tokens
- **Admin System**: Special privileges for owner wallet
- **Gaming**: 2048, Tic-Tac-Toe, Rock-Paper-Scissors
- **Real-time UI**: Live leaderboard, achievements, activity feed
- **Modern Design**: Glassmorphism, animations, responsive

### 👑 Admin Features
- **Free Gaming**: Play all games without token cost
- **Double Rewards**: 400 tokens daily instead of 200
- **Admin Controls**: Mint, burn, and transfer tokens
- **Visual Indicators**: Admin badge and special styling

### 💰 Token Economy
- **Buy Tokens**: 0.001 ETH = 1000 PENGU tokens
- **Game Costs**: 2048 (10), Tic-Tac-Toe (5), RPS (3)
- **Daily Rewards**: 200 tokens every 24 hours
- **Token Transfers**: Send tokens to other users

## 🔗 Contract Addresses

### Abstract Chain
- **Pengu Token**: `0x...` (Update after deployment)
- **Admin Owner**: `0x01661103E022CB065cFDD1fB8EDC75c9c6b6234f`

## 🛠️ Development

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── wallet/         # Wallet connection
│   ├── ui/             # UI components
│   └── Web3Components.tsx
├── hooks/              # Custom hooks
│   └── useWeb3.ts      # Web3 integration
├── config/             # Configuration
│   └── chains.ts       # Chain & token config
└── contracts/          # Smart contracts
    └── PenguToken.sol  # Main contract
```

### Key Technologies
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Glassmorphism
- **Web3**: Wagmi, Viem, Abstract Wallet
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin

## 🎯 Testing

### 1. Connect Wallet
- Use Abstract Wallet or MetaMask
- Switch to Abstract Chain (Chain ID: 1513)

### 2. Test Admin Features
- Connect with admin wallet: `0x01661103E022CB065cFDD1fB8EDC75c9c6b6234f`
- Should see "👑 ADMIN" badge
- Games should show "FREE (Admin)"

### 3. Test Regular User Features
- Connect with any other wallet
- Buy tokens with ETH
- Play games with token costs
- Claim daily rewards

## 🚀 Production Deployment

### 1. Build the App
```bash
npm run build
```

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### 3. Update Environment Variables
- Set production contract addresses
- Configure Abstract Chain RPC
- Set admin wallet address

## 🔍 Troubleshooting

### Common Issues
1. **Import Errors**: Clear `.next` cache and reinstall dependencies
2. **Contract Errors**: Ensure correct network and contract addresses
3. **Wallet Connection**: Check Abstract Chain configuration
4. **Build Errors**: Update Node.js to version 18+

### Debug Commands
```bash
# Clear cache
rm -rf .next node_modules
npm install

# Check contract deployment
npx hardhat verify --network abstract CONTRACT_ADDRESS

# Test contract functions
npx hardhat console --network abstract
```

## 📈 Next Steps

### Phase 2 Features
- [ ] Real game implementations (2048, etc.)
- [ ] NFT achievements system
- [ ] Tournament mode
- [ ] Cross-chain bridge
- [ ] Mobile app

### Phase 3 Features
- [ ] DAO governance
- [ ] Staking rewards
- [ ] Marketplace integration
- [ ] Social features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**🐧 Penguin Gaming Hub** - The future of Web3 gaming is here! 🚀 

---

## 1. **Abstract Mainnet RPC URL**
- **What is it?**  
  - It’s the web address (endpoint) your app and Hardhat use to connect to the Abstract blockchain network (abs.xyz).
- **Default:**  
  - The default is:  
    ```
    https://rpc.abs.xyz
    ```
- **When do you need a custom one?**  
  - Only if you have a private node or a special endpoint from Abstract/abs.xyz.  
  - For most users, the default is fine.

---

## 2. **Deployment Wallet’s Private Key**
- **What is it?**  
  - It’s a secret string that gives full control over a blockchain wallet/account.  
  - Used to sign and send transactions (like deploying contracts).
- **Where do you get it?**
  - If you use MetaMask:
    1. Open MetaMask.
    2. Click the account icon (top right) > “Account details”.
    3. Click “Export Private Key”.
    4. Enter your password and copy the private key shown.
  - If you use another wallet, look for “Export Private Key” or similar in the settings.
- **Security Warning:**  
  - **Never share your main wallet’s private key publicly or with anyone you don’t trust.**
  - For testing, create a new wallet and use that private key.

---

## 3. **What to Do Next**
- If you’re comfortable, **paste your test wallet’s private key here** (or let me know if you want to create the `.env` file yourself).
- If you want to use the default Abstract RPC, you don’t need to do anything else for the RPC URL.

---

**Let me know if you want step-by-step help creating a new wallet for testing, or if you’re ready to proceed!** 