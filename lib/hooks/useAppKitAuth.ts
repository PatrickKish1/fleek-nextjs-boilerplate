'use client';

import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { BrowserProvider, Eip1193Provider } from 'ethers';

interface SocialInfo {
  provider: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  userId: string;
  accessToken?: string;
  profileUrl?: string;
}

interface AppKitAuthUserInfo {
  address: string;
  email?: string;
  wallets: string[];
  socialInfo?: SocialInfo;
}

interface AppKitAuthResponse {
  email?: string;
  wallets?: string[];
  social?: SocialInfo;
}

export const useAppKitAuth = () => {
  const { address, isConnected, caipAddress, status } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const getUserInfo = async (): Promise<AppKitAuthUserInfo | null> => {
    if (!isConnected || !address || !walletProvider) return null;
    
    try {
      const provider = new BrowserProvider(walletProvider as Eip1193Provider);
      
      // Get user info directly from the provider
      const emailInfo = await provider.send('eth_userInfo', []);
      const socialInfo = await provider.send('eth_socialInfo', []);
      
      const userInfo: AppKitAuthResponse = {
        email: emailInfo,
        wallets: [address],
        social: socialInfo
      };
      
      return {
        address: address,
        email: userInfo?.email,
        wallets: userInfo?.wallets || [address],
        socialInfo: userInfo?.social
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return {
        address: address,
        wallets: [address]
      };
    }
  };

  return {
    getUserInfo,
    isConnected,
    address,
    caipAddress,
    status,
    walletProvider: walletProvider as Eip1193Provider
  };
};