import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Chain } from 'wagmi/chains';
import App from './App';

const abstractMainnet: Chain = {
  id: 2741,
  name: 'Abstract',
  network: 'abstract',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://api.mainnet.abs.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'ABScan', url: 'https://abscan.org' },
  },
};

const { chains, publicClient } = configureChains([abstractMainnet], [publicProvider()]);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  chains,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);