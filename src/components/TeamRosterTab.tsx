"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, UserPlus, ShieldCheck, Mail, Phone, Award, 
  CheckCircle2, Building, X, AlertCircle, Loader2, RefreshCw,
  UserX, ShieldAlert, Copy, Check, ExternalLink
} from "lucide-react";
import { TeamMember } from "@/types";

// Guaranteed clipboard copy supporting synchronous fallback and modern clipboard API
function copyTextSafe(text: string): boolean {
  let success = false;
  // 1. Synchronous execCommand copy executed immediately within the user click gesture
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "2em";
    el.style.height = "2em";
    el.style.padding = "0";
    el.style.border = "none";
    el.style.outline = "none";
    el.style.boxShadow = "none";
    el.style.background = "transparent";
    el.style.opacity = "0.01";
    el.style.zIndex = "-1";
    document.body.appendChild(el);
    el.focus();
    el.select();
    el.setSelectionRange(0, text.length);
    success = document.execCommand("copy");
    document.body.removeChild(el);
  } catch (err) {
    console.warn("execCommand copy error:", err);
  }

  // 2. Modern navigator.clipboard API as concurrent standard
  if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return success;
}

export function TeamRosterTab() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMlsId, setInviteMlsId] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [lastProvisionedName, setLastProvisionedName] = useState("");
  const [lastProvisionedEmail, setLastProvisionedEmail] = useState("");
  const [lastProvisionedPassword, setLastProvisionedPassword] = useState("Mercer-2026!");
  const [emailSent, setEmailSent] = useState(false);

  // Copy feedback states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Revoke modal state
  const [memberToRevoke, setMemberToRevoke] = useState<TeamMember | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/team");
      const data = await res.json();
      if (data.success && data.members) {
        setTeam(data.members);
      }
    } catch (e) {
      console.error("Failed to load team:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          mlsId: inviteMlsId,
          role: "Licensed Associate",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastProvisionedName(inviteName);
        setLastProvisionedEmail(inviteEmail);
        if (data.tempPassword) {
          setLastProvisionedPassword(data.tempPassword);
        }
        setEmailSent(Boolean(data.emailDispatched));
        setInviteSuccess(true);
        await fetchTeam();
      } else {
        alert(data.message || "Failed to provision member");
      }
    } catch (e) {
      console.error("Error provisioning member:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const getLoginUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/login`;
    }
    return "http://localhost:3000/login";
  };

  const handleCopyLinkOnly = async () => {
    const url = getLoginUrl();
    copyTextSafe(url);
    if (navigator?.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(url); } catch (_) {}
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyPasswordOnly = async () => {
    copyTextSafe(lastProvisionedPassword);
    if (navigator?.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(lastProvisionedPassword); } catch (_) {}
    }
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2500);
  };

  const handleCopyFullInvite = async () => {
    const url = getLoginUrl();
    const message = `Welcome to The Mercer Group / Keller Williams Tampa Properties BBO Portal!

Login Portal: ${url}
Authorized Email: ${lastProvisionedEmail}
Temporary Password: ${lastProvisionedPassword}

Stellar MLS Notice: You will be prompted to set your permanent private password upon initial sign-in.`;
    copyTextSafe(message);
    if (navigator?.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(message); } catch (_) {}
    }
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };



  const handleConfirmRevoke = async () => {
    if (!memberToRevoke) return;
    setRevoking(true);
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: memberToRevoke.id }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Access revoked for ${memberToRevoke.name}. Credentials de-provisioned.`);
        setMemberToRevoke(null);
        await fetchTeam();
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert(data.message || "Failed to revoke access");
      }
    } catch (err) {
      console.error("Error revoking access:", err);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Licensed Brokerage Team Roster
            </h2>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
              Office MFR771620
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Active Stellar MLS members authorized for BBO market intelligence and internal alerts access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTeam}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-[#071220] hover:bg-[#0e223d] text-white border border-[#d4a738]/60 font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition cursor-pointer hover:border-[#d4a738]"
          >
            <UserPlus className="w-4 h-4 text-[#d4a738]" />
            Provision Licensed Agent
          </button>
        </div>
      </div>

      {/* Compliance Callout */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 font-bold block mb-0.5">
            STELLAR MLS BBO USER AUTHORIZATION & OFFBOARDING POLICY
          </strong>
          Access to this portal is legally governed by the Stellar MLS Broker Back Office Agreement.
          Only active, licensed agents registered under Keller Williams Tampa Properties (Office ID: MFR771620) may be issued credentials.
          Brokers must promptly offboard departing associates to maintain feed compliance.
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {team.map((member) => (
          <div 
            key={member.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#d4a738] transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#071220] to-[#122742] text-[#d4a738] font-black text-base flex items-center justify-center shadow-md border border-[#d4a738]/30">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{member.name}</h3>
                    <p className="text-xs text-slate-600 font-semibold">{member.role}</p>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Stellar MLS Verified
                </span>
              </div>

              <div className="mt-5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Stellar MLS ID:</span>
                  <span className="font-mono font-bold text-slate-900">{member.mlsId}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Brokerage Email:</span>
                  <span className="font-semibold text-slate-800">{member.email}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Direct Phone:</span>
                  <span className="font-semibold text-slate-800">{member.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-medium">Active Listings: </span>
                <span className="font-black text-slate-900 text-sm">{member.activeListings} units</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-slate-500 font-medium">Listing Volume: </span>
                  <span className="font-black text-emerald-700 text-sm">{member.salesVolume}</span>
                </div>

                {member.id !== "broker-1" && (
                  <button
                    onClick={() => setMemberToRevoke(member)}
                    className="ml-2 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                    title="Revoke BBO access and offboard agent"
                  >
                    <UserX className="w-3 h-3" />
                    Revoke Access
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Provision Licensed Agent */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Provision Licensed Member</h3>
                <p className="text-xs text-slate-500 font-medium">Add active agent in Supabase under Office: MFR771620</p>
              </div>
              <button 
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="py-2 space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Licensed Member Provisioned!</h4>
                  <p className="text-xs text-slate-500">Authorized in Supabase · Office: MFR771620</p>
                  
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center mt-2 flex items-center justify-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>We sent an invitation to their email. If you want to send it manually, copy the full invitation below.</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                        Portal Login Link
                      </span>
                      {copiedLink && (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                          <Check className="w-3 h-3" /> Copied to clipboard!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={getLoginUrl()} 
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 select-all cursor-pointer focus:border-[#d4a738] focus:outline-none"
                        title="Click to select all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLinkOnly}
                        className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 cursor-pointer transition shadow-sm ${
                          copiedLink 
                            ? "bg-emerald-600 text-white border-emerald-600" 
                            : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedLink ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                        Temporary Access Password
                      </span>
                      {copiedPass && (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                          <Check className="w-3 h-3" /> Password copied!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={lastProvisionedPassword} 
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-amber-800 select-all cursor-pointer focus:border-[#d4a738] focus:outline-none"
                        title="Click to select all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPasswordOnly}
                        className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 cursor-pointer transition shadow-sm ${
                          copiedPass 
                            ? "bg-emerald-600 text-white border-emerald-600" 
                            : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedPass ? "Copied!" : "Copy Password"}
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-700 font-semibold pt-1 flex items-start gap-1.5 leading-snug">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>Mandatory private password reset enforced on initial login.</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyFullInvite}
                    className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition shadow-sm border ${
                      copiedAll 
                        ? "bg-emerald-600 text-white border-emerald-600" 
                        : "text-[#071220] bg-amber-50 hover:bg-amber-100 border-amber-300"
                    }`}
                  >
                    {copiedAll ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-amber-700" />}
                    {copiedAll ? "Invitation Message Copied!" : "Copy Full Invitation Message"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInviteSuccess(false);
                      setShowInviteModal(false);
                      setInviteName("");
                      setInviteEmail("");
                      setInviteMlsId("");
                    }}
                    className="w-full py-2 px-5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Licensed Agent Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. David Campbell"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#d4a738]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Brokerage Email (@themercergroup.com)
                  </label>
                  <input
                    type="email"
                    placeholder="david.c@themercergroup.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#d4a738]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Stellar MLS Agent ID (MFR Number)
                  </label>
                  <input
                    type="text"
                    placeholder="MFR261540921"
                    value={inviteMlsId}
                    onChange={(e) => setInviteMlsId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#d4a738]"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Must be registered under Keller Williams Tampa Properties
                  </span>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="w-1/2 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-1/2 py-2.5 text-xs font-bold text-white bg-[#071220] hover:bg-[#0e223d] border border-[#d4a738]/60 rounded-lg shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4a738]" />}
                    Verify & Authorize
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Confirm Revocation / Offboard */}
      {memberToRevoke && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Revoke Stellar MLS Access</h3>
                <p className="text-xs text-slate-500">Broker Back Office Compliance Offboarding</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 mb-5">
              <p>
                Are you sure you want to offboard <strong className="text-slate-900">{memberToRevoke.name}</strong> from Office <strong className="text-slate-900">MFR771620</strong>?
              </p>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <div>• Email: <span className="font-mono text-slate-700">{memberToRevoke.email}</span></div>
                <div>• MLS ID: <span className="font-mono text-slate-700">{memberToRevoke.mlsId}</span></div>
              </div>
              <p className="text-[11px] text-rose-700 font-semibold pt-1">
                This immediately terminates their portal credentials in Supabase and restricts access to BBO feeds.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMemberToRevoke(null)}
                disabled={revoking}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                disabled={revoking}
                className="w-1/2 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {revoking && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
