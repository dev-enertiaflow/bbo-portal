import { NextResponse } from "next/server";

export interface AgentAlert {
  id: string;
  name: string;
  agentName: string;
  agentEmail: string;
  agentMlsId: string;
  city: string;
  minPrice: number | null;
  maxPrice: number | null;
  minBeds: number | null;
  propertyType: string | null;
  frequency: "instant" | "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
  matchCount: number;
}

// In-memory persistent alert store for BBO Demo (can also link to Supabase table)
let storedAlerts: AgentAlert[] = [
  {
    id: "alert-1",
    name: "South Tampa Luxury Watch ($1M+)",
    agentName: "Paul Mercer",
    agentEmail: "paul@themercergroup.com",
    agentMlsId: "MFR261510833",
    city: "Tampa",
    minPrice: 1000000,
    maxPrice: null,
    minBeds: 4,
    propertyType: "Single Family",
    frequency: "instant",
    isActive: true,
    createdAt: "2026-10-18T14:30:00Z",
    matchCount: 14,
  },
  {
    id: "alert-2",
    name: "Clearwater Beach Waterfront Condos",
    agentName: "Paul Mercer",
    agentEmail: "paul@themercergroup.com",
    agentMlsId: "MFR261510833",
    city: "Clearwater",
    minPrice: 400000,
    maxPrice: 900000,
    minBeds: 2,
    propertyType: "Condominium",
    frequency: "daily",
    isActive: true,
    createdAt: "2026-10-19T09:15:00Z",
    matchCount: 8,
  },
  {
    id: "alert-3",
    name: "St. Petersburg Investment Opportunities",
    agentName: "Licensed Team Agent",
    agentEmail: "team@themercergroup.com",
    agentMlsId: "MFR771620-A2",
    city: "St. Petersburg",
    minPrice: 250000,
    maxPrice: 650000,
    minBeds: 3,
    propertyType: "Single Family",
    frequency: "instant",
    isActive: false,
    createdAt: "2026-10-20T16:45:00Z",
    matchCount: 5,
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    alerts: storedAlerts,
    complianceNotice:
      "Stellar MLS Article 19 Compliance: BBO listing alerts are strictly distributed to active licensed members and staff of Keller Williams Tampa Properties. Public consumer alerts must be routed through approved IDX saved searches.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newAlert: AgentAlert = {
      id: `alert-${Date.now()}`,
      name: body.name || "Custom Agent Watchlist",
      agentName: body.agentName || "Paul Mercer",
      agentEmail: body.agentEmail || "paul@themercergroup.com",
      agentMlsId: body.agentMlsId || "MFR261510833",
      city: body.city || "All Cities",
      minPrice: body.minPrice ? Number(body.minPrice) : null,
      maxPrice: body.maxPrice ? Number(body.maxPrice) : null,
      minBeds: body.minBeds ? Number(body.minBeds) : null,
      propertyType: body.propertyType || "All Types",
      frequency: body.frequency || "instant",
      isActive: true,
      createdAt: new Date().toISOString(),
      matchCount: Math.floor(Math.random() * 10) + 3,
    };

    storedAlerts = [newAlert, ...storedAlerts];

    return NextResponse.json({
      success: true,
      alert: newAlert,
      message: "Agent Listing Alert created successfully for licensed member.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create alert" },
      { status: 500 }
    );
  }
}
