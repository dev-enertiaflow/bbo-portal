"use client";

import React, { useState } from "react";
import { Building2, Lock, AlertTriangle, Loader2 } from "lucide-react";
import { UserSession } from "@/types";

interface LoginGateProps {
  onLogin: (user: UserSession) => void;
}

export function LoginGate({ onLogin }: LoginGateProps) {
  const [email, setEmail] = useState("paul@themercergroup.com");
  const [password, setPassword] = useState("BrokerPass2026!");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLogin(data.user);
      } else {
        setErrorMsg(data.message || "Invalid credentials or unauthorized member");
      }
    } catch (err: any) {
      setErrorMsg("Failed to authenticate with Supabase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071220] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#0e223d] border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 text-white">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#122742] border border-[#bfa15f]/40 text-[#d4bc82] mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            THE MERCER GROUP
          </h1>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mt-1">
            Keller Williams Tampa Properties
          </p>
          <div className="inline-block mt-2 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-300 font-mono">
            Broker Back Office (BBO) Portal • Office ID: MFR771620
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs leading-relaxed text-slate-300 flex gap-2.5 items-start">
          <AlertTriangle className="w-4 h-4 text-[#d4bc82] shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-100 font-semibold block mb-0.5">
              CONFIDENTIAL & LICENSED MLS ACCESS ONLY
            </strong>
            Authorized exclusively for active, licensed members of The Mercer Group (Keller Williams Tampa Properties).
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Licensed Broker / Agent Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#071424] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa15f] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#071424] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa15f] transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#122742] hover:bg-[#1a3556] text-[#d4bc82] border border-[#bfa15f]/50 font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Sign In to Back Office Portal
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500">
          Powered by Enertia Flow for Keller Williams Tampa Properties • Authorized BBO Feed Provider
        </div>
      </div>
    </div>
  );
}
