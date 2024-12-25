'use client';

import { useState } from 'react';
import { Address, IExecDataProtector } from '@iexec/dataprotector';
import { useAppKitProvider } from '@reown/appkit/react';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import { checkIsConnected, checkCurrentChain } from '@/lib/utils';

interface DataProtectionError {
  message: string;
  code?: string | number;
}

export const useDataProtection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [protectedData, setProtectedData] = useState<Address | ''>('');
  const { walletProvider } = useAppKitProvider('eip155');

  const handleError = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }
    if (typeof err === 'object' && err !== null && 'message' in err) {
      return (err as DataProtectionError).message;
    }
    return 'An unknown error occurred';
  };

  const getProvider = async () => {
    if (!walletProvider) {
      throw new Error('No wallet provider available');
    }
    return new BrowserProvider(walletProvider as Eip1193Provider);
  };

  const protectUserData = async (userEmail: string) => {
    setError(null);
    setLoading(true);

    try {
      checkIsConnected();
      await checkCurrentChain();

      const provider = await getProvider();
      const dataProtector = new IExecDataProtector(provider);
      
      const protectedDataResponse = await dataProtector.core.protectData({
        data: { email: userEmail },
        name: `Protected email for ${userEmail}`,
      });

      setProtectedData(protectedDataResponse.address);
      return protectedDataResponse.address;

    } catch (err: unknown) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const grantAccess = async (protectedDataAddress: string, recipientAddress: string) => {
    setError(null);
    setLoading(true);

    try {
      checkIsConnected();
      await checkCurrentChain();

      const provider = await getProvider();
      const dataProtector = new IExecDataProtector(provider);
      
      await dataProtector.core.grantAccess({
        protectedData: protectedDataAddress,
        authorizedUser: recipientAddress,
        authorizedApp: 'web3mail.apps.iexec.eth',
        numberOfAccess: 1,
      });

    } catch (err: unknown) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    protectUserData,
    grantAccess,
    protectedData,
    loading,
    error,
  };
};