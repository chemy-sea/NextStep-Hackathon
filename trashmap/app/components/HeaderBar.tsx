"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Sparkles, Plus, ShieldCheck } from "lucide-react";

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
    <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0D530E] to-[#306D29] flex items-center justify-center text-[#FCFAF7] shadow-md shadow-[#0D530E]/15 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 fill-[#FCFAF7]/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-[#0D530E] tracking-tight flex items-center gap-1.5">
                  Trash<span className="text-[#306D29]">Map</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F5F1E9] text-[#0D530E] px-2 py-0.5 rounded-full border border-[#E8E2D5]">
                    Eco-Action
                  </span>
                </span>
                <span className="text-[11px] text-[#306D29]/80 font-medium">
                  Crowdsourced Community Cleanup
                </span>
              </div>
            </Link>

            {/* Desktop Navigation links */}
            <nav className="hidden md:flex items-center gap-1.5 text-sm font-semibold">
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-xl text-[#0D530E] bg-[#F5F1E9] shadow-xs border border-[#E8E2D5] font-bold"
              >
                Bounties
              </Link>
              <Link
                href="/community"
                className="px-3.5 py-1.5 rounded-xl text-[#306D29] hover:bg-[#F5F1E9] hover:text-[#0D530E] transition-colors"
              >
                Events
              </Link>
              <Link
                href="/leaderboard"
                className="px-3.5 py-1.5 rounded-xl text-[#306D29] hover:bg-[#F5F1E9] hover:text-[#0D530E] transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                href="/profile"
                className="px-3.5 py-1.5 rounded-xl text-[#306D29] hover:bg-[#F5F1E9] hover:text-[#0D530E] transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="hidden sm:flex items-center bg-[#F5F1E9] p-1 rounded-xl border border-[#E8E2D5] text-xs">
              <span className="text-[#0D530E]/70 px-2 font-semibold">Role:</span>
              <button
                type="button"
                onClick={() => onRoleChange("citizen")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  userRole === "citizen"
                    ? "bg-[#FFFFFF] text-[#0D530E] shadow-xs border border-[#E8E2D5]/60"
                    : "text-[#306D29] hover:text-[#0D530E]"
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => onRoleChange("official")}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  userRole === "official"
                    ? "bg-[#0D530E] text-[#FCFAF7] shadow-xs"
                    : "text-[#306D29] hover:text-[#0D530E]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Official
              </button>
            </div>

            {/* User XP & Trust Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5F1E9] border border-[#E8E2D5] text-[#0D530E] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#306D29]" />
              <span>1,420 XP</span>
              <span className="text-[#306D29]">•</span>
              <span className="text-[#306D29]">★ 98% Trust</span>
            </div>

            {/* Post Bounty Button */}
            <button
              type="button"
              onClick={onOpenPostBounty}
              className="flex items-center gap-1.5 bg-[#306D29] hover:bg-[#0D530E] active:scale-95 text-[#FFFFFF] text-sm font-bold px-4 py-2 rounded-xl shadow-sm shadow-[#306D29]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post Bounty</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

