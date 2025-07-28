#!/usr/bin/env bash
# One-click deployment script for Africa Metaverse dApp
# Requirements: Node.js, npm and serve

set -euo pipefail

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install --silent
fi

# Build the application
echo "Building the application..."
npm run build

# Serve the production build
# If you want to deploy to a hosting provider, replace the line below.

if ! command -v serve &>/dev/null; then
  echo "Installing serve globally for static hosting..."
  npm install -g serve --silent
fi

serve -s dist -l 5000