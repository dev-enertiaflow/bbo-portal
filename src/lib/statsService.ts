import { supabaseAdmin } from "./supabase";

export interface MarketMetrics {
  totalListings: number;
  citiesCovered: number;
  totalVolume: number;
  medianPrice: number;
  avgPrice: number;
  avgPricePerSqFt: number;
  avgDaysOnMarket: number;
  cityBreakdown: Array<{
    city: string;
    count: number;
    medianPrice: number;
    avgPricePerSqFt: number;
    volume: number;
  }>;
  propertyTypeBreakdown: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  priceTiers: Array<{
    tier: string;
    count: number;
  }>;
  lastUpdated: string;
}

function formatCityName(rawName: string): string {
  if (!rawName) return "Tampa";
  const specialMap: Record<string, string> = {
    "LAND O LAKES": "Land O' Lakes",
    "ST PETERSBURG": "St. Petersburg",
    "ST CLOUD": "St. Cloud",
    "CLEARWATER BEACH": "Clearwater Beach",
    "NEW PORT RICHEY": "New Port Richey",
    "HERNANDO BEACH": "Hernando Beach",
    "CRYSTAL RIVER": "Crystal River",
    "SAFETY HARBOR": "Safety Harbor",
    "DADE CITY": "Dade City",
    "TEMPLE TERRACE": "Temple Terrace",
    "SPRING HILL": "Spring Hill",
    "PINELLAS PARK": "Pinellas Park",
    "SAN ANTONIO": "San Antonio",
    "WINTER HAVEN": "Winter Haven",
    "WEEKI WACHEE": "Weeki Wachee",
    "TREASURE ISLAND": "Treasure Island",
    "TARPON SPRINGS": "Tarpon Springs",
    "APOLLO BEACH": "Apollo Beach",
    "PLANT CITY": "Plant City",
    "PORT CHARLOTTE": "Port Charlotte",
    "PORT RICHEY": "Port Richey",
    "INDIAN SHORES": "Indian Shores",
  };
  const upper = rawName.trim().toUpperCase();
  if (specialMap[upper]) return specialMap[upper];
  return upper
    .split(" ")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export async function fetchMarketAnalytics(): Promise<MarketMetrics> {
  // Query all active listings dynamically with JSON path for DaysOnMarket (fast 400ms query)
  const { data: listings, error } = await supabaseAdmin
    .from("listings")
    .select("list_price, living_area, city, property_type, dom:raw_data->DaysOnMarket")
    .order("list_price", { ascending: false });

  if (error) {
    console.error("Database query error in fetchMarketAnalytics:", error);
    throw new Error("Database query failed: " + error.message);
  }

  if (!listings || listings.length === 0) {
    throw new Error("No active listings found in database for Office MFR771620");
  }

  // Exact metrics derived dynamically across all active database records
  const totalListings = listings.length;

  const validPrices = listings
    .map((l: any) => Number(l.list_price))
    .filter((p: number) => !isNaN(p) && p > 0)
    .sort((a: number, b: number) => a - b);

  const totalVolume = validPrices.reduce((acc: number, p: number) => acc + p, 0);
  const avgPrice = Math.round(totalVolume / (validPrices.length || 1));

  // Median Price calculation
  const midIndex = Math.floor(validPrices.length / 2);
  const medianPrice =
    validPrices.length % 2 === 0
      ? Math.round((validPrices[midIndex - 1] + validPrices[midIndex]) / 2)
      : validPrices[midIndex] || 0;

  // Price Per Sq Ft and Days On Market
  const sqftPrices: number[] = [];
  const domList: number[] = [];

  listings.forEach((l: any) => {
    const price = Number(l.list_price);
    const sqft = Number(l.living_area);
    if (price > 0 && sqft > 0) {
      sqftPrices.push(price / sqft);
    }
    const dom = l.dom;
    if (dom !== undefined && dom !== null && !isNaN(Number(dom)) && Number(dom) >= 0) {
      domList.push(Number(dom));
    }
  });

  const avgPricePerSqFt = Math.round(
    sqftPrices.reduce((acc, p) => acc + p, 0) / (sqftPrices.length || 1)
  );

  const avgDaysOnMarket = Math.round(
    domList.reduce((acc, d) => acc + d, 0) / (domList.length || 1)
  );

  // Dynamic City Breakdown across all covered cities
  const cityMap = new Map<
    string,
    { count: number; prices: number[]; sqfts: number[]; volume: number }
  >();

  listings.forEach((l: any) => {
    const formattedCity = formatCityName(l.city || "TAMPA");
    const price = Number(l.list_price) || 0;
    const sqft = Number(l.living_area) || 0;

    const current = cityMap.get(formattedCity) || {
      count: 0,
      prices: [],
      sqfts: [],
      volume: 0,
    };
    current.count += 1;
    current.volume += price;
    if (price > 0) current.prices.push(price);
    if (price > 0 && sqft > 0) current.sqfts.push(price / sqft);
    cityMap.set(formattedCity, current);
  });

  const citiesCovered = cityMap.size;

  const cityBreakdown = Array.from(cityMap.entries())
    .map(([city, data]) => {
      data.prices.sort((a, b) => a - b);
      const cityMid = Math.floor(data.prices.length / 2);
      const cityMedian = data.prices[cityMid] || 0;
      const cityAvgSqFt = Math.round(
        data.sqfts.reduce((acc, s) => acc + s, 0) / (data.sqfts.length || 1)
      );
      return {
        city,
        count: data.count,
        medianPrice: cityMedian,
        avgPricePerSqFt: cityAvgSqFt || avgPricePerSqFt,
        volume: data.volume,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Dynamic Property Types breakdown
  const typeMap = new Map<string, number>();
  listings.forEach((l: any) => {
    const t = l.property_type || "Residential";
    typeMap.set(t, (typeMap.get(t) || 0) + 1);
  });

  const propertyTypeBreakdown = Array.from(typeMap.entries())
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalListings) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Price Tiers across all active listings
  const tiers = [
    { tier: "Under $350K", max: 350000, count: 0 },
    { tier: "$350K – $600K", max: 600000, count: 0 },
    { tier: "$600K – $1.0M", max: 1000000, count: 0 },
    { tier: "$1.0M – $2.0M", max: 2000000, count: 0 },
    { tier: "$2.0M+ (Luxury)", max: Infinity, count: 0 },
  ];

  validPrices.forEach((p) => {
    if (p < 350000) tiers[0].count++;
    else if (p < 600000) tiers[1].count++;
    else if (p < 1000000) tiers[2].count++;
    else if (p < 2000000) tiers[3].count++;
    else tiers[4].count++;
  });

  const priceTiers = tiers.map((t) => ({ tier: t.tier, count: t.count }));

  return {
    totalListings,
    citiesCovered,
    totalVolume,
    medianPrice,
    avgPrice,
    avgPricePerSqFt,
    avgDaysOnMarket,
    cityBreakdown,
    propertyTypeBreakdown,
    priceTiers,
    lastUpdated: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
