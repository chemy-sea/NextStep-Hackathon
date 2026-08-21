"use client";

import React, { useState } from "react";
import {
  MapPin,
  Sparkles,
  Flame,
  Plus,
  Compass,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Clock,
  Award,
  ChevronRight,
  X,
} from "lucide-react";
import { Bounty } from "@/lib/types";

interface InteractiveMapProps {
  bounties: Bounty[];
  selectedBounty: Bounty | null;
  onSelectBounty: (bounty: Bounty | null) => void;
  onOpenDetailModal: (bounty: Bounty) => void;
  onOpenPostBounty: () => void;
}

export default function InteractiveMap({
  bounties,
  selectedBounty,
  onSelectBounty,
  onOpenDetailModal,
  onOpenPostBounty,
}: InteractiveMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite">("standard");

  // Map coordinates projection helper for Austin demo area (Lat: 30.24 to 30.29, Lng: -97.80 to -97.73)
  const getPinPosition = (lat: number, lng: number) => {
    const minLat = 30.245;
    const maxLat = 30.29;
    const minLng = -97.805;
    const maxLng = -97.73;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.max(8, Math.min(92, x))}%`,
      top: `${Math.max(10, Math.min(90, y))}%`,
    };
  };

  const getPinColor = (bounty: Bounty) => {
    if (bounty.isHighReward) return "bg-red-600 text-white ring-4 ring-red-400/40 animate-pulse";
    switch (bounty.status) {
      case "open":
        return "bg-blue-600 text-white ring-4 ring-blue-500/20";
      case "in_progress":
        return "bg-amber-500 text-white ring-4 ring-amber-500/20";
      case "pending_verification":
        return "bg-purple-600 text-white ring-4 ring-purple-500/20";
      case "verified":
        return "bg-emerald-600 text-white ring-4 ring-emerald-500/20";
      default:
        return "bg-slate-700 text-white";
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
      {/* Visual Map Canvas / Vector Roads & Waterways Simulation */}
      <div
        className={`absolute inset-0 transition-transform duration-300 ${
          mapStyle === "satellite" ? "bg-slate-900" : "bg-[#f4f3f0]"
        }`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
        }}
      >
        {/* River / Waterway (Lady Bird Lake & Colorado River) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -10 240 C 150 220, 280 290, 450 250 C 600 210, 750 310, 950 270 C 1100 240, 1300 320, 1600 280"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M 280 290 C 260 400, 220 520, 190 700"
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Park Zones (Zilker, Greenbelt, Town Lake) */}
          <path
            d="M 180 230 Q 320 200 340 330 Q 220 380 180 320 Z"
            fill="#dcfce7"
            opacity="0.8"
          />
          <path
            d="M 450 180 Q 560 160 580 260 Q 470 290 440 230 Z"
            fill="#dcfce7"
            opacity="0.7"
          />

          {/* Major Highways & Roads (I-35, MoPac, Hwy 71, Congress) */}
          <line
            x1="0"
            y1="340"
            x2="1600"
            y2="340"
            stroke="#ffffff"
            strokeWidth="6"
          />
          <line
            x1="0"
            y1="340"
            x2="1600"
            y2="340"
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          <line
            x1="520"
            y1="0"
            x2="520"
            y2="1000"
            stroke="#fef08a"
            strokeWidth="6"
          />
          <line
            x1="760"
            y1="0"
            x2="760"
            y2="1000"
            stroke="#ffffff"
            strokeWidth="8"
          />
          <line
            x1="760"
            y1="0"
            x2="760"
            y2="1000"
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          <line
            x1="220"
            y1="0"
            x2="220"
            y2="1000"
            stroke="#ffffff"
            strokeWidth="6"
          />

          {/* Secondary Grid Lines */}
          <line x1="0" y1="140" x2="1600" y2="140" stroke="#ffffff" strokeWidth="3" />
          <line x1="0" y1="480" x2="1600" y2="480" stroke="#ffffff" strokeWidth="3" />
          <line x1="380" y1="0" x2="380" y2="1000" stroke="#ffffff" strokeWidth="3" />
          <line x1="920" y1="0" x2="920" y2="1000" stroke="#ffffff" strokeWidth="3" />
        </svg>

        {/* City & Park Labels */}
        <div className="absolute top-[28%] left-[22%] text-xs font-bold text-emerald-800 pointer-events-none bg-emerald-100/80 px-2 py-0.5 rounded">
          Zilker Metropolitan Park
        </div>
        <div className="absolute top-[48%] left-[16%] text-xs font-bold text-emerald-800 pointer-events-none bg-emerald-100/80 px-2 py-0.5 rounded">
          Barton Creek Greenbelt
        </div>
        <div className="absolute top-[16%] left-[54%] text-sm font-extrabold text-slate-800 tracking-wider pointer-events-none bg-white/70 px-2 py-0.5 rounded">
          DOWNTOWN AUSTIN
        </div>
        <div className="absolute top-[24%] left-[64%] text-xs font-semibold text-blue-800 pointer-events-none">
          Lady Bird Lake
        </div>
      </div>

      {/* User Current Location Dot (Austin Center) */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
        style={{ left: "48%", top: "42%" }}
        title="You are here"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-blue-500/30 animate-ping absolute" />
          <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md relative z-10" />
        </div>
      </div>

      {/* Map Pins for Bounties */}
      {bounties.map((bounty) => {
        const pos = getPinPosition(bounty.location.lat, bounty.location.lng);
        const isCurrentSelected = selectedBounty?.id === bounty.id;

        return (
          <div
            key={bounty.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-110"
            style={{ left: pos.left, top: pos.top }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectBounty(isCurrentSelected ? null : bounty);
            }}
          >
            {/* Custom Pin Icon Badge */}
            <div
              className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-1 border-2 border-white transition-all ${getPinColor(
                bounty
              )} ${isCurrentSelected ? "scale-125 ring-4 ring-emerald-500 shadow-xl" : ""}`}
            >
              {bounty.isHighReward ? (
                <Flame className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>{bounty.points}</span>
            </div>

            {/* Pin pointer tip */}
            <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 shadow-xs border-r border-b border-white" />
          </div>
        );
      })}

      {/* Elevated Marker Card Preview on Map (Matches Reference Design SWISH Dental Popup) */}
      {selectedBounty && (
        <div
          className="absolute z-30 -translate-x-1/2 bottom-16 sm:bottom-auto sm:top-6 left-1/2 sm:left-auto sm:right-6 w-[310px] bg-white rounded-2xl p-3 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {/* Close Popup Button */}
            <button
              type="button"
              onClick={() => onSelectBounty(null)}
              className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Popup Image */}
            <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedBounty.beforeImageUrl}
                alt={selectedBounty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{selectedBounty.points} Pts</span>
              </div>
            </div>

            {/* Content info */}
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-slate-900 text-sm truncate pr-2">
                {selectedBounty.title}
              </h4>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                <Award className="w-3 h-3" />
                <span>{selectedBounty.postedBy.reliabilityScore}%</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-2 truncate">
              📍 {selectedBounty.location.address}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 font-medium">
              <span>{selectedBounty.distanceMiles} mi. away</span>
              <span className="capitalize">{selectedBounty.wasteCategory}</span>
            </div>

            {/* Action CTA inside Popup */}
            <button
              type="button"
              onClick={() => onOpenDetailModal(selectedBounty)}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>View Full Details & Claim</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map Control Buttons (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-2 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200" />
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
            className="p-2 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setZoomLevel(1);
            onSelectBounty(null);
          }}
          className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl shadow-md border border-slate-200 transition-colors"
          title="Recenter Map"
        >
          <Crosshair className="w-4 h-4 text-emerald-600" />
        </button>
      </div>

      {/* Map Status Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-200/80 text-[11px] font-semibold text-slate-700 hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-200" />
          <span>Open</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-purple-200" />
          <span>Pending Proof</span>
        </div>
      </div>

      {/* Quick Action Floating Button (FAB) - Bottom Right */}
      <button
        type="button"
        onClick={onOpenPostBounty}
        className="absolute bottom-6 right-6 z-30 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm px-5 py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 flex items-center gap-2 transition-all cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
          <Plus className="w-4 h-4" />
        </div>
        <span>Post Bounty</span>
      </button>
    </div>
  );
}
