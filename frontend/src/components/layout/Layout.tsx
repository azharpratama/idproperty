import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { AlertTriangle } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useIsVerified } from '../../hooks/useKYCRegistry';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { address, isConnected } = useAccount();
  const { data: isVerified } = useIsVerified(address);

  const showKYCBanner = isConnected && address && isVerified === false;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {showKYCBanner && (
        <div className="bg-yellow-50 border-b border-yellow-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                Your wallet is not KYC verified. Contact admin to complete verification before trading.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
