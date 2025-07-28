import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import React from 'react';
import Home from '../src/pages/Home';
import { MemoryRouter } from 'react-router-dom';
import { WagmiConfig, createConfig } from 'wagmi';
import { createPublicClient, http, defineChain } from 'viem';

// Minimal chain stub for testing
const testChain = defineChain({
  id: 1,
  name: 'Test',
  network: 'test',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['http://localhost:8545'] } },
});

const pc = createPublicClient({ chain: testChain, transport: http() });

// Minimal wagmi mock config
const wagmiConfig = createConfig({
  autoConnect: false,
  publicClient: pc,
});

describe('Home page', () => {
  afterEach(() => {
    // Vitest cleanup handled by rtl
  });

  it('renders heading', () => {
    render(
      <WagmiConfig config={wagmiConfig}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </WagmiConfig>
    );

    expect(screen.getByRole('heading', { name: /Africa Metaverse dApp/i })).toBeInTheDocument();
  });
});