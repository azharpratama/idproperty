import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import { Wallet, Shield } from 'lucide-react';
import { KYCStatusCard } from '../components/kyc/KYCStatusCard';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAdmin } from '../hooks/useAdmin';

export function KYCStatus() {
  const { isConnected } = useAccount();
  const { isAdmin } = useAdmin();

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Wallet className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-500">
                Connect your wallet to view your KYC status.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Status</h1>
          <p className="text-gray-600">
            View your investor verification status.
          </p>
        </div>
        {isAdmin && (
          <Link to="/admin">
            <Button variant="secondary">
              <Shield className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </Link>
        )}
      </div>

      <KYCStatusCard />

      <Card>
        <CardBody>
          <h3 className="font-semibold text-gray-900 mb-4">About KYC Verification</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              KYC (Know Your Customer) verification is required to comply with Indonesian
              regulations for securities trading. All investors must complete KYC before
              they can receive or transfer property tokens.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="font-medium text-yellow-800 mb-1">Basic (KTP)</p>
                <p className="text-yellow-700 text-xs">
                  Requires valid Indonesian ID card (KTP)
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">Verified (KTP + NPWP)</p>
                <p className="text-blue-700 text-xs">
                  Requires ID card and tax ID (NPWP)
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg md:col-span-2">
                <p className="font-medium text-green-800 mb-1">Accredited Investor</p>
                <p className="text-green-700 text-xs">
                  Full verification with proof of accredited investor status
                </p>
              </div>
            </div>
            <p>
              To complete KYC verification or upgrade your level, please contact the
              platform administrator.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
