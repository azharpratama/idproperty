import { useAccount } from 'wagmi';
import { Calendar, Globe, AlertTriangle } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { KYCBadge } from './KYCBadge';
import { useInvestorData, useIsVerified } from '../../hooks/useKYCRegistry';
import { formatDate, daysUntilExpiry, isKYCExpired } from '../../lib/format';
import { LoadingScreen } from '../ui/Spinner';

const COUNTRY_CODES: Record<number, string> = {
  360: 'Indonesia',
  840: 'United States',
  826: 'United Kingdom',
  702: 'Singapore',
};

export function KYCStatusCard() {
  const { address, isConnected } = useAccount();
  const { data: investor, isLoading } = useInvestorData(address);
  const { data: isVerified } = useIsVerified(address);

  if (!isConnected) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            Connect your wallet to view KYC status
          </div>
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <LoadingScreen message="Loading KYC status..." />
        </CardBody>
      </Card>
    );
  }

  if (!investor || !investor.isActive) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Registered</h3>
            <p className="text-gray-500">
              Your wallet is not registered in the KYC system. Please contact the admin to complete KYC verification.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const expired = isKYCExpired(investor.expiryDate);
  const daysRemaining = daysUntilExpiry(investor.expiryDate);
  const showExpiryWarning = !expired && daysRemaining <= 30;

  return (
    <Card>
      <CardBody className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">KYC Status</h3>
          <KYCBadge level={investor.level} isVerified={isVerified} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className={`font-medium ${expired ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(investor.expiryDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-medium text-gray-900">
                {COUNTRY_CODES[investor.countryCode] || `Code: ${investor.countryCode}`}
              </p>
            </div>
          </div>
        </div>

        {expired && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">KYC Expired</p>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Your KYC verification has expired. Please contact admin to renew.
            </p>
          </div>
        )}

        {showExpiryWarning && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Expiring Soon</p>
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              Your KYC will expire in {daysRemaining} days. Contact admin to renew.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
