export type ProductId = string;

export interface TierEntitlements {
  canViewContact: boolean;
  canRequestOutreach: boolean;
  weeklyMatchQuota: number;
}

export const TIERS = {
  free: 'free',
  searchBlitz: 'searchBlitz',
  casual: 'casual',
  premium: 'premium',
} as const;
export type TierKey = keyof typeof TIERS;

export interface TierMappingConfig {
  stripe: Record<TierKey, ProductId | null>;
  walletconnect: Record<TierKey, ProductId | null>;
}

export const DEFAULT_ENTITLEMENTS: Record<TierKey, TierEntitlements> = {
  free: { canViewContact: false, canRequestOutreach: false, weeklyMatchQuota: 3 },
  searchBlitz: { canViewContact: true, canRequestOutreach: true, weeklyMatchQuota: 50 },
  casual: { canViewContact: true, canRequestOutreach: false, weeklyMatchQuota: 10 },
  premium: { canViewContact: true, canRequestOutreach: true, weeklyMatchQuota: 100 },
};

export function getTierFromProductId(productId: string | null | undefined, mapping: TierMappingConfig): TierKey | null {
  if (!productId) return null;
  for (const tier of Object.keys(TIERS) as TierKey[]) {
    if (mapping.stripe[tier] === productId || mapping.walletconnect[tier] === productId) return tier;
  }
  return null;
}

export function entitlementsForTier(tier: TierKey | null): TierEntitlements {
  if (!tier) return DEFAULT_ENTITLEMENTS.free;
  return DEFAULT_ENTITLEMENTS[tier] ?? DEFAULT_ENTITLEMENTS.free;
}
