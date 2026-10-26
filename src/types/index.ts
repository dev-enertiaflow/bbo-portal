export interface CityStat {
  city: string;
  count: number;
  medianPrice: number;
  avgPricePerSqFt: number;
  volume: number;
}

export interface PropertyTypeStat {
  type: string;
  count: number;
  percentage: number;
}

export interface PriceTierStat {
  tier: string;
  count: number;
}

export interface MarketAnalyticsData {
  totalListings: number;
  citiesCovered: number;
  totalVolume: number;
  medianPrice: number;
  avgPrice: number;
  avgPricePerSqFt: number;
  avgDaysOnMarket: number;
  cityBreakdown: CityStat[];
  propertyTypeBreakdown: PropertyTypeStat[];
  priceTiers: PriceTierStat[];
  lastUpdated: string;
}

export interface BrokerageInfo {
  officeId: string;
  brokerageName: string;
  teamName: string;
  licensedMember: string;
}

export interface UserSession {
  id?: string;
  name: string;
  email: string;
  role: string;
  mlsId: string;
  officeId: string;
  mustChangePassword?: boolean;
}

export interface AlertItem {
  id: string;
  name: string;
  recipientName: string;
  recipientEmail: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  frequency: "Instant Push" | "Daily 8 AM Digest";
  status: "active" | "paused";
  createdAt: string;
  matchesCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  mlsId: string;
  licenseStatus: "Active - Stellar MLS Verified" | "Pending Verification";
  salesVolume: string;
  activeListings: number;
}
