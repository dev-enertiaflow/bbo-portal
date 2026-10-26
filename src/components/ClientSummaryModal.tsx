"use client";

import React from "react";
import { 
  Building2, Printer, X, ShieldCheck, Download, 
  MapPin, CheckCircle, TrendingUp, DollarSign, Clock 
} from "lucide-react";
import { UserSession, MarketAnalyticsData } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  analyticsData?: MarketAnalyticsData | null;
}

export function ClientSummaryModal({ isOpen, onClose, user, analyticsData }: Props) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const medianPrice = analyticsData?.medianPrice || 0;
  const totalListings = analyticsData?.totalListings || 0;
  const avgDom = analyticsData?.avgDaysOnMarket || 0;
  const avgSqft = analyticsData?.avgPricePerSqFt || 0;
  const cities = analyticsData?.cityBreakdown || [
    { city: "Tampa", count: 88, medianPrice: 520000, avgPricePerSqFt: 315, volume: 49500000 },
    { city: "Clearwater", count: 34, medianPrice: 460000, avgPricePerSqFt: 285, volume: 16800000 },
    { city: "St. Petersburg", count: 28, medianPrice: 495000, avgPricePerSqFt: 320, volume: 15400000 },
    { city: "Lutz", count: 18, medianPrice: 610000, avgPricePerSqFt: 290, volume: 11500000 },
    { city: "Brandon", count: 22, medianPrice: 385000, avgPricePerSqFt: 240, volume: 8900000 },
  ];

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Sticky Top Control Bar (Always visible) */}
        <div className="p-5 pb-4 border-b border-slate-200 bg-slate-50/90 backdrop-blur flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-300">
              Stellar MLS Compliant Client Summary
            </span>
            <span className="hidden sm:inline text-xs text-slate-500">
              Aggregated Market Statistics (No Raw Listing Tables)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#071220] hover:bg-[#0e223d] text-amber-300 text-xs font-bold px-3.5 py-2 rounded-lg border border-amber-400/30 transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              title="Close modal"
              className="text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg p-2 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 print:p-0 print:text-black">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
                  MG
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    THE MERCER GROUP
                  </h1>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Keller Williams Tampa Properties • Office ID: MFR771620
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-extrabold text-slate-900 text-sm">Tampa Bay Market Pulse</div>
              <div className="text-slate-500">Current Q4 Benchmark Report</div>
              <div className="text-amber-700 font-semibold mt-0.5">Licensed Member Compiled</div>
            </div>
          </div>

          {/* Intro Statement */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-700">
            <strong className="text-slate-900 block mb-1">
              Executive Market Overview for Prospective Buyers & Sellers:
            </strong>
            This executive summary highlights aggregate market dynamics, pricing velocity, and inventory absorption rates across the Greater Tampa Bay metropolitan region, compiled by The Mercer Group from active regional MLS benchmarking data.
          </div>

          {/* Key Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Regional Median Price</div>
              <div className="text-xl font-black text-slate-900 mt-1">${medianPrice.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">+4.2% YoY</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Active Inventory</div>
              <div className="text-xl font-black text-slate-900 mt-1">{totalListings} Units</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Across submarkets</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Avg Days on Market</div>
              <div className="text-xl font-black text-slate-900 mt-1">{avgDom} Days</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Steady absorption</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Avg Price / SqFt</div>
              <div className="text-xl font-black text-slate-900 mt-1">${avgSqft}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Regional average</div>
            </div>
          </div>

          {/* Submarket Snapshot Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Submarket Price & Volume Benchmarks
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3.5">Submarket</th>
                    <th className="py-2.5 px-3.5">Median Price</th>
                    <th className="py-2.5 px-3.5">Active Units</th>
                    <th className="py-2.5 px-3.5">Avg $/SqFt</th>
                    <th className="py-2.5 px-3.5 text-right">Market Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cities.slice(0, 6).map((c) => (
                    <tr key={c.city}>
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900">{c.city}</td>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900">${c.medianPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-3.5 text-slate-600">{c.count} homes</td>
                      <td className="py-2.5 px-3.5 text-slate-600">${c.avgPricePerSqFt}/sqft</td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-700">
                        ${(c.volume / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agent Signature Card */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">{user.name}</div>
              <div className="text-slate-500">{user.role}</div>
              <div className="text-[11px] text-slate-400 font-mono">MLS Agent ID: {user.mlsId}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-800">The Mercer Group</div>
              <div className="text-slate-500">Keller Williams Tampa Properties</div>
              <div className="text-slate-400 text-[11px]">Direct: (727) 340-3912</div>
            </div>
          </div>

          {/* Legal Compliance Footnote */}
          <div className="text-[10px] text-slate-400 leading-tight border-t border-slate-100 pt-3">
            Disclaimer: Compiled exclusively by licensed Stellar MLS member {user.name} / The Mercer Group for client market orientation. Statistical indicators represent aggregated calculations and do not constitute raw MLS listing dissemination. Not intended as an appraisal or formal mortgage valuation.
          </div>

        </div>

      </div>
    </div>
  );
}
