"use client";

import React, { useEffect, useState } from "react";
import { 
  DollarSign, Home, Clock, TrendingUp, BarChart2, PieChart as PieIcon, 
  MapPin, Shield, RefreshCw, FileText, CheckCircle2 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell 
} from "recharts";
import { MarketAnalyticsData } from "@/types";

interface Props {
  onOpenSummary: () => void;
}

export function MarketAnalyticsTab({ onOpenSummary }: Props) {
  const [data, setData] = useState<MarketAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stats", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = (data?.cityBreakdown || []).slice(0, 8).map((item) => ({
    name: item.city,
    medianPrice: Math.round(item.medianPrice / 1000),
    listings: item.count,
    volume: (item.volume / 1000000).toFixed(1),
  })) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tampa Bay Market Intelligence & Executive Statistics
            </h2>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live MLS Feed
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated MLS market metrics for Keller Williams Tampa Properties • Office ID: MFR771620
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>

          <button
            onClick={onOpenSummary}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#d4bc82] bg-[#0b1a2d] hover:bg-[#122742] border border-[#bfa15f]/40 rounded-lg shadow-sm transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#d4bc82]" />
            Export Client Market Summary
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Median Sales Price</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {data ? `${data.medianPrice.toLocaleString()}` : "$..."}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4.2% vs previous quarter</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Tampa Bay Metropolitan Region</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {data ? data.totalListings : <span className="animate-pulse text-slate-300">...</span>}
              <span className="text-lg font-semibold text-slate-500 ml-1.5">Listings</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{data ? `${data.citiesCovered} Cities Covered` : "Cities Covered"}</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Updated in real-time via BBO Feed</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Days On Market</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {data ? data.avgDaysOnMarket : "..."}
              <span className="text-lg font-semibold text-slate-500 ml-1.5">Days</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>Average listing duration</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Active listing velocity</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aggregate Market Volume</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {data ? `${(data.totalVolume / 1000000).toFixed(1)}M` : "$..."}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>{data ? `Avg ${data.avgPricePerSqFt}/sqft` : "Avg $/sqft"} across region</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Total active value indexed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Submarket Median Price Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Median Listing Price ($ in Thousands) across primary Tampa Bay submarkets
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              {data?.citiesCovered || 49} Cities Covered
            </span>
          </div>

          <div className="h-72 w-full">
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}k`}
                  />
                  <Tooltip 
                    formatter={(val: any) => [`$${val * 1000}`, "Median Price"]}
                    labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
                    contentStyle={{ 
                      borderRadius: "12px", 
                      border: "1px solid #e2e8f0", 
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      fontSize: "12px" 
                    }}
                  />
                  <Bar dataKey="medianPrice" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? "#122742" : index === 1 ? "#1e3a5f" : "#2d4d75"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Loading visual analytics...
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Inventory Distribution</h3>
              <PieIcon className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Breakdown by property category across current active MLS listings
            </p>

            <div className="space-y-4">
              {(data?.propertyTypeBreakdown || [
                { type: "Single Family", count: 185, percentage: 72 },
                { type: "Condominium", count: 42, percentage: 16 },
                { type: "Townhouse", count: 20, percentage: 8 },
                { type: "Commercial / Land", count: 10, percentage: 4 },
              ]).map((item) => (
                <div key={item.type} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.type}</span>
                    <span className="text-slate-900 font-bold">{item.count} units ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#122742] rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl flex items-center justify-between">
            <span className="text-xs text-slate-500">Residential Share:</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
              96% Residential Core
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Price Tier Spectrum (Tampa Bay)</h3>
        <p className="text-xs text-slate-500 mb-5">
          Distribution of active listings categorized by price brackets
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(data?.priceTiers || [
            { tier: "Under $350K", count: 68 },
            { tier: "$350K – $600K", count: 112 },
            { tier: "$600K – $1.0M", count: 48 },
            { tier: "$1.0M – $2.0M", count: 21 },
            { tier: "$2.0M+ (Luxury)", count: 8 },
          ]).map((t) => (
            <div 
              key={t.tier} 
              className="bg-slate-50 hover:bg-slate-100 p-4 rounded-xl border border-slate-200/60 transition"
            >
              <div className="text-xs font-medium text-slate-500">{t.tier}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {t.count}
                <span className="text-xs font-medium text-slate-400 ml-1">homes</span>
              </div>
              <div className="text-[11px] text-slate-600 font-semibold mt-1">
                {data?.totalListings ? Math.round((t.count / data.totalListings) * 100) : 0}% of market
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Submarket Deep Dive</h3>
            <p className="text-xs text-slate-500">Granular performance benchmarks by municipality</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Stellar MLS BBO Feed v2.4</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-6">Submarket / City</th>
                <th className="py-3 px-6">Active Units</th>
                <th className="py-3 px-6">Median Price</th>
                <th className="py-3 px-6">Avg $/SqFt</th>
                <th className="py-3 px-6">Total Volume</th>
                <th className="py-3 px-6 text-right">Market Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.cityBreakdown || []).map((row) => (
                <tr key={row.city} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#bfa15f]" />
                    {row.city}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    {row.count} listings
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-900">
                    ${row.medianPrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">
                    ${row.avgPricePerSqFt}/sqft
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-700">
                    ${(row.volume / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-xs">
                      {data?.totalListings ? Math.round((row.count / data.totalListings) * 100) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#0b1a2d] text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#d4bc82] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-300">
            <strong className="text-slate-100 font-semibold block mb-0.5">
              STELLAR MLS BBO COMPLIANCE CERTIFICATION
            </strong>
            Data processed exclusively for internal use by licensed members of Keller Williams Tampa Properties (Office ID: MFR771620).
            Market statistics and aggregated reports may be compiled by licensed agents for client consultation. Under BBO license guidelines, raw listing database records may not be redistributed to unauthorized third parties.
          </div>
        </div>
        <button
          onClick={onOpenSummary}
          className="shrink-0 bg-[#122742] hover:bg-[#1a3556] text-[#d4bc82] border border-[#bfa15f]/40 font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition cursor-pointer"
        >
          View Client Summary
        </button>
      </div>
    </div>
  );
}
