import { useAccount } from 'wagmi';
import { ArrowDown, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { useBalance, useTokenValueIDR } from '../../hooks/usePropertyToken';
import { formatTokens, formatIDR } from '../../lib/format';

interface TransferPreviewProps {
  to: `0x${string}`;
  amount: bigint;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isPending?: boolean;
  isConfirming?: boolean;
  isError?: boolean;
  error?: Error | null;
}

export function TransferPreview({
  to,
  amount,
  onConfirm,
  onCancel,
  isLoading,
  isPending,
  isConfirming,
  isError,
  error,
}: TransferPreviewProps) {
  const { address } = useAccount();
  const { data: senderBalance } = useBalance(address);
  const { data: recipientBalance } = useBalance(to);
  const { data: tokenValue } = useTokenValueIDR();

  const transferValue = tokenValue ? (Number(amount) / 1e18) * Number(tokenValue) : 0;

  const newSenderBalance = senderBalance ? senderBalance - amount : 0n;
  const newRecipientBalance = recipientBalance ? recipientBalance + amount : amount;

  // Status message based on state
  const getStatusMessage = () => {
    if (isPending) {
      return {
        icon: <Loader2 className="h-5 w-5 animate-spin text-purple-500" />,
        text: 'Waiting for wallet confirmation...',
        subtext: 'Please confirm the transaction in your wallet',
      };
    }
    if (isConfirming) {
      return {
        icon: <Loader2 className="h-5 w-5 animate-spin text-blue-500" />,
        text: 'Transaction submitted',
        subtext: 'Waiting for blockchain confirmation...',
      };
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Confirm Transfer</h3>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Status indicator */}
        {statusMessage && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {statusMessage.icon}
              <div>
                <p className="font-medium text-gray-900">{statusMessage.text}</p>
                <p className="text-sm text-gray-500">{statusMessage.subtext}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {isError && error && (
          <Alert variant="error">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Transaction Failed</p>
                <p className="text-sm mt-1">
                  {error.message?.includes('User rejected')
                    ? 'Transaction was rejected in your wallet'
                    : error.message?.slice(0, 150) || 'An error occurred'}
                </p>
              </div>
            </div>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">From</p>
            <p className="font-mono text-sm break-all">{address}</p>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-gray-500">Current Balance:</span>
              <span className="font-medium">{formatTokens(senderBalance || 0n)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-red-600">
              <span>New Balance:</span>
              <span className="font-medium">{formatTokens(newSenderBalance)}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="p-2 bg-purple-100 rounded-full">
              <ArrowDown className="h-5 w-5 text-purple-600" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">To</p>
            <p className="font-mono text-sm break-all">{to}</p>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-gray-500">Current Balance:</span>
              <span className="font-medium">{formatTokens(recipientBalance || 0n)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-green-600">
              <span>New Balance:</span>
              <span className="font-medium">{formatTokens(newRecipientBalance)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-600">Amount</span>
            <span className="text-xl font-bold text-purple-900">{formatTokens(amount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-600">Value</span>
            <span className="font-medium text-purple-900">{formatIDR(transferValue)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            {isError ? 'Go Back' : 'Cancel'}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isPending ? (
              'Confirm in Wallet'
            ) : isConfirming ? (
              'Confirming...'
            ) : isError ? (
              'Try Again'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Transfer
              </>
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
