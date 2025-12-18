import { useState } from 'react';
import { Search, UserX, Edit } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { KYCBadge } from './KYCBadge';
import { useInvestorData, useIsVerified } from '../../hooks/useKYCRegistry';
import { formatDateShort, shortenAddress, isValidAddress } from '../../lib/format';

interface InvestorListProps {
  onUpdate?: (address: `0x${string}`) => void;
  onRevoke?: (address: `0x${string}`) => void;
}

export function InvestorList({ onUpdate, onRevoke }: InvestorListProps) {
  const [searchAddress, setSearchAddress] = useState('');
  const [searchedAddress, setSearchedAddress] = useState<`0x${string}` | undefined>();

  const { data: investor, isLoading } = useInvestorData(searchedAddress);
  const { data: isVerified } = useIsVerified(searchedAddress);

  const handleSearch = () => {
    if (isValidAddress(searchAddress)) {
      setSearchedAddress(searchAddress as `0x${string}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search by address (0x...)"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={!isValidAddress(searchAddress)}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {searchedAddress && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : investor && investor.isActive ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-mono text-sm text-gray-600">{searchedAddress}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {shortenAddress(searchedAddress)}
                  </p>
                </div>
                <KYCBadge level={investor.level} isVerified={isVerified} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="text-sm font-medium">{formatDateShort(investor.expiryDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Country Code</p>
                  <p className="text-sm font-medium">{investor.countryCode}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {onUpdate && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onUpdate(searchedAddress)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                )}
                {onRevoke && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onRevoke(searchedAddress)}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Investor not found or not active
            </div>
          )}
        </div>
      )}
    </div>
  );
}
