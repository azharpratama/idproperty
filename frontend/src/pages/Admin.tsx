import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import toast from 'react-hot-toast';
import {
  Shield,
  Users,
  Coins,
  Snowflake,
  UserPlus,
  UserX,
  Edit,
  Lock,
  Unlock,
  Send,
  FileText,
  Settings,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { StatsCard } from '../components/stats/StatsCard';
import { InvestorList } from '../components/kyc/InvestorList';
import { useAdmin } from '../hooks/useAdmin';
import { useTotalInvestors } from '../hooks/useKYCRegistry';
import { useTotalSupply, usePropertyInfo, useInvestmentLimits } from '../hooks/usePropertyToken';
import {
  useRegisterInvestor,
  useUpdateInvestor,
  useRevokeInvestor,
} from '../hooks/useKYCRegistryWrite';
import {
  useFreezeAccount,
  useUnfreezeAccount,
  useForceTransfer,
  useSetLegalDocument,
  useSetInvestmentLimits,
} from '../hooks/usePropertyTokenWrite';
import { KYCLevel } from '../types';
import { formatIDR, formatTokensRaw, isValidAddress } from '../lib/format';
import { LoadingScreen } from '../components/ui/Spinner';
import { mantleSepolia } from '../config/chains';

type Tab = 'kyc' | 'token' | 'frozen';

// Helper to get user-friendly error message
function getErrorMessage(error: Error | null): string {
  if (!error) return 'Transaction failed';
  if (error.message?.includes('User rejected')) return 'Transaction rejected by user';
  if (error.message?.includes('insufficient funds')) return 'Insufficient funds for gas';
  if (error.message?.includes('Already registered')) return 'Investor is already registered';
  if (error.message?.includes('Not registered')) return 'Investor is not registered';
  if (error.message?.includes('Only admin')) return 'Only admin can perform this action';
  return error.message?.slice(0, 100) || 'Transaction failed';
}

// Helper component for showing transaction status
function TransactionStatus({
  isPending,
  isConfirming,
  isSuccess,
  isError,
  error,
  hash,
  successMessage,
  onReset,
}: {
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash?: string;
  successMessage: string;
  onReset: () => void;
}) {
  if (isSuccess && hash) {
    return (
      <Alert variant="success">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
          <a
            href={`${mantleSepolia.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-800 flex items-center gap-1"
          >
            View <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Alert>
    );
  }

  if (isError && error) {
    return (
      <Alert variant="error" onDismiss={onReset}>
        {getErrorMessage(error)}
      </Alert>
    );
  }

  if (isPending) {
    return (
      <Alert variant="info">
        Waiting for wallet confirmation...
      </Alert>
    );
  }

  if (isConfirming) {
    return (
      <Alert variant="info">
        Transaction submitted. Waiting for confirmation...
      </Alert>
    );
  }

  return null;
}

export function Admin() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { isAdmin, isKYCAdmin, isTokenAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('kyc');

  const { data: totalInvestors, refetch: refetchInvestors } = useTotalInvestors();
  const { data: totalSupply } = useTotalSupply();
  const { data: property } = usePropertyInfo();
  const { min, max } = useInvestmentLimits();

  const [registerForm, setRegisterForm] = useState<{
    address: string;
    level: KYCLevel;
    countryCode: number;
    validDays: number;
  }>({
    address: '',
    level: KYCLevel.BASIC,
    countryCode: 360,
    validDays: 365,
  });

  const [updateForm, setUpdateForm] = useState<{
    address: string;
    level: KYCLevel;
  }>({
    address: '',
    level: KYCLevel.BASIC,
  });

  const [freezeForm, setFreezeForm] = useState({
    address: '',
    reason: '',
  });

  const [unfreezeAddress, setUnfreezeAddress] = useState('');

  const [forceTransferForm, setForceTransferForm] = useState({
    from: '',
    to: '',
    amount: '',
    reason: '',
  });

  const [legalDocument, setLegalDocument] = useState('');

  const [limitsForm, setLimitsForm] = useState({
    min: '',
    max: '',
  });

  const registerInvestor = useRegisterInvestor();
  const updateInvestor = useUpdateInvestor();
  const revokeInvestor = useRevokeInvestor();
  const freezeAccount = useFreezeAccount();
  const unfreezeAccount = useUnfreezeAccount();
  const forceTransfer = useForceTransfer();
  const setLegalDoc = useSetLegalDocument();
  const setInvestmentLimits = useSetInvestmentLimits();

  useEffect(() => {
    if (isConnected && !isAdmin) {
      navigate('/');
    }
  }, [isConnected, isAdmin, navigate]);

  // Handle success states with toasts and form resets
  useEffect(() => {
    if (registerInvestor.isSuccess) {
      toast.success('Investor registered successfully!');
      setRegisterForm({ address: '', level: KYCLevel.BASIC, countryCode: 360, validDays: 365 });
      refetchInvestors();
    }
  }, [registerInvestor.isSuccess, refetchInvestors]);

  useEffect(() => {
    if (updateInvestor.isSuccess) {
      toast.success('Investor updated successfully!');
      setUpdateForm({ address: '', level: KYCLevel.BASIC });
    }
  }, [updateInvestor.isSuccess]);

  useEffect(() => {
    if (revokeInvestor.isSuccess) {
      toast.success('Investor revoked successfully!');
      setUpdateForm({ address: '', level: KYCLevel.BASIC });
      refetchInvestors();
    }
  }, [revokeInvestor.isSuccess, refetchInvestors]);

  useEffect(() => {
    if (freezeAccount.isSuccess) {
      toast.success('Account frozen successfully!');
      setFreezeForm({ address: '', reason: '' });
    }
  }, [freezeAccount.isSuccess]);

  useEffect(() => {
    if (unfreezeAccount.isSuccess) {
      toast.success('Account unfrozen successfully!');
      setUnfreezeAddress('');
    }
  }, [unfreezeAccount.isSuccess]);

  useEffect(() => {
    if (forceTransfer.isSuccess) {
      toast.success('Force transfer completed!');
      setForceTransferForm({ from: '', to: '', amount: '', reason: '' });
    }
  }, [forceTransfer.isSuccess]);

  useEffect(() => {
    if (setLegalDoc.isSuccess) {
      toast.success('Legal document updated!');
      setLegalDocument('');
    }
  }, [setLegalDoc.isSuccess]);

  useEffect(() => {
    if (setInvestmentLimits.isSuccess) {
      toast.success('Investment limits updated!');
      setLimitsForm({ min: '', max: '' });
    }
  }, [setInvestmentLimits.isSuccess]);

  // Handle errors with toasts
  useEffect(() => {
    if (registerInvestor.isError && registerInvestor.error) {
      toast.error(getErrorMessage(registerInvestor.error));
    }
  }, [registerInvestor.isError, registerInvestor.error]);

  useEffect(() => {
    if (updateInvestor.isError && updateInvestor.error) {
      toast.error(getErrorMessage(updateInvestor.error));
    }
  }, [updateInvestor.isError, updateInvestor.error]);

  useEffect(() => {
    if (revokeInvestor.isError && revokeInvestor.error) {
      toast.error(getErrorMessage(revokeInvestor.error));
    }
  }, [revokeInvestor.isError, revokeInvestor.error]);

  useEffect(() => {
    if (freezeAccount.isError && freezeAccount.error) {
      toast.error(getErrorMessage(freezeAccount.error));
    }
  }, [freezeAccount.isError, freezeAccount.error]);

  useEffect(() => {
    if (unfreezeAccount.isError && unfreezeAccount.error) {
      toast.error(getErrorMessage(unfreezeAccount.error));
    }
  }, [unfreezeAccount.isError, unfreezeAccount.error]);

  useEffect(() => {
    if (forceTransfer.isError && forceTransfer.error) {
      toast.error(getErrorMessage(forceTransfer.error));
    }
  }, [forceTransfer.isError, forceTransfer.error]);

  useEffect(() => {
    if (setLegalDoc.isError && setLegalDoc.error) {
      toast.error(getErrorMessage(setLegalDoc.error));
    }
  }, [setLegalDoc.isError, setLegalDoc.error]);

  useEffect(() => {
    if (setInvestmentLimits.isError && setInvestmentLimits.error) {
      toast.error(getErrorMessage(setInvestmentLimits.error));
    }
  }, [setInvestmentLimits.isError, setInvestmentLimits.error]);

  if (!isConnected) {
    return <LoadingScreen message="Checking authorization..." />;
  }

  if (!isAdmin) {
    return null;
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(registerForm.address)) {
      toast.error('Please enter a valid wallet address');
      return;
    }
    registerInvestor.reset();
    registerInvestor.registerInvestor(
      registerForm.address as `0x${string}`,
      registerForm.level,
      registerForm.countryCode,
      BigInt(registerForm.validDays)
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(updateForm.address)) {
      toast.error('Please enter a valid wallet address');
      return;
    }
    updateInvestor.reset();
    updateInvestor.updateInvestor(
      updateForm.address as `0x${string}`,
      updateForm.level
    );
  };

  const handleRevoke = () => {
    if (!isValidAddress(updateForm.address)) {
      toast.error('Please enter a valid wallet address');
      return;
    }
    revokeInvestor.reset();
    revokeInvestor.revokeInvestor(updateForm.address as `0x${string}`);
  };

  const handleFreeze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(freezeForm.address)) {
      toast.error('Please enter a valid wallet address');
      return;
    }
    if (!freezeForm.reason.trim()) {
      toast.error('Please enter a reason for freezing');
      return;
    }
    freezeAccount.reset();
    freezeAccount.freezeAccount(
      freezeForm.address as `0x${string}`,
      freezeForm.reason
    );
  };

  const handleUnfreeze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(unfreezeAddress)) {
      toast.error('Please enter a valid wallet address');
      return;
    }
    unfreezeAccount.reset();
    unfreezeAccount.unfreezeAccount(unfreezeAddress as `0x${string}`);
  };

  const handleForceTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(forceTransferForm.from)) {
      toast.error('Please enter a valid "From" address');
      return;
    }
    if (!isValidAddress(forceTransferForm.to)) {
      toast.error('Please enter a valid "To" address');
      return;
    }
    if (!forceTransferForm.amount || parseFloat(forceTransferForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!forceTransferForm.reason.trim()) {
      toast.error('Please enter a reason for force transfer');
      return;
    }
    forceTransfer.reset();
    forceTransfer.forceTransfer(
      forceTransferForm.from as `0x${string}`,
      forceTransferForm.to as `0x${string}`,
      parseUnits(forceTransferForm.amount, 18),
      forceTransferForm.reason
    );
  };

  const handleSetLegalDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalDocument.trim()) {
      toast.error('Please enter an IPFS hash');
      return;
    }
    setLegalDoc.reset();
    setLegalDoc.setLegalDocument(legalDocument);
  };

  const handleSetLimits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitsForm.min || parseFloat(limitsForm.min) < 0) {
      toast.error('Please enter a valid minimum');
      return;
    }
    if (!limitsForm.max || parseFloat(limitsForm.max) <= 0) {
      toast.error('Please enter a valid maximum');
      return;
    }
    if (parseFloat(limitsForm.min) >= parseFloat(limitsForm.max)) {
      toast.error('Minimum must be less than maximum');
      return;
    }
    setInvestmentLimits.reset();
    setInvestmentLimits.setInvestmentLimits(
      parseUnits(limitsForm.min, 18),
      parseUnits(limitsForm.max, 18)
    );
  };

  const tabs = [
    { id: 'kyc' as Tab, label: 'KYC Management', icon: Users, show: isKYCAdmin },
    { id: 'token' as Tab, label: 'Token Management', icon: Coins, show: isTokenAdmin },
    { id: 'frozen' as Tab, label: 'Account Actions', icon: Snowflake, show: isTokenAdmin },
  ].filter((tab) => tab.show);

  const isRegisterBusy = registerInvestor.isPending || registerInvestor.isConfirming;
  const isUpdateBusy = updateInvestor.isPending || updateInvestor.isConfirming;
  const isRevokeBusy = revokeInvestor.isPending || revokeInvestor.isConfirming;
  const isFreezeBusy = freezeAccount.isPending || freezeAccount.isConfirming;
  const isUnfreezeBusy = unfreezeAccount.isPending || unfreezeAccount.isConfirming;
  const isForceTransferBusy = forceTransfer.isPending || forceTransfer.isConfirming;
  const isLegalDocBusy = setLegalDoc.isPending || setLegalDoc.isConfirming;
  const isLimitsBusy = setInvestmentLimits.isPending || setInvestmentLimits.isConfirming;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg gradient-primary">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage KYC and token operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Investors"
          value={totalInvestors?.toString() || '0'}
          icon={Users}
          color="blue"
        />
        <StatsCard
          label="Total Supply"
          value={formatTokensRaw(totalSupply || 0n)}
          icon={Coins}
          color="purple"
        />
        <StatsCard
          label="Property Value"
          value={formatIDR(property?.[2] || 0n)}
          icon={Settings}
          color="green"
        />
        <StatsCard
          label="Investment Range"
          value={`${formatTokensRaw(min || 0n)} - ${formatTokensRaw(max || 0n)}`}
          icon={Settings}
          color="pink"
        />
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'kyc' && isKYCAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Register New Investor</h3>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleRegister} className="space-y-4">
                <TransactionStatus
                  isPending={registerInvestor.isPending}
                  isConfirming={registerInvestor.isConfirming}
                  isSuccess={registerInvestor.isSuccess}
                  isError={registerInvestor.isError}
                  error={registerInvestor.error}
                  hash={registerInvestor.hash}
                  successMessage="Investor registered!"
                  onReset={registerInvestor.reset}
                />
                <Input
                  label="Wallet Address"
                  placeholder="0x..."
                  value={registerForm.address}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, address: e.target.value })
                  }
                  disabled={isRegisterBusy}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KYC Level
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:bg-gray-100"
                    value={registerForm.level}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        level: Number(e.target.value) as KYCLevel,
                      })
                    }
                    disabled={isRegisterBusy}
                  >
                    <option value={KYCLevel.BASIC}>Basic (KTP)</option>
                    <option value={KYCLevel.VERIFIED}>Verified (KTP + NPWP)</option>
                    <option value={KYCLevel.ACCREDITED}>Accredited Investor</option>
                  </select>
                </div>
                <Input
                  label="Country Code"
                  type="number"
                  value={registerForm.countryCode}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      countryCode: parseInt(e.target.value) || 0,
                    })
                  }
                  helperText="360 = Indonesia"
                  disabled={isRegisterBusy}
                />
                <Input
                  label="Valid Days"
                  type="number"
                  value={registerForm.validDays}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      validDays: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={isRegisterBusy}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isRegisterBusy}
                  disabled={isRegisterBusy}
                >
                  {registerInvestor.isPending
                    ? 'Confirm in Wallet...'
                    : registerInvestor.isConfirming
                      ? 'Registering...'
                      : 'Register Investor'}
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Update / Revoke Investor</h3>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleUpdate} className="space-y-4 mb-6">
                <TransactionStatus
                  isPending={updateInvestor.isPending || revokeInvestor.isPending}
                  isConfirming={updateInvestor.isConfirming || revokeInvestor.isConfirming}
                  isSuccess={updateInvestor.isSuccess || revokeInvestor.isSuccess}
                  isError={updateInvestor.isError || revokeInvestor.isError}
                  error={updateInvestor.error || revokeInvestor.error}
                  hash={updateInvestor.hash || revokeInvestor.hash}
                  successMessage={updateInvestor.isSuccess ? "Investor updated!" : "Investor revoked!"}
                  onReset={() => {
                    updateInvestor.reset();
                    revokeInvestor.reset();
                  }}
                />
                <Input
                  label="Wallet Address"
                  placeholder="0x..."
                  value={updateForm.address}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, address: e.target.value })
                  }
                  disabled={isUpdateBusy || isRevokeBusy}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New KYC Level
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:bg-gray-100"
                    value={updateForm.level}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        level: Number(e.target.value) as KYCLevel,
                      })
                    }
                    disabled={isUpdateBusy || isRevokeBusy}
                  >
                    <option value={KYCLevel.BASIC}>Basic (KTP)</option>
                    <option value={KYCLevel.VERIFIED}>Verified (KTP + NPWP)</option>
                    <option value={KYCLevel.ACCREDITED}>Accredited Investor</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={isUpdateBusy}
                    disabled={isUpdateBusy || isRevokeBusy}
                  >
                    {updateInvestor.isPending
                      ? 'Confirm...'
                      : updateInvestor.isConfirming
                        ? 'Updating...'
                        : 'Update Level'}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    className="flex-1"
                    isLoading={isRevokeBusy}
                    disabled={isUpdateBusy || isRevokeBusy}
                    onClick={handleRevoke}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    {revokeInvestor.isPending
                      ? 'Confirm...'
                      : revokeInvestor.isConfirming
                        ? 'Revoking...'
                        : 'Revoke'}
                  </Button>
                </div>
              </form>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Search Investor</h4>
                <InvestorList
                  onUpdate={(addr) => setUpdateForm({ ...updateForm, address: addr })}
                  onRevoke={(addr) => {
                    revokeInvestor.reset();
                    revokeInvestor.revokeInvestor(addr);
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'token' && isTokenAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Investment Limits</h3>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSetLimits} className="space-y-4">
                <TransactionStatus
                  isPending={setInvestmentLimits.isPending}
                  isConfirming={setInvestmentLimits.isConfirming}
                  isSuccess={setInvestmentLimits.isSuccess}
                  isError={setInvestmentLimits.isError}
                  error={setInvestmentLimits.error}
                  hash={setInvestmentLimits.hash}
                  successMessage="Limits updated!"
                  onReset={setInvestmentLimits.reset}
                />
                <Input
                  label="Minimum Investment (tokens)"
                  type="number"
                  placeholder="1"
                  value={limitsForm.min}
                  onChange={(e) => setLimitsForm({ ...limitsForm, min: e.target.value })}
                  disabled={isLimitsBusy}
                />
                <Input
                  label="Maximum Investment (tokens)"
                  type="number"
                  placeholder="1000"
                  value={limitsForm.max}
                  onChange={(e) => setLimitsForm({ ...limitsForm, max: e.target.value })}
                  disabled={isLimitsBusy}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLimitsBusy}
                  disabled={isLimitsBusy}
                >
                  {setInvestmentLimits.isPending
                    ? 'Confirm in Wallet...'
                    : setInvestmentLimits.isConfirming
                      ? 'Updating...'
                      : 'Update Limits'}
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Legal Document</h3>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSetLegalDocument} className="space-y-4">
                <TransactionStatus
                  isPending={setLegalDoc.isPending}
                  isConfirming={setLegalDoc.isConfirming}
                  isSuccess={setLegalDoc.isSuccess}
                  isError={setLegalDoc.isError}
                  error={setLegalDoc.error}
                  hash={setLegalDoc.hash}
                  successMessage="Document updated!"
                  onReset={setLegalDoc.reset}
                />
                <Input
                  label="IPFS Hash"
                  placeholder="Qm..."
                  value={legalDocument}
                  onChange={(e) => setLegalDocument(e.target.value)}
                  helperText="Enter the IPFS hash of the legal document"
                  disabled={isLegalDocBusy}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLegalDocBusy}
                  disabled={isLegalDocBusy}
                >
                  {setLegalDoc.isPending
                    ? 'Confirm in Wallet...'
                    : setLegalDoc.isConfirming
                      ? 'Updating...'
                      : 'Update Document'}
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">Force Transfer (Legal Compliance)</h3>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleForceTransfer} className="space-y-4">
                <TransactionStatus
                  isPending={forceTransfer.isPending}
                  isConfirming={forceTransfer.isConfirming}
                  isSuccess={forceTransfer.isSuccess}
                  isError={forceTransfer.isError}
                  error={forceTransfer.error}
                  hash={forceTransfer.hash}
                  successMessage="Force transfer completed!"
                  onReset={forceTransfer.reset}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="From Address"
                    placeholder="0x..."
                    value={forceTransferForm.from}
                    onChange={(e) =>
                      setForceTransferForm({ ...forceTransferForm, from: e.target.value })
                    }
                    disabled={isForceTransferBusy}
                  />
                  <Input
                    label="To Address"
                    placeholder="0x..."
                    value={forceTransferForm.to}
                    onChange={(e) =>
                      setForceTransferForm({ ...forceTransferForm, to: e.target.value })
                    }
                    disabled={isForceTransferBusy}
                  />
                  <Input
                    label="Amount (tokens)"
                    type="number"
                    placeholder="100"
                    value={forceTransferForm.amount}
                    onChange={(e) =>
                      setForceTransferForm({ ...forceTransferForm, amount: e.target.value })
                    }
                    disabled={isForceTransferBusy}
                  />
                </div>
                <Input
                  label="Reason"
                  placeholder="e.g., Court order #12345"
                  value={forceTransferForm.reason}
                  onChange={(e) =>
                    setForceTransferForm({ ...forceTransferForm, reason: e.target.value })
                  }
                  helperText="Required: Legal justification for the force transfer"
                  disabled={isForceTransferBusy}
                />
                <p className="text-sm text-gray-500">
                  Force transfer bypasses KYC and freeze checks. Use only for court orders,
                  estate settlement, or recovery purposes.
                </p>
                <Button
                  type="submit"
                  variant="danger"
                  isLoading={isForceTransferBusy}
                  disabled={isForceTransferBusy}
                >
                  {forceTransfer.isPending
                    ? 'Confirm in Wallet...'
                    : forceTransfer.isConfirming
                      ? 'Executing...'
                      : 'Execute Force Transfer'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'frozen' && isTokenAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold">Freeze Account</h3>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleFreeze} className="space-y-4">
                <TransactionStatus
                  isPending={freezeAccount.isPending}
                  isConfirming={freezeAccount.isConfirming}
                  isSuccess={freezeAccount.isSuccess}
                  isError={freezeAccount.isError}
                  error={freezeAccount.error}
                  hash={freezeAccount.hash}
                  successMessage="Account frozen!"
                  onReset={freezeAccount.reset}
                />
                <Input
                  label="Account Address"
                  placeholder="0x..."
                  value={freezeForm.address}
                  onChange={(e) => setFreezeForm({ ...freezeForm, address: e.target.value })}
                  disabled={isFreezeBusy}
                />
                <Input
                  label="Reason"
                  placeholder="e.g., AML investigation"
                  value={freezeForm.reason}
                  onChange={(e) => setFreezeForm({ ...freezeForm, reason: e.target.value })}
                  disabled={isFreezeBusy}
                />
                <Button
                  type="submit"
                  variant="danger"
                  className="w-full"
                  isLoading={isFreezeBusy}
                  disabled={isFreezeBusy}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {freezeAccount.isPending
                    ? 'Confirm in Wallet...'
                    : freezeAccount.isConfirming
                      ? 'Freezing...'
                      : 'Freeze Account'}
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Unfreeze Account</h3>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleUnfreeze} className="space-y-4">
                <TransactionStatus
                  isPending={unfreezeAccount.isPending}
                  isConfirming={unfreezeAccount.isConfirming}
                  isSuccess={unfreezeAccount.isSuccess}
                  isError={unfreezeAccount.isError}
                  error={unfreezeAccount.error}
                  hash={unfreezeAccount.hash}
                  successMessage="Account unfrozen!"
                  onReset={unfreezeAccount.reset}
                />
                <Input
                  label="Account Address"
                  placeholder="0x..."
                  value={unfreezeAddress}
                  onChange={(e) => setUnfreezeAddress(e.target.value)}
                  disabled={isUnfreezeBusy}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isUnfreezeBusy}
                  disabled={isUnfreezeBusy}
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  {unfreezeAccount.isPending
                    ? 'Confirm in Wallet...'
                    : unfreezeAccount.isConfirming
                      ? 'Unfreezing...'
                      : 'Unfreeze Account'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
