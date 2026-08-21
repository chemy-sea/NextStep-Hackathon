"use client";

import React from "react";
import {
  MapPin,
  Clock,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Bounty } from "@/lib/types";

interface BountyCardProps {
  bounty: Bounty;
  isSelected?: boolean;
  onSelect: (bounty: Bounty) => void;
}

export default function BountyCard({
  bounty,
  isSelected,
  onSelect,
}: BountyCardProps) {
  const getStatusBadge = () => {
    switch (bounty.status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case "pending_verification":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white shadow-xs">
            <ShieldCheck className="w-3 h-3" />
            Pending Review
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            Cleaned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(bounty)}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-lg ${
        isSelected
          ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bounty.beforeImageUrl}
          alt={bounty.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {getStatusBadge()}
          {bounty.isHighReward && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs animate-pulse">
              <Flame className="w-3 h-3" />
              Event Pick
            </span>
          )}
        </div>

        {/* Points Pill */}
        <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-amber-300 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{bounty.points} Pts</span>
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>{bounty.distanceMiles} mi. away</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Trust Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
              {bounty.title}
            </h3>
            <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>{bounty.postedBy.reliabilityScore}%</span>
            </div>
          </div>

          {/* Location / Address */}
          <p className="text-xs text-slate-600 flex items-center gap-1 mb-2 font-medium">
            <span className="text-slate-400">📍</span>
            <span className="truncate">{bounty.location.address}</span>
          </p>

          {/* Metadata: Category & Time */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mb-3">
            <span className="capitalize font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {bounty.wasteCategory} Waste
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {bounty.timeAgo}
            </span>
          </div>
        </div>

        {/* CTA Button Footer */}
        <div className="pt-1">
          <button
            type="button"
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              bounty.status === "open"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs group-hover:shadow-emerald-500/20"
                : bounty.status === "in_progress"
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            <span>
              {bounty.status === "open"
                ? "View & Claim Bounty"
                : bounty.status === "in_progress"
                ? "View Active Cleanup"
                : "Review Proof"}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
