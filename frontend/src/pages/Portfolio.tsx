import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import { Wallet, ArrowRight } from 'lucide-react';
import { OwnershipCard } from '../components/property/OwnershipCard';
import { PropertyCard } from '../components/property/PropertyCard';
import { TransferHistory } from '../components/transfer/TransferHistory';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

export function Portfolio() {
  const { isConnected } = useAccount();

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
              <p className="text-gray-500 mb-6">
                Connect your wallet to view your portfolio and holdings.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolio</h1>
          <p className="text-gray-600">
            View your token holdings and transaction history.
          </p>
        </div>
        <Link to="/transfer">
          <Button>
            Transfer Tokens
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OwnershipCard />
        <PropertyCard />
      </div>

      <TransferHistory />
    </div>
  );
}
