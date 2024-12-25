'use client';

import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConnectButtonProps {
  className?: string;
  label?: string;
}

export function ConnectButton({ className, label = 'Connect Wallet' }: ConnectButtonProps) {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  if (isConnected && address) {
    return (
      <Button 
        onClick={() => open({ view: 'Account' })}
        variant="outline"
        className={cn("font-medium", className)}
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button 
      onClick={() => open()}
      className={cn("font-medium", className)}
    >
      {label}
    </Button>
  );
}