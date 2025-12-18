import { useReadContract } from 'wagmi';
import { PROPERTY_TOKEN_ADDRESS, PROPERTY_TOKEN_ABI } from '../config/contracts';

export function useTokenName() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'name',
  });
}

export function useTokenSymbol() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'symbol',
  });
}

export function useTokenDecimals() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'decimals',
  });
}

export function useTotalSupply() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'totalSupply',
  });
}

export function useBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useAllowance(owner: `0x${string}` | undefined, spender: `0x${string}` | undefined) {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !!owner && !!spender,
    },
  });
}

export function usePropertyInfo() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'property',
  });
}

export function useOwnershipPercent(address: `0x${string}` | undefined) {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'getOwnershipPercent',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useTokenValueIDR() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'getTokenValueIDR',
  });
}

export function useIsFrozen(address: `0x${string}` | undefined) {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'frozen',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useCanTransfer(
  from: `0x${string}` | undefined,
  to: `0x${string}` | undefined,
  amount: bigint | undefined
) {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'canTransfer',
    args: from && to && amount !== undefined ? [from, to, amount] : undefined,
    query: {
      enabled: !!from && !!to && amount !== undefined,
    },
  });
}

export function useMinInvestment() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'minInvestment',
  });
}

export function useMaxInvestment() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'maxInvestment',
  });
}

export function useInvestmentLimits() {
  const { data: min, ...minRest } = useMinInvestment();
  const { data: max, ...maxRest } = useMaxInvestment();

  return {
    min,
    max,
    isLoading: minRest.isLoading || maxRest.isLoading,
    isError: minRest.isError || maxRest.isError,
  };
}

export function useTokenAdmin() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'admin',
  });
}

export function useKYCRegistryAddress() {
  return useReadContract({
    address: PROPERTY_TOKEN_ADDRESS,
    abi: PROPERTY_TOKEN_ABI,
    functionName: 'kycRegistry',
  });
}
