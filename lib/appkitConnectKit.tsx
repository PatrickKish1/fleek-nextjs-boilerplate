'use client';

import React from 'react';
import { createAppKit, useAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { mainnet, arbitrum, polygon, base } from '@reown/appkit/networks';
import { Button } from '@/components/ui/button';

// Environment variables
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'PULSE TRADE AI';

if (!projectId) {
  throw new Error('Please configure the AppKit project ID in .env first!');
}

// Metadata configuration
const getMetadata = () => {
  if (typeof window === 'undefined') {
    return {
      name: appName,
      description: 'Your OP trading platform that super charges your trading experience.',
      url: '',
      icons: ['']
    };
  }
  
  return {
    name: appName,
    description: 'Your OP trading platform that super charges your trading experience.',
    url: window.location.origin,
    icons: [`${window.location.origin}/logo.png`]
  };
};

const metadata = getMetadata();


// Create AppKit instance
const appKit = createAppKit({
  showWallets: true,
  themeMode: 'dark',
  adapters: [new EthersAdapter()],
  metadata,
  networks: [
    mainnet,
    arbitrum,
    polygon,
    base
  ],
  projectId,
  features: {
    email: true,
    analytics: true,
    socials: ['google', 'github', 'apple', 'facebook', 'x', 'discord'],
    connectMethodsOrder: ['email', 'social', 'wallet']
  },
  allWallets: 'SHOW'
});

// AppKit Provider Component
export const AppKitProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>{children}</>
  );
};

// Export configured instance
export { appKit };

// Custom connect button component
export const ConnectButton = () => {
  const { open } = useAppKit();

  return (
    <Button 
      onClick={() => open()}
      className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors"
    >
      Connect Wallet
    </Button>
  );
};

