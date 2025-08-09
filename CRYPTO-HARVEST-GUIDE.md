# 🌾 Crypto Harvest - Complete Setup & Usage Guide

## 🚀 Quick Start

### 1. Start the App
```bash
cd crypto-harvest-app
npm run dev -- --port 3001
```
Visit: http://localhost:3001

### 2. Deploy Smart Contract
```bash
# Start local blockchain
npx hardhat node

# In another terminal, deploy contract
npm run deploy:local
```

### 3. Test Web3 Integration
```bash
npm run test
```

## 🎮 How to Play

### Step 1: Connect Wallet
- Click "Connect Wallet" button
- Choose MetaMask, WalletConnect, or Coinbase Wallet
- Approve the connection

### Step 2: Get HARVEST Tokens
- You need tokens to plant crops (5 HARVEST per crop)
- Initially, you'll have 0 tokens
- Use the test script to get tokens: `npm run test`

### Step 3: Plant Your First Crop
1. Select a crop type (Wheat is fastest - 5 minutes)
2. Click "Plant Crop" (costs 5 HARVEST)
3. Confirm the transaction in your wallet
4. Watch your crop grow in real-time!

### Step 4: Harvest Rewards
- When your crop is ready (timer reaches 0:00)
- Click "Harvest" button
- Earn 10 HARVEST tokens per harvest
- Use earned tokens to plant more crops

## 🌾 Crop Types & Strategy

| Crop | Growth Time | Cost | Reward | Profit | Best For |
|------|-------------|------|--------|--------|----------|
| Wheat | 5 minutes | 5 HARVEST | 10 HARVEST | +5 | Beginners |
| Corn | 10 minutes | 5 HARVEST | 20 HARVEST | +15 | Balanced |
| Apple | 15 minutes | 5 HARVEST | 30 HARVEST | +25 | Patient players |
| Carrot | 7.5 minutes | 5 HARVEST | 15 HARVEST | +10 | Quick returns |
| Grape | 20 minutes | 5 HARVEST | 40 HARVEST | +35 | Long-term |

### Strategy Tips:
- **Start with Wheat**: Fastest return on investment
- **Diversify**: Plant different crops for varied harvest times
- **Monitor**: Check back regularly to harvest ready crops
- **Scale Up**: Use profits to plant more valuable crops

## 🔧 Development Commands

### Smart Contract
```bash
# Compile contracts
npm run compile

# Deploy to local network
npm run deploy:local

# Deploy to Abstract mainnet
npm run deploy:abstract

# Run tests
npm run test

# Start local blockchain
npm run node
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Contract Functions

### Core Functions
- `plantCrop(string cropType)` - Plant a new crop
- `harvestCrop(uint256 cropId)` - Harvest a ready crop
- `getFarm(address farmer)` - Get farmer's farm data
- `getCrop(uint256 cropId)` - Get specific crop details
- `getReadyCrops(address farmer)` - Get ready-to-harvest crops

### Token Functions
- `balanceOf(address account)` - Check token balance
- `transfer(address to, uint256 amount)` - Send tokens
- `approve(address spender, uint256 amount)` - Approve spending

## 🌐 Network Configuration

### Supported Networks
- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Optimism** (Chain ID: 10)
- **Arbitrum** (Chain ID: 42161)
- **Abstract Mainnet** (Chain ID: 1234) - Custom

### Adding New Networks
1. Update `src/config/web3.ts`
2. Add network configuration
3. Update `hardhat.config.js`
4. Deploy contract to new network

## 🔒 Security Features

### Smart Contract Security
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Input Validation**: All inputs validated
- **Access Control**: Owner-only functions protected
- **Event Logging**: All actions logged for transparency
- **Gas Optimization**: Efficient contract design

### Frontend Security
- **Wallet Validation**: Secure wallet connections
- **Transaction Confirmation**: User approval required
- **Error Handling**: Graceful error management
- **Loading States**: Clear transaction feedback

## 🎨 UI/UX Features

### Visual Design
- **Glassmorphism**: Modern glass-like effects
- **Gradient Backgrounds**: Beautiful color schemes
- **Smooth Animations**: Framer Motion powered
- **Responsive Layout**: Works on all devices
- **Dark Mode Support**: Easy on the eyes

### User Experience
- **Real-time Updates**: Live crop growth tracking
- **Progress Indicators**: Visual growth progress
- **Color-coded Crops**: Each crop has unique colors
- **Loading States**: Clear transaction feedback
- **Error Messages**: Helpful error descriptions

## 📱 Mobile Optimization

### Responsive Features
- **Touch-friendly**: Large buttons for mobile
- **Simplified Navigation**: Easy mobile navigation
- **Optimized Layout**: Mobile-first design
- **Fast Loading**: Optimized for mobile networks
- **Offline Support**: Basic offline functionality

## 🧪 Testing

### Automated Tests
```bash
# Run all tests
npm run test

# Test specific functions
npx hardhat test --grep "plantCrop"

# Test with coverage
npx hardhat coverage
```

### Manual Testing
1. **Wallet Connection**: Test all wallet types
2. **Planting**: Plant different crop types
3. **Harvesting**: Wait for crops and harvest
4. **Token Transfers**: Send tokens between accounts
5. **Error Handling**: Test invalid inputs

## 🚀 Deployment

### Smart Contract Deployment
1. **Prepare Environment**:
   ```bash
   # Set private key
   export PRIVATE_KEY="your_private_key"
   
   # Set RPC URL
   export ABSTRACT_RPC_URL="your_rpc_url"
   ```

2. **Deploy Contract**:
   ```bash
   npm run deploy:abstract
   ```

3. **Update Configuration**:
   - Update contract address in `src/config/web3.ts`
   - Set environment variables

### Frontend Deployment
1. **Build App**:
   ```bash
   npm run build
   ```

2. **Deploy to Platform**:
   - Vercel: `vercel --prod`
   - Netlify: Drag `out` folder
   - Custom: Upload build files

3. **Configure Environment**:
   - Set `NEXT_PUBLIC_HARVEST_TOKEN_ADDRESS`
   - Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## 🔧 Troubleshooting

### Common Issues

#### Contract Deployment Fails
```bash
# Check network connection
npx hardhat console --network abstract

# Verify private key
echo $PRIVATE_KEY

# Check gas settings
npx hardhat run scripts/deploy-harvest.js --network abstract --verbose
```

#### Wallet Connection Issues
- Clear browser cache
- Check wallet extension
- Verify network configuration
- Try different wallet

#### Transaction Fails
- Check token balance
- Verify gas settings
- Ensure crop is ready to harvest
- Check network congestion

#### App Won't Start
```bash
# Clear cache
rm -rf .next
npm run dev

# Check dependencies
npm install

# Verify TypeScript
npx tsc --noEmit
```

### Performance Optimization
- **Gas Optimization**: Use efficient contract functions
- **Batch Operations**: Group multiple actions
- **Caching**: Cache contract data
- **Lazy Loading**: Load components on demand

## 📈 Analytics & Monitoring

### Smart Contract Events
- `CropPlanted`: Track planting activity
- `CropHarvested`: Monitor harvest success
- `Transfer`: Token movement tracking
- `Approval`: Spending approvals

### Frontend Analytics
- User engagement metrics
- Transaction success rates
- Error tracking
- Performance monitoring

## 🔮 Future Enhancements

### Phase 2 Features
- **NFT Land Plots**: Ownable farm land
- **Advanced Crops**: Rare and special crops
- **Weather System**: Dynamic farming conditions
- **Marketplace**: Buy/sell crops and tokens

### Phase 3 Features
- **Guild System**: Collaborative farming
- **Cross-chain Farming**: Multi-chain support
- **Mobile App**: Native mobile experience
- **Tournament Mode**: Competitive farming

## 🆘 Support & Community

### Getting Help
- **Documentation**: Check this guide and README
- **GitHub Issues**: Report bugs and feature requests
- **Discord**: Join community discussions
- **Email**: Contact for business inquiries

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

**🌾 Happy Farming! Plant your digital seeds and watch your HARVEST grow! 🌾**

*Built with ❤️ for the Web3 community* 

---

## The Problem

- The wagmi `chains` array must be of type `[Chain, ...Chain[]]`.
- The custom `abstractMainnet` object must match the `Chain` type exactly.
- The first element (`mainnet`) must be a valid `Chain` from `wagmi/chains`.

---

## The Solution

**Use the `defineChain` utility from wagmi to create a fully compatible custom chain.**

---

## Here’s the code you should use in `src/config/web3.ts`:

```ts
import { http, createConfig } from 'wagmi';
import { mainnet, defineChain } from 'wagmi/chains';
import { metaMask, walletConnect, coinbaseWallet } from '@wagmi/connectors';

// Abstract mainnet configuration using defineChain for wagmi v1+
export const abstractMainnet = defineChain({
  id: 1234, // Replace with actual Abstract mainnet ID
  name: 'Abstract Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Abstract',
    symbol: 'ABS',
  },
  rpcUrls: {
    public: { http: ['https://rpc.abstract.network'] },
    default: { http: ['https://rpc.abstract.network'] },
  },
  blockExplorers: {
    default: { name: 'AbstractScan', url: 'https://scan.abstract.network' },
  },
});

export const chains = [mainnet, abstractMainnet];

export const config = createConfig({
  chains,
  connectors: [
    metaMask(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id' }),
    coinbaseWallet({ appName: 'FIFA GTA6 Web3 Game' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [abstractMainnet.id]: http(),
  },
});

---

## What to Do Next

1. **Replace the contents of `src/config/web3.ts` with the code above.**
2. **Run:**
   ```bash
   npm run build
   ```
   in your frontend directory.

3. **If you see any errors, copy them here and I’ll fix them for you.**

---

**This will ensure your custom chain is fully compatible with wagmi and your app will be ready for production and deployment.**  
Let me know when you’re ready for the next step! 