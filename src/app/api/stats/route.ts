import { NextResponse } from "next/server";
import { fetchMarketAnalytics } from "@/lib/statsService";

export async function GET() {
  try {
    const stats = await fetchMarketAnalytics();
    return NextResponse.json(
      {
        success: true,
        data: stats,
        brokerage: {
          officeId: process.env.NEXT_PUBLIC_BROKERAGE_OFFICE_ID || "MFR771620",
          brokerageName: process.env.NEXT_PUBLIC_BROKERAGE_NAME || "Keller Williams Tampa Properties",
          teamName: process.env.NEXT_PUBLIC_TEAM_NAME || "The Mercer Group",
          licensedMember: "Paul Mercer · MLS ID: MFR261510833",
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("API /api/stats Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load market statistics from database" },
      { status: 500 }
    );
  }
}
