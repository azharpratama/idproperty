import { useReadContract } from 'wagmi';
import { KYC_REGISTRY_ADDRESS, KYC_REGISTRY_ABI } from '../config/contracts';
import { KYCLevel } from '../types';

export function useKYCAdmin() {
  return useReadContract({
    address: KYC_REGISTRY_ADDRESS,
    abi: KYC_REGISTRY_ABI,
    functionName: 'admin',
  });
}

export function useTotalInvestors() {
  return useReadContract({
    address: KYC_REGISTRY_ADDRESS,
    abi: KYC_REGISTRY_ABI,
    functionName: 'totalInvestors',
  });
}

export function useIsVerified(address: `0x${string}` | undefined) {
  return useReadContract({
    address: KYC_REGISTRY_ADDRESS,
    abi: KYC_REGISTRY_ABI,
    functionName: 'isVerified',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useInvestorData(address: `0x${string}` | undefined) {
  const result = useReadContract({
    address: KYC_REGISTRY_ADDRESS,
    abi: KYC_REGISTRY_ABI,
    functionName: 'getInvestor',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const data = result.data
    ? {
        level: result.data[0] as KYCLevel,
        expiryDate: result.data[1],
        countryCode: result.data[2],
        isActive: result.data[3],
      }
    : undefined;

  return {
    ...result,
    data,
  };
}

export function useMeetsLevel(address: `0x${string}` | undefined, level: KYCLevel) {
  return useReadContract({
    address: KYC_REGISTRY_ADDRESS,
    abi: KYC_REGISTRY_ABI,
    functionName: 'meetsLevel',
    args: address ? [address, level] : undefined,
    query: {
      enabled: !!address,
    },
  });
}
