'use client';

import React from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppKitProvider } from '../appkitConnectKit';




// Define the connection state interface
interface ConnectionState {
  isWalletConnected: boolean;
  walletAddress: string;
  userId: string;
  setWalletConnected: (connected: boolean) => void;
  setWalletAddress: (address: string) => void;
  setUserId: (id: string) => void;
}

// Create persistent store
export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set) => ({
      isWalletConnected: false,
      walletAddress: '',
      userId: '',
      setWalletConnected: (connected) => set({ isWalletConnected: connected }),
      setWalletAddress: (address) => set({ walletAddress: address }),
      setUserId: (id) => set({ userId: id })
    }),
    {
      name: 'connection-storage',
    }
  )
);

// Create the persistence provider component
export const ConnectionPersistenceProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const { isConnected, address } = useAppKitAccount();
  const { setWalletConnected, setWalletAddress, setUserId } = useConnectionStore();

  React.useEffect(() => {
    // Sync AppKit connection state with Zustand store
    setWalletConnected(isConnected);
    if (isConnected && address) {
      setWalletAddress(address);
      setUserId(address); // For wallet connections, use address as userId
    } else {
      setWalletAddress('');
      setUserId(''); // Clear userId on disconnect
    }
  }, [isConnected, address, setWalletConnected, setWalletAddress, setUserId]);

  return <>{children}</>;
};

// Combined provider for both AppKit and Persistence
export const CombinedProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppKitProvider>
      <ConnectionPersistenceProvider>
        {children}
      </ConnectionPersistenceProvider>
    </AppKitProvider>
  );
};