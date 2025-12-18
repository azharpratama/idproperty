import { useAccount } from 'wagmi';
import { useTokenAdmin } from './usePropertyToken';
import { useKYCAdmin } from './useKYCRegistry';

export function useAdmin() {
  const { address } = useAccount();
  const { data: tokenAdmin } = useTokenAdmin();
  const { data: kycAdmin } = useKYCAdmin();

  const isTokenAdmin =
    address && tokenAdmin
      ? address.toLowerCase() === tokenAdmin.toLowerCase()
      : false;

  const isKYCAdmin =
    address && kycAdmin
      ? address.toLowerCase() === kycAdmin.toLowerCase()
      : false;

  const isAdmin = isTokenAdmin || isKYCAdmin;

  return { isAdmin, isTokenAdmin, isKYCAdmin, tokenAdmin, kycAdmin };
}
