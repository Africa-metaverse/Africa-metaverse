#!/bin/bash

echo "🐧 Penguin Gaming Hub - Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
# Penguin Gaming Hub Environment Variables
NEXT_PUBLIC_ABSTRACT_CHAIN_ID=1513
NEXT_PUBLIC_ABSTRACT_RPC_URL=https://rpc.abstract.money
NEXT_PUBLIC_ADMIN_WALLET=0x01661103E022CB065cFDD1fB8EDC75c9c6b6234f

# Add your private key for contract deployment
# PRIVATE_KEY=your_private_key_here
EOF
    echo "✅ Created .env file"
fi

# Build the app
echo "🔨 Building the app..."
npm run build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🔧 To deploy the smart contract:"
echo "   1. Add your private key to .env"
echo "   2. Run: npx hardhat run scripts/deploy.js --network abstract"
echo ""
echo "📖 For more information, see DEPLOYMENT.md"
echo ""
echo "🐧 Happy gaming! 🎮" 