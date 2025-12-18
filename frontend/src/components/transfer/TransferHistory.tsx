import { useAccount } from 'wagmi';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { shortenAddress, formatTokens } from '../../lib/format';
import { mantleSepolia } from '../../config/chains';

interface Transfer {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  timestamp?: number;
}

interface TransferHistoryProps {
  transfers?: Transfer[];
}

export function TransferHistory({ transfers = [] }: TransferHistoryProps) {
  const { address } = useAccount();

  if (transfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Transfers</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            No transfers found
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Recent Transfers</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-gray-100">
          {transfers.map((tx) => {
            const isSent = tx.from.toLowerCase() === address?.toLowerCase();

            return (
              <div key={tx.hash} className="p-4 flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    isSent ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  {isSent ? (
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {isSent ? 'Sent' : 'Received'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {isSent ? `To: ${shortenAddress(tx.to)}` : `From: ${shortenAddress(tx.from)}`}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      isSent ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {isSent ? '-' : '+'}
                    {formatTokens(tx.value)}
                  </p>
                </div>

                <a
                  href={`${mantleSepolia.blockExplorers.default.url}/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
