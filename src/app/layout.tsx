import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Web3Provider } from '@/components/Web3Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crypto Harvest - DeFi Farming Game',
  description: 'Plant, grow, and harvest digital crops to earn HARVEST tokens in this innovative DeFi farming game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <div className="absolute inset-0 bg-[url('/farm-pattern.svg')] opacity-5"></div>
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
