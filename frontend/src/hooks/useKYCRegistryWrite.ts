import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { KYC_REGISTRY_ADDRESS, KYC_REGISTRY_ABI } from '../config/contracts';
import type { KYCLevel } from '../types';

export function useRegisterInvestor() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const registerInvestor = (
    investor: `0x${string}`,
    level: KYCLevel,
    countryCode: number,
    validDays: bigint
  ) => {
    writeContract({
      address: KYC_REGISTRY_ADDRESS,
      abi: KYC_REGISTRY_ABI,
      functionName: 'registerInvestor',
      args: [investor, level, countryCode, validDays],
    });
  };

  return {
    registerInvestor,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError: isError || isConfirmError,
    error: error || confirmError,
    reset,
    isIdle: !isPending && !isConfirming && !isSuccess && !isError,
  };
}

export function useUpdateInvestor() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const updateInvestor = (investor: `0x${string}`, newLevel: KYCLevel) => {
    writeContract({
      address: KYC_REGISTRY_ADDRESS,
      abi: KYC_REGISTRY_ABI,
      functionName: 'updateInvestor',
      args: [investor, newLevel],
    });
  };

  return {
    updateInvestor,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError: isError || isConfirmError,
    error: error || confirmError,
    reset,
    isIdle: !isPending && !isConfirming && !isSuccess && !isError,
  };
}

export function useRevokeInvestor() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const revokeInvestor = (investor: `0x${string}`) => {
    writeContract({
      address: KYC_REGISTRY_ADDRESS,
      abi: KYC_REGISTRY_ABI,
      functionName: 'revokeInvestor',
      args: [investor],
    });
  };

  return {
    revokeInvestor,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError: isError || isConfirmError,
    error: error || confirmError,
    reset,
    isIdle: !isPending && !isConfirming && !isSuccess && !isError,
  };
}
