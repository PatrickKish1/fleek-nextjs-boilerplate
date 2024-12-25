'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAppKitAccount } from '@reown/appkit/react';
import React, { useEffect } from 'react';

interface ConnectionState {
  isWalletConnected: boolean;
  walletAddress: string;
  userId: string;
  setWalletConnected: (connected: boolean) => void;
  setWalletAddress: (address: string) => void;
  setUserId: (id: string) => void;
}

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

export const ConnectionPersistenceProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const { isConnected, address } = useAppKitAccount();
  const { setWalletConnected, setWalletAddress, setUserId } = useConnectionStore();

  useEffect(() => {
    // Sync AppKit connection state with Zustand store
    setWalletConnected(isConnected);
    
    if (isConnected && address) {
      setWalletAddress(address);
      // For wallet connections, use the address as userId
      setUserId(address);
    } else {
      setWalletAddress('');
      // Clear userId on disconnect
      setUserId('');
    }
  }, [isConnected, address, setWalletConnected, setWalletAddress, setUserId]);

  return <>{children}</>;
};

export default useConnectionStore;