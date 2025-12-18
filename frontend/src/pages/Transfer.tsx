import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { Wallet, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TransferForm } from '../components/transfer/TransferForm';
import { TransferPreview } from '../components/transfer/TransferPreview';
import { TransferHistory } from '../components/transfer/TransferHistory';
import { Alert } from '../components/ui/Alert';
import { useTransfer } from '../hooks/usePropertyTokenWrite';
import { useIsVerified } from '../hooks/useKYCRegistry';
import { mantleSepolia } from '../config/chains';

export function Transfer() {
  const { address, isConnected } = useAccount();
  const { data: isVerified } = useIsVerified(address);
  const [previewData, setPreviewData] = useState<{
    to: `0x${string}`;
    amount: bigint;
  } | null>(null);

  const {
    transfer,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    hash,
    reset
  } = useTransfer();

  // Handle success - show toast notification
  // Note: previewData is reset via handleNewTransfer when user clicks "Make Another Transfer"
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success(
        <div>
          <p className="font-medium">Transfer successful!</p>
          <a
            href={`${mantleSepolia.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:underline flex items-center gap-1"
          >
            View transaction
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>,
        { duration: 6000 }
      );
    }
  }, [isSuccess, hash]);

  // Handle error
  useEffect(() => {
    if (isError && error) {
      const errorMessage = error.message?.includes('User rejected')
        ? 'Transaction rejected by user'
        : error.message?.slice(0, 100) || 'Transfer failed';
      toast.error(errorMessage);
    }
  }, [isError, error]);

  const handlePreview = (to: `0x${string}`, amount: bigint) => {
    reset(); // Reset any previous state
    setPreviewData({ to, amount });
  };

  const handleConfirm = () => {
    if (previewData) {
      transfer(previewData.to, previewData.amount);
    }
  };

  const handleCancel = () => {
    reset();
    setPreviewData(null);
  };

  const handleNewTransfer = () => {
    reset();
    setPreviewData(null);
  };

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
                Connect your wallet to transfer tokens.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Tokens</h1>
          <p className="text-gray-600">
            Send property tokens to other verified investors.
          </p>
        </div>
        <Alert variant="warning">
          <p className="font-medium">KYC Verification Required</p>
          <p className="text-sm mt-1">
            You need to complete KYC verification before you can transfer tokens.
            Please contact the admin to get verified.
          </p>
        </Alert>
      </div>
    );
  }

  // Success state
  if (isSuccess && hash) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Tokens</h1>
          <p className="text-gray-600">
            Send property tokens to other verified investors.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardBody>
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Transfer Successful!
                </h3>
                <p className="text-gray-500 mb-4">
                  Your tokens have been transferred successfully.
                </p>
                <a
                  href={`${mantleSepolia.blockExplorers.default.url}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
                >
                  View on Explorer
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Button onClick={handleNewTransfer} className="w-full">
                  Make Another Transfer
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Tokens</h1>
        <p className="text-gray-600">
          Send property tokens to other verified investors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {previewData ? (
            <TransferPreview
              to={previewData.to}
              amount={previewData.amount}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              isLoading={isPending || isConfirming}
              isPending={isPending}
              isConfirming={isConfirming}
              isError={isError}
              error={error}
            />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Send Tokens</h3>
                </div>
              </CardHeader>
              <CardBody>
                <TransferForm onPreview={handlePreview} />
              </CardBody>
            </Card>
          )}
        </div>

        <div>
          <TransferHistory />
        </div>
      </div>
    </div>
  );
}
