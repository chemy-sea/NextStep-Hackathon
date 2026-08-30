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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#306D29] text-[#FBF5DD] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E7E1B1] animate-ping" />
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#0D530E] text-[#E7E1B1] shadow-sm">
            <Clock className="w-3 h-3 text-[#E7E1B1]" />
            In Progress
          </span>
        );
      case "pending_verification":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#306D29] text-[#FBF5DD] shadow-sm">
            <ShieldCheck className="w-3 h-3" />
            Pending Review
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#0D530E] text-[#FBF5DD] shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-[#E7E1B1]" />
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
      className={`group relative bg-[#FFFFFF] rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-xl ${
        isSelected
          ? "border-[#306D29] ring-2 ring-[#306D29]/40 shadow-md scale-[1.01]"
          : "border-[#E8E2D5] hover:border-[#306D29]"
      }`}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-[16/10] w-full bg-[#F5F1E9] overflow-hidden">
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#0D530E] text-[#FCFAF7] border border-[#E8E2D5]/40 shadow-xs animate-pulse">
              <Flame className="w-3 h-3 text-[#FCFAF7]" />
              Event Pick
            </span>
          )}
        </div>

        {/* Points Pill */}
        <div className="absolute top-2.5 right-2.5 bg-[#0D530E]/90 backdrop-blur-md text-[#FCFAF7] font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#E8E2D5]/30 shadow-xs">
          <Sparkles className="w-3 h-3 text-[#F5F1E9]" />
          <span>{bounty.points} Pts</span>
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#FFFFFF]/95 backdrop-blur-sm text-[#0D530E] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#E8E2D5] shadow-xs">
          <MapPin className="w-3 h-3 text-[#306D29]" />
          <span>{bounty.distanceMiles} mi. away</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Trust Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-extrabold text-[#0D530E] text-base leading-snug group-hover:text-[#306D29] transition-colors line-clamp-1">
              {bounty.title}
            </h3>
            <div className="flex items-center gap-0.5 text-xs font-bold text-[#0D530E] bg-[#F5F1E9] px-2 py-0.5 rounded-md shrink-0 border border-[#E8E2D5]">
              <Award className="w-3 h-3 text-[#306D29]" />
              <span>{bounty.postedBy.reliabilityScore}%</span>
            </div>
          </div>

          {/* Location / Address */}
          <p className="text-xs text-[#306D29] flex items-center gap-1 mb-2 font-semibold">
            <span>📍</span>
            <span className="truncate">{bounty.location.address}</span>
          </p>

          {/* Metadata: Category & Time */}
          <div className="flex items-center justify-between text-[11px] text-[#0D530E]/70 pt-2.5 border-t border-[#E8E2D5] mb-3">
            <span className="capitalize font-bold text-[#0D530E] bg-[#F5F1E9] px-2 py-0.5 rounded-md border border-[#E8E2D5]">
              {bounty.wasteCategory} Waste
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-[#306D29]" />
              {bounty.timeAgo}
            </span>
          </div>
        </div>

        {/* CTA Button Footer */}
        <div className="pt-1">
          <button
            type="button"
            className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#306D29] hover:bg-[#0D530E] text-[#FFFFFF] shadow-sm shadow-[#306D29]/20 group-hover:shadow-md"
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

