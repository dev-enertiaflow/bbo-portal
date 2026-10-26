"use client";

import React, { useState } from "react";
import { ShieldAlert, KeyRound, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { UserSession } from "@/types";

interface Props {
  user: UserSession;
  onSuccess: () => void;
}

export function ForcePasswordChangeModal({ user, onSuccess }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword === "TempPassword2026!" || newPassword === "BrokerPass2026!") {
      setErrorMsg("Please choose a personal private password, not the temporary default.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local session
        const updatedUser = { ...user, mustChangePassword: false };
        localStorage.setItem("bbo_user", JSON.stringify(updatedUser));
        onSuccess();
      } else {
        setErrorMsg(data.message || "Failed to update password.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              First-Time Login Security
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Stellar MLS BBO Compliance Requirement
            </p>
          </div>
        </div>

        {/* Informative text */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed mb-5">
          <p>
            Welcome, <strong className="text-slate-900">{user.name}</strong>! Because this is your initial sign-in under Keller Williams Tampa Properties (Office: <span className="font-mono font-bold text-slate-900">MFR771620</span>), you must set a private password to activate your portal access.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              New Private Password
            </label>
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg pl-3.5 pr-10 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#d4a738]"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition"
                title={showNewPass ? "Hide password" : "Show password"}
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg pl-3.5 pr-10 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#d4a738]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition"
                title={showConfirmPass ? "Hide password" : "Show password"}
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#071220] hover:bg-[#0e223d] border border-[#d4a738]/60 rounded-lg shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4a738]" />
                  Activating Secure Account...
                </>
              ) : (
                "Set Password & Enter Dashboard"
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          Your credentials are encrypted and stored securely in compliance with RESO & Stellar MLS data standards.
        </p>

      </div>
    </div>
  );
}
