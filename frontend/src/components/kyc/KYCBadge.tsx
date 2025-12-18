import { Shield, ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react';
import { KYCLevel } from '../../types';
import { getKYCLevelLabel } from '../../lib/format';

interface KYCBadgeProps {
  level?: KYCLevel;
  isVerified?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function KYCBadge({ level, isVerified, showLabel = true, size = 'md' }: KYCBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
  };

  if (isVerified === false || level === KYCLevel.NONE) {
    return (
      <span className={`inline-flex items-center font-medium rounded-full bg-red-100 text-red-700 ${sizeClasses[size]}`}>
        <ShieldX className={iconSizes[size]} />
        {showLabel && 'Not Verified'}
      </span>
    );
  }

  if (isVerified === true && level === undefined) {
    return (
      <span className={`inline-flex items-center font-medium rounded-full bg-green-100 text-green-700 ${sizeClasses[size]}`}>
        <ShieldCheck className={iconSizes[size]} />
        {showLabel && 'Verified'}
      </span>
    );
  }

  const configs: Record<KYCLevel, { bg: string; text: string; icon: typeof Shield }> = {
    [KYCLevel.NONE]: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: ShieldX,
    },
    [KYCLevel.BASIC]: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: ShieldAlert,
    },
    [KYCLevel.VERIFIED]: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: ShieldCheck,
    },
    [KYCLevel.ACCREDITED]: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: ShieldCheck,
    },
  };

  const config = configs[level ?? KYCLevel.NONE];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {showLabel && getKYCLevelLabel(level ?? KYCLevel.NONE)}
    </span>
  );
}
