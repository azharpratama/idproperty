import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Wallet, PieChart, ArrowRight, Snowflake } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  useBalance,
  useOwnershipPercent,
  useIsFrozen,
  useTokenValueIDR,
} from '../../hooks/usePropertyToken';
import { formatTokens, formatIDR, formatPercent } from '../../lib/format';
import { LoadingScreen } from '../ui/Spinner';

export function OwnershipCard() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: isLoadingBalance } = useBalance(address);
  const { data: ownership, isLoading: isLoadingOwnership } = useOwnershipPercent(address);
  const { data: isFrozen, isLoading: isLoadingFrozen } = useIsFrozen(address);
  const { data: tokenValue } = useTokenValueIDR();

  const isLoading = isLoadingBalance || isLoadingOwnership || isLoadingFrozen;

  if (!isConnected) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Wallet</h3>
            <p className="text-gray-500">Connect your wallet to view your holdings</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <LoadingScreen message="Loading holdings..." />
        </CardBody>
      </Card>
    );
  }

  const portfolioValue =
    balance && tokenValue ? (Number(balance) / 1e18) * Number(tokenValue) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Your Holdings</h3>
          {isFrozen && (
            <Badge variant="danger">
              <Snowflake className="h-3 w-3 mr-1" />
              Frozen
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Balance</span>
            </div>
            <p className="text-xl font-bold text-purple-900">
              {formatTokens(balance || 0n)}
            </p>
          </div>

          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="flex items-center gap-2 text-pink-600 mb-1">
              <PieChart className="h-4 w-4" />
              <span className="text-sm">Ownership</span>
            </div>
            <p className="text-xl font-bold text-pink-900">
              {formatPercent(ownership || 0n)}
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatIDR(portfolioValue)}</p>
        </div>

        {!isFrozen && balance && balance > 0n && (
          <Link to="/transfer">
            <Button className="w-full">
              Transfer Tokens
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}

        {isFrozen && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            Your account is frozen. Contact admin for assistance.
          </div>
        )}

        {(!balance || balance === 0n) && !isFrozen && (
          <p className="text-center text-sm text-gray-500">
            You don't own any tokens yet
          </p>
        )}
      </CardBody>
    </Card>
  );
}
