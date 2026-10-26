"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const existing = localStorage.getItem("bbo_user");
    if (existing) {
      router.replace("/dashboard");
    }
  }, [router]);

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
        localStorage.setItem("bbo_user", JSON.stringify(data.user));
        document.cookie = "bbo_auth=1; path=/";
        router.push("/dashboard");
      } else {
        setErrorMsg(data.message || "Invalid credentials or unauthorized MLS member.");
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      {/* Clean, spacious card */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 text-slate-900">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#071220] text-[#d4a738] border border-[#d4a738]/30 shadow-md mb-3.5">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            THE MERCER GROUP
          </h1>
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mt-1">
            Keller Williams Tampa Properties
          </p>
          <div className="inline-flex items-center gap-1.5 mt-3 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Broker Back Office • Office ID: MFR771620</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Broker / Agent Email
            </label>
            <input
              type="email"
              value={email}
              placeholder="e.g. paul@themercergroup.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white border border-slate-300 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#d4a738] focus:ring-2 focus:ring-[#d4a738]/20 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white border border-slate-300 focus:bg-white rounded-xl pl-4 pr-11 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#d4a738] focus:ring-2 focus:ring-[#d4a738]/20 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#071220] hover:bg-[#0e223d] text-white border border-[#d4a738]/50 hover:border-[#d4a738] font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 transition cursor-pointer disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#d4a738]" /> : <Lock className="w-4 h-4 text-[#d4a738]" />}
            Sign In to Back Office Portal
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-slate-100 text-center text-xs text-slate-400">
          Licensed Stellar MLS Member Access Only
        </div>
      </div>
    </div>
  );
}
