import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CombinedProvider } from '@/lib/hooks/usePersistence';

export const runtime = 'edge';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: 'PULSE TRADE AI',
  description: 'Your OP trading platform that super charges your trading experience.',
  applicationName: 'Pulse Trade AI Platform',
  icons: "/logo.png"
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <CombinedProvider>
            {children}
          </CombinedProvider>
      </body>
    </html>
  );
}