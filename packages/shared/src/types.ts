export type Tier = 'free' | 'searchBlitz' | 'casual' | 'premium';

export interface Entitlements {
  canViewContact: boolean;
  canRequestOutreach: boolean;
  weeklyMatchQuota: number;
}

export interface User {
  id: string;
  authId: string; // Clerk ID
  tier: Tier;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  incomeAfterTax: number;
  bedrooms: number;
  bathrooms: number;
  lifestyle: {
    pets?: boolean;
    smoking?: boolean;
    [k: string]: unknown;
  };
  subjectivePrefs: Record<string, unknown>;
  verifiedFinancials?: {
    provided: boolean;
    method?: string;
  };
}

export interface Listing {
  id: string;
  source: 'craigslist' | 'kijiji' | 'other';
  title: string;
  price: number;
  location: string;
  photos: string[];
  vettingStatus: 'pending' | 'approved' | 'flagged';
  riskScore: number; // 0-100
  createdAt: string;
}

export interface ListingContact {
  listingId: string;
  email?: string;
  phone?: string;
  landlordName?: string;
  lastVerifiedAt?: string;
  riskFlags?: string[];
}

export interface MatchSummary {
  id: string;
  listingId: string;
  score: number; // 0-100
  createdAt: string;
}

export interface MatchCard {
  id: string;
  title: string;
  price: number;
  location: string;
  photos: string[];
  contactAvailable: boolean;
}

export interface MatchesResponse {
  items: MatchCard[];
  entitlements: Entitlements;
}

export interface ListingResponse {
  id: string;
  title: string;
  price: number;
  location: string;
  photos: string[];
  contact?: { redacted: true } | { redacted: false; email?: string; phone?: string };
}
