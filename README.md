# 🌾 Crypto Harvest - DeFi Farming Game

A revolutionary Web3 farming game where players plant, grow, and harvest digital crops to earn HARVEST tokens. Built with Next.js, Solidity, and modern Web3 technologies.

## 🚀 Features

### 🌱 Farming Mechanics
- **Plant Crops**: Choose from 5 different crop types (Wheat, Corn, Apple, Carrot, Grape)
- **Growth Timers**: Real-time blockchain-based growth tracking
- **Harvest Rewards**: Earn HARVEST tokens for successful harvests
- **Farm Management**: Track your crops, balance, and farming history

### 🎮 Game Features
- **Real-time Updates**: Live crop growth progress with countdown timers
- **Visual Feedback**: Beautiful animations and progress bars
- **Multiple Crops**: Different growth times and reward structures
- **Environment System**: Weather and soil quality indicators

### 💎 Web3 Integration
- **Multi-chain Support**: Works on Ethereum, Polygon, Optimism, Arbitrum, and Abstract
- **Wallet Connection**: MetaMask, WalletConnect, and Coinbase Wallet support
- **Smart Contracts**: Fully audited and gas-optimized Solidity contracts
- **Real Transactions**: Actual blockchain interactions for farming activities

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Web3
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript interface for Ethereum
- **Ethers.js** - Ethereum library

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Secure contract libraries
- **Hardhat** - Development framework
- **ReentrancyGuard** - Security protection

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-harvest-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_HARVEST_TOKEN_ADDRESS=your_contract_address
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   PRIVATE_KEY=your_deployment_key
   ABSTRACT_RPC_URL=your_abstract_rpc_url
   ```

4. **Deploy the smart contract**
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy-harvest.js --network localhost
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 How to Play

### Getting Started
1. **Connect Wallet**: Click "Connect Wallet" and choose your preferred wallet
2. **Get HARVEST Tokens**: You'll need tokens to plant crops (5 HARVEST per crop)
3. **Choose Your Crop**: Select from Wheat (5min), Corn (10min), Apple (15min), Carrot (7.5min), or Grape (20min)
4. **Plant & Wait**: Click "Plant Crop" and watch your crops grow in real-time
5. **Harvest Rewards**: When crops are ready, click "Harvest" to earn 10 HARVEST tokens

### Crop Types & Rewards
| Crop | Growth Time | Reward | Color |
|------|-------------|--------|-------|
| Wheat | 5 minutes | 10 HARVEST | Yellow |
| Corn | 10 minutes | 20 HARVEST | Orange |
| Apple | 15 minutes | 30 HARVEST | Red |
| Carrot | 7.5 minutes | 15 HARVEST | Orange |
| Grape | 20 minutes | 40 HARVEST | Purple |

### Strategy Tips
- **Start Small**: Begin with Wheat to build your token balance
- **Diversify**: Plant different crops for varied harvest times
- **Monitor**: Check back regularly to harvest ready crops
- **Scale Up**: Use earned tokens to plant more valuable crops

## 🔧 Development

### Smart Contract Development
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy-harvest.js --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy-harvest.js --network abstract
```

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Contract Functions
- `plantCrop(string cropType)` - Plant a new crop (costs 5 HARVEST)
- `harvestCrop(uint256 cropId)` - Harvest a ready crop (earns 10 HARVEST)
- `getFarm(address farmer)` - Get farmer's farm data
- `getCrop(uint256 cropId)` - Get specific crop details
- `getReadyCrops(address farmer)` - Get list of ready-to-harvest crops

## 🌐 Network Support

The app supports multiple networks:
- **Ethereum Mainnet**
- **Polygon**
- **Optimism**
- **Arbitrum**
- **Abstract Mainnet** (custom configuration)

## 🔒 Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Input Validation**: All user inputs are validated
- **Gas Optimization**: Efficient contract design
- **Access Control**: Owner-only functions protected
- **Event Logging**: All important actions are logged

## 📱 Responsive Design

The app is fully responsive and works on:
- **Desktop**: Full feature set with detailed farm view
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with simplified navigation

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern glass-like UI elements
- **Smooth Animations**: Framer Motion powered transitions
- **Real-time Updates**: Live crop growth and timer updates
- **Progress Indicators**: Visual progress bars for crop growth
- **Color-coded Crops**: Each crop type has unique colors
- **Loading States**: Clear feedback during transactions

## 🚀 Deployment

### Smart Contract Deployment
1. Set up your deployment wallet with sufficient funds
2. Configure network settings in `hardhat.config.js`
3. Run deployment script: `npx hardhat run scripts/deploy-harvest.js --network <network>`
4. Update contract address in `src/config/web3.ts`

### Frontend Deployment
1. Build the app: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Set environment variables in your hosting platform
4. Configure custom domain if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the code comments and this README
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Discord**: Join our Discord server for real-time help

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic farming mechanics
- ✅ Multi-crop system
- ✅ Real-time growth tracking
- ✅ Wallet integration

### Phase 2 (Planned)
- 🚧 NFT Land Plots
- 🚧 Advanced Crops
- 🚧 Weather System
- 🚧 Marketplace

### Phase 3 (Future)
- 📋 Guild System
- 📋 Cross-chain Farming
- 📋 Mobile App
- 📋 Tournament Mode

---

**🌾 Happy Farming! Plant your digital seeds and watch your HARVEST grow! 🌾**
