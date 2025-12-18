import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PROPERTY_TOKEN_ADDRESS, PROPERTY_TOKEN_ABI } from '../config/contracts';

export function useTransfer() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const transfer = (to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: PROPERTY_TOKEN_ADDRESS,
      abi: PROPERTY_TOKEN_ABI,
      functionName: 'transfer',
      args: [to, amount],
    });
  };

  return {
    transfer,
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

export function useApprove() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const approve = (spender: `0x${string}`, amount: bigint) => {
    writeContract({
      address: PROPERTY_TOKEN_ADDRESS,
      abi: PROPERTY_TOKEN_ABI,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  return {
    approve,
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

export function useTransferFrom() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const transferFrom = (from: `0x${string}`, to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: PROPERTY_TOKEN_ADDRESS,
      abi: PROPERTY_TOKEN_ABI,
      functionName: 'transferFrom',
      args: [from, to, amount],
    });
  };

  return {
    transferFrom,
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

export function useFreezeAccount() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const freezeAccount = (account: `0x${string}`, reason: string) => {
    writeContract({
      address: PROPERTY_TOKEN_ADDRESS,
      abi: PROPERTY_TOKEN_ABI,
      functionName: 'freezeAccount',
      args: [account, reason],
    });
  };

  return {
    freezeAccount,
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

export function useUnfreezeAccount() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const unfreezeAccount = (account: `0x${string}`) => {
    writeContract({
      address: PROPERTY_TOKEN_ADDRESS,
      abi: PROPERTY_TOKEN_ABI,
      functionName: 'unfreezeAccount',
      args: [account],
    });
  };

  return {
    unfreezeAccount,
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

export function useForceTransfer() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const forceTransfer = (from: `0x${string}`, to: `0x${string}`, amount: bigint, reason: string) => {
    writeContract({
      address: PROPERTY_TOKEN_ADDRESS,
      abi: PROPERTY_TOKEN_ABI,
      functionName: 'forceTransfer',
      args: [from, to, amount, reason],
    });
  };

  return {
    forceTransfer,
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

export function useSetLegalDocument() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const setLegalDocument = (ipfsHash: string) => {
    writeContract({
      address: PROPERTY_TOKEN_ADDRESS,
      abi: PROPERTY_TOKEN_ABI,
      functionName: 'setLegalDocument',
      args: [ipfsHash],
    });
  };

  return {
    setLegalDocument,
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

export function useSetInvestmentLimits() {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const setInvestmentLimits = (min: bigint, max: bigint) => {
    writeContract({
      address: PROPERTY_TOKEN_ADDRESS,
      abi: PROPERTY_TOKEN_ABI,
      functionName: 'setInvestmentLimits',
      args: [min, max],
    });
  };

  return {
    setInvestmentLimits,
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
