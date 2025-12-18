import { formatUnits } from 'viem';
import { KYCLevel, KYC_LEVEL_LABELS, KYC_LEVEL_COLORS } from '../types';

export function formatTokens(value: bigint, decimals: number = 18): string {
  const formatted = formatUnits(value, decimals);
  const num = parseFloat(formatted);
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M SDMN`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K SDMN`;
  }
  return `${num.toFixed(2)} SDMN`;
}

export function formatTokensRaw(value: bigint, decimals: number = 18): string {
  const formatted = formatUnits(value, decimals);
  const num = parseFloat(formatted);
  return num.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

export function formatIDR(value: bigint | number): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(basisPoints: bigint | number): string {
  const num = typeof basisPoints === 'bigint' ? Number(basisPoints) : basisPoints;
  return `${(num / 100).toFixed(2)}%`;
}

export function formatDate(timestamp: bigint | number): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(timestamp: bigint | number): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getKYCLevelLabel(level: KYCLevel | number): string {
  return KYC_LEVEL_LABELS[level as KYCLevel] || 'Unknown';
}

export function getKYCLevelColor(level: KYCLevel | number): string {
  return KYC_LEVEL_COLORS[level as KYCLevel] || 'gray';
}

export function isKYCExpired(expiryDate: bigint | number): boolean {
  const ts = typeof expiryDate === 'bigint' ? Number(expiryDate) : expiryDate;
  return Date.now() > ts * 1000;
}

export function daysUntilExpiry(expiryDate: bigint | number): number {
  const ts = typeof expiryDate === 'bigint' ? Number(expiryDate) : expiryDate;
  const diff = ts * 1000 - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
