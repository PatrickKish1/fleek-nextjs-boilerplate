'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAppKitAuth } from '@/lib/hooks/useAppKitAuth';
import { IExecDataProtector } from '@iexec/dataprotector';
import { useDataProtection } from '@/lib/hooks/useDataProtectioon';
import { db } from '@/firebase.config';
import { BrowserProvider, Eip1193Provider } from 'ethers';

export const ChatInitializer = () => {
  const { getUserInfo, address, isConnected, walletProvider } = useAppKitAuth();
  const { loading: protectionLoading, error: protectionError } = useDataProtection();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (initialized || !address || !isConnected || !walletProvider) return;
      
      try {
        setLoading(true);
        const userInfo = await getUserInfo();
        if (!userInfo) return;

        // Check if user already exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', address));
        
        if (!userDoc.exists()) {
          let protectedDataAddress: string | undefined;
          
          // Only protect email if it exists
          if (userInfo.email) {
            const provider = new BrowserProvider(walletProvider as Eip1193Provider);
            const dataProtector = new IExecDataProtector(provider);
            try {
              const protectedData = await dataProtector.core.protectData({
                data: { email: userInfo.email },
                name: `Protected email for ${address}`,
              });
              protectedDataAddress = protectedData.address;
            } catch (protectError) {
              console.error('Failed to protect email:', protectError);
              // Continue without protected email
            }
          }

          // Store user data in Firestore
          await setDoc(doc(db, 'users', address), {
            address: address,
            email: userInfo.email,
            protectedDataAddress,
            isWeb3MailEnabled: !!protectedDataAddress,
            createdAt: Date.now(),
            lastSeen: Date.now(),
            socialLoginInfo: userInfo.socialInfo || null
          });
        } else {
          // Update last seen
          await setDoc(doc(db, 'users', address), {
            lastSeen: Date.now()
          }, { merge: true });
        }
        
        setInitialized(true);
      } catch (err) {
        console.error('Error initializing user:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize user');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [getUserInfo, address, isConnected, initialized, walletProvider]);

  if (loading || protectionLoading) {
    return <div className="text-center py-4">Initializing secure chat...</div>;
  }

  if (error || protectionError) {
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error || protectionError}
      </div>
    );
  }

  return null;
};