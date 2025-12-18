import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { useBalance, useCanTransfer, useInvestmentLimits } from '../../hooks/usePropertyToken';
import { useIsVerified } from '../../hooks/useKYCRegistry';
import { formatTokens, isValidAddress, formatTokensRaw } from '../../lib/format';

interface TransferFormProps {
  onPreview: (to: `0x${string}`, amount: bigint) => void;
}

export function TransferForm({ onPreview }: TransferFormProps) {
  const { address } = useAccount();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const { data: balance } = useBalance(address);
  const { data: isVerified } = useIsVerified(address);
  const { min, max } = useInvestmentLimits();

  const parsedAmount = amount ? parseUnits(amount, 18) : 0n;
  const validRecipient = isValidAddress(recipient) ? (recipient as `0x${string}`) : undefined;

  const { data: canTransferResult } = useCanTransfer(address, validRecipient, parsedAmount);

  const canTransfer = canTransferResult?.[0];
  const transferReason = canTransferResult?.[1];

  useEffect(() => {
    setError('');
  }, [recipient, amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAddress(recipient)) {
      setError('Please enter a valid address');
      return;
    }

    if (!amount || parsedAmount === 0n) {
      setError('Please enter an amount');
      return;
    }

    if (balance && parsedAmount > balance) {
      setError('Insufficient balance');
      return;
    }

    if (canTransfer === false) {
      setError(transferReason || 'Transfer not allowed');
      return;
    }

    onPreview(recipient as `0x${string}`, parsedAmount);
  };

  const handleMaxClick = () => {
    if (balance) {
      const maxAmount = balance > (max || 0n) ? max : balance;
      setAmount((Number(maxAmount || 0n) / 1e18).toString());
    }
  };

  if (!isVerified) {
    return (
      <Alert variant="warning">
        <p className="font-medium">KYC Required</p>
        <p className="text-sm mt-1">
          You need to complete KYC verification before you can transfer tokens.
        </p>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Recipient Address"
        placeholder="0x..."
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        error={recipient && !isValidAddress(recipient) ? 'Invalid address format' : undefined}
      />

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <button
            type="button"
            onClick={handleMaxClick}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            Max: {formatTokens(balance || 0n)}
          </button>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.000000000000000001"
        />
        {min && max && (
          <p className="text-xs text-gray-500 mt-1">
            Investment range: {formatTokensRaw(min)} - {formatTokensRaw(max)} tokens
          </p>
        )}
      </div>

      {validRecipient && parsedAmount > 0n && (
        <div className="p-3 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Transfer Check:</p>
          {canTransfer === true ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Transfer allowed</span>
            </div>
          ) : canTransfer === false ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{transferReason}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Checking...</span>
          )}
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" className="w-full" disabled={canTransfer === false}>
        Preview Transfer
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );
}
