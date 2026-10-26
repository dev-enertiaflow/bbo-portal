"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserSession, MarketAnalyticsData } from "@/types";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Header } from "@/components/Header";
import { MarketAnalyticsTab } from "@/components/MarketAnalyticsTab";
import { ListingAlertsTab } from "@/components/ListingAlertsTab";
import { TeamRosterTab } from "@/components/TeamRosterTab";
import { ClientSummaryModal } from "@/components/ClientSummaryModal";
import { ForcePasswordChangeModal } from "@/components/ForcePasswordChangeModal";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "alerts" | "team">("analytics");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<MarketAnalyticsData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bbo_user");
    if (!stored) {
      router.replace("/login");
    } else {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("bbo_user");
        router.replace("/login");
      }
    }
    setCheckingAuth(false);
    fetchLiveStats();
  }, [router]);

  const fetchLiveStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const json = await res.json();
      if (json.success && json.data) {
        setAnalyticsData(json.data);
      }
    } catch (e) {
      console.error("Failed to load stats for modal:", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bbo_user");
    document.cookie = "bbo_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.replace("/login");
  };

  if (checkingAuth || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
        Verifying authorized MLS credentials...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Mandatory Stellar MLS Compliance Banner */}
      <ComplianceBanner />

      {/* 2. Executive Navigation Header */}
      <Header
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSummary={() => setShowSummaryModal(true)}
        onLogout={handleLogout}
      />

      {/* 3. Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "analytics" && (
          <MarketAnalyticsTab onOpenSummary={() => setShowSummaryModal(true)} />
        )}

        {activeTab === "alerts" && (
          <ListingAlertsTab currentUser={user} />
        )}

        {activeTab === "team" && (
          <TeamRosterTab currentUser={user} />
        )}
      </main>

      {/* Mandatory First-Time Password Reset Modal */}
      {user.mustChangePassword && (
        <ForcePasswordChangeModal
          user={user}
          onSuccess={() => {
            setUser({ ...user, mustChangePassword: false });
          }}
        />
      )}

      {/* 4. Client Market Summary Modal (Compliant Export Feature) */}
      <ClientSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        user={user}
        analyticsData={analyticsData}
      />

      {/* 5. Executive Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 The Mercer Group • Keller Williams Tampa Properties • Office ID: MFR771620
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Stellar MLS BBO License Compliant</span>
            <span>•</span>
            <span>Data Security Grade: Tier 1 Encrypted</span>
            <span>•</span>
            <button 
              onClick={handleLogout} 
              className="text-amber-600 hover:underline cursor-pointer"
            >
              Sign Out & Lock Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
