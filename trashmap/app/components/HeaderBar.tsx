"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Sparkles, Plus, Award, User, ShieldCheck } from "lucide-react";

interface HeaderBarProps {
  userRole: "citizen" | "official";
  onRoleChange: (role: "citizen" | "official") => void;
  onOpenPostBounty: () => void;
}

export default function HeaderBar({
  userRole,
  onRoleChange,
  onOpenPostBounty,
}: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-1">
                  Trash<span className="text-emerald-600">Map</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                    Gamified
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Crowdsourced Community Cleanup
                </span>
              </div>
            </Link>

            {/* Desktop Navigation links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 font-semibold"
              >
                Bounties
              </Link>
              <Link
                href="/community"
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Events
              </Link>
              <Link
                href="/leaderboard"
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                href="/profile"
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Demo Role Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 px-2 font-medium">Role:</span>
              <button
                type="button"
                onClick={() => onRoleChange("citizen")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  userRole === "citizen"
                    ? "bg-white text-emerald-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => onRoleChange("official")}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                  userRole === "official"
                    ? "bg-white text-purple-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Official (Reviewer)
              </button>
            </div>

            {/* User XP & Trust Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>1,420 XP</span>
              <span className="text-amber-400">•</span>
              <span className="text-emerald-700">★ 98% Trust</span>
            </div>

            {/* Post Bounty Button */}
            <button
              type="button"
              onClick={onOpenPostBounty}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-3.5 py-2 rounded-xl shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Bounty</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
