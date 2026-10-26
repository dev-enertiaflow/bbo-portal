import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

export function ComplianceBanner() {
  return (
    <div className="bg-[#0b1a2d] text-white border-b border-slate-800 px-4 py-2 text-xs sm:text-sm m-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-200 font-semibold tracking-wide">
          <ShieldCheck className="w-4 h-4 text-[#d4bc82] shrink-0" />
          <span>STELLAR MLS BROKER BACK OFFICE (BBO) PRIVATE GATE</span>
          <span className="hidden sm:inline bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700">
            OFFICE: MFR771620
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Licensed Member Access Only
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Keller Williams Tampa Properties / The Mercer Group</span>
        </div>
      </div>
    </div>
  );
}
