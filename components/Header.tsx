'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConnectButton } from './ConnectButton';

const Header = () => {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/tutorials', label: 'Tutorials' },
    { href: '/chats', label: 'Chats' },
    { href: '/ai-chats', label: 'AI Chat' },
  ];

  const handleAccountOpen = () => {
    open({ view: 'Account' });
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/75">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="Pulse Trade Logo" 
              width={50} 
              height={50} 
              className="h-8 w-8 md:h-10 md:w-10"
              priority
            />
            <span className="text-lg md:text-xl font-bold text-purple-600">Pulse Trade</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-grow justify-center max-w-2xl mx-4">
            <div className="rounded-md backdrop-blur-md bg-white/30 px-2 py-1.5 shadow-sm border border-white/50 flex flex-wrap justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-2 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 rounded-md hover:text-purple-600 hover:bg-gray-200 transition-all duration-200 group whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-4">
            {/* Desktop Wallet Button */}
            <div className="hidden lg:block">
              {isConnected ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                      Connected <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onSelect={handleAccountOpen}>
                      Account Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <ConnectButton label='Connect Wallet' className='bg-blue-800 text-lg hover:bg-blue-900 py-5' />
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-12 w-12">
                    <Menu className="h-8 w-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mr-2">
                  {navLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="w-full cursor-pointer">
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  
                  {isConnected ? (
                    <DropdownMenuItem onSelect={handleAccountOpen}>
                      Account Details
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <ConnectButton label="Connect Wallet" className="w-full bg-blue-800 hover:bg-blue-900" />
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;