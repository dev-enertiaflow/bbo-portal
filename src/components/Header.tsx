"use client";

import React from "react";
import { Building2, LogOut, BarChart3, Bell, Users, FileText } from "lucide-react";
import { UserSession } from "@/types";

interface HeaderProps {
  user: UserSession;
  activeTab: "analytics" | "alerts" | "team";
  onTabChange: (tab: "analytics" | "alerts" | "team") => void;
  onOpenSummary: () => void;
  onLogout: () => void;
}

export function Header({ user, activeTab, onTabChange, onOpenSummary, onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#071220] via-[#0b1a2d] to-[#122742] text-white border-b-2 border-[#d4a738] sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4a738] to-[#b58820] flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building2 className="w-6 h-6 text-[#071220]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  THE MERCER GROUP
                </span>
                <span className="hidden sm:inline bg-[#d4a738]/20 text-[#eac565] text-[10px] font-bold px-2 py-0.5 rounded border border-[#d4a738]/40 uppercase tracking-wider">
                  Broker Back Office
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Keller Williams Tampa Properties • <span className="font-mono text-[#eac565] font-semibold">Office ID: MFR771620</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSummary}
              className="hidden lg:flex items-center gap-1.5 bg-[#0b1a2d] hover:bg-[#122742] text-white border border-[#d4a738]/60 font-semibold text-xs px-3.5 py-2 rounded-lg transition cursor-pointer shadow-sm hover:border-[#d4a738]"
            >
              <FileText className="w-3.5 h-3.5 text-[#d4a738]" />
              Client Market Summary
            </button>

            <div className="hidden sm:flex items-center gap-2.5 bg-[#0e223d] border border-slate-700 px-3.5 py-1.5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#d4a738] text-[#071220] font-extrabold text-xs flex items-center justify-center">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-white leading-tight">{user.name}</div>
                <div className="text-[10px] text-slate-300 font-mono">MLS: {user.mlsId}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-800 pt-1 -mb-px">
          <button
            onClick={() => onTabChange("analytics")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === "analytics"
                ? "border-[#d4a738] text-white bg-white/[0.08] rounded-t-lg shadow-inner"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#d4a738]" />
            Market Intelligence & Statistics
          </button>

          <button
            onClick={() => onTabChange("alerts")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === "alerts"
                ? "border-[#d4a738] text-white bg-white/[0.08] rounded-t-lg shadow-inner"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <Bell className="w-4 h-4 text-[#d4a738]" />
            Internal Agent Listing Alerts
          </button>

          <button
            onClick={() => onTabChange("team")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === "team"
                ? "border-[#d4a738] text-white bg-white/[0.08] rounded-t-lg shadow-inner"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 text-[#d4a738]" />
            Licensed Team Roster (Office MFR771620)
          </button>
        </div>
      </div>
    </header>
  );
}
