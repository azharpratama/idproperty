export const KYCLevel = {
  NONE: 0,
  BASIC: 1,
  VERIFIED: 2,
  ACCREDITED: 3,
} as const;

export type KYCLevel = (typeof KYCLevel)[keyof typeof KYCLevel];

export const KYC_LEVEL_LABELS: Record<KYCLevel, string> = {
  [KYCLevel.NONE]: "Not Verified",
  [KYCLevel.BASIC]: "Basic (KTP)",
  [KYCLevel.VERIFIED]: "Verified (KTP + NPWP)",
  [KYCLevel.ACCREDITED]: "Accredited Investor",
};

export const KYC_LEVEL_COLORS: Record<KYCLevel, string> = {
  [KYCLevel.NONE]: "red",
  [KYCLevel.BASIC]: "yellow",
  [KYCLevel.VERIFIED]: "blue",
  [KYCLevel.ACCREDITED]: "green",
};

export interface Investor {
  level: KYCLevel;
  expiryDate: bigint;
  countryCode: number;
  isActive: boolean;
}

export interface PropertyInfo {
  propertyName: string;
  location: string;
  totalValue: bigint;
  totalTokens: bigint;
  legalDocument: string;
  isActive: boolean;
}

export interface TransferCheck {
  allowed: boolean;
  reason: string;
}
