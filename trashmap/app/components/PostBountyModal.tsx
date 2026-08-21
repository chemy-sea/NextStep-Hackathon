"use client";

import React, { useState } from "react";
import {
  X,
  Camera,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Clock,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Bounty, WasteCategory, SeverityLevel } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data";

interface PostBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostBounty: (newBounty: Bounty) => void;
}

export default function PostBountyModal({
  isOpen,
  onClose,
  onPostBounty,
}: PostBountyModalProps) {
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80"
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wasteCategory, setWasteCategory] = useState<WasteCategory>("plastic");
  const [severity, setSeverity] = useState<SeverityLevel>("medium");
  const [address, setAddress] = useState("Lady Bird Lake Trail - South Shore");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [points, setPoints] = useState(200);

  if (!isOpen) return null;

  // Auto calculate suggested points based on severity & waste type
  const calculatePoints = (sev: SeverityLevel, cat: WasteCategory) => {
    let base = 100;
    if (sev === "low") base = 100;
    if (sev === "medium") base = 200;
    if (sev === "high") base = 350;
    if (sev === "critical") base = 500;
    if (cat === "hazardous" || cat === "bulky") base += 50;
    return base;
  };

  const handleSeverityChange = (newSev: SeverityLevel) => {
    setSeverity(newSev);
    setPoints(calculatePoints(newSev, wasteCategory));
  };

  const handleCategoryChange = (newCat: WasteCategory) => {
    setWasteCategory(newCat);
    setPoints(calculatePoints(severity, newCat));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newBounty: Bounty = {
        id: `bounty-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || `Litter reported at ${address}.`,
        beforeImageUrl: capturedImageUrl,
        status: "open",
        points: points,
        karmaReward: Math.round(points * 0.2),
        wasteCategory: wasteCategory,
        severity: severity,
        location: {
          lat: 30.2600 + (Math.random() - 0.5) * 0.02,
          lng: -97.7550 + (Math.random() - 0.5) * 0.02,
          address: address,
          neighborhood: "South Congress / Trail",
          city: "Austin, TX",
        },
        distanceMiles: 0.5,
        postedBy: MOCK_USERS.alex,
        createdAt: new Date().toISOString(),
        timeAgo: "Just now",
        expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(),
        timeline: [
          {
            timestamp: "Just now",
            event: "Bounty reported with verified live camera & GPS",
            actor: "You (@alex_eco)",
          },
          {
            timestamp: "Just now",
            event: "Passed anti-fraud duplicate & cooldown scan",
            actor: "TrashMap System",
          },
        ],
      };

      onPostBounty(newBounty);
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Post a Litter Bounty
              </h2>
              <p className="text-[11px] text-slate-500">
                Pin litter, set a reward & earn +25 Spotter Karma
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {/* Camera Capture Section (Anti-fraud live capture requirement) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>1. Live Photo Evidence</span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Live Camera Only
                </span>
              </label>
              <span className="text-[11px] text-slate-400">
                Gallery upload blocked
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-white">
              {photoCaptured ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capturedImageUrl}
                    alt="Captured litter"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Camera Capture</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoCaptured(false)}
                    className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-xs transition-colors"
                  >
                    Retake Photo
                  </button>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-pulse">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">
                      Take Live Photo on Location
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Live camera capture embeds GPS coordinates and prevents fake reports.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoCaptured(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    📸 Open Camera & Snap Photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* GPS Auto-Tagged Location */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              2. Pinned Location
            </label>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="GPS Auto-Detected Address"
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded shrink-0">
                GPS ±3m
              </span>
            </div>
          </div>

          {/* Bounty Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                3. Title / Litter Summary
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Broken glass and plastic cups by park bench"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Description & Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Add helpful details for cleanup crews (e.g. bring heavy gloves, trash bags needed)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Waste Category & Severity Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Waste Category
              </label>
              <select
                value={wasteCategory}
                onChange={(e) => handleCategoryChange(e.target.value as WasteCategory)}
                className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="plastic">🥤 Plastic Bottles / Food Ware</option>
                <option value="cans">🥫 Cans & Aluminum</option>
                <option value="glass">🍾 Glass Bottles / Shards</option>
                <option value="bulky">🛞 Bulky Waste / Tires</option>
                <option value="hazardous">⚠️ Hazardous / Chemical</option>
                <option value="mixed">📦 Mixed Litter</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Estimated Severity
              </label>
              <select
                value={severity}
                onChange={(e) => handleSeverityChange(e.target.value as SeverityLevel)}
                className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="low">🟢 Low (Small scattered items)</option>
                <option value="medium">🟡 Medium (Bag-sized cleanup)</option>
                <option value="high">🟠 High (Multiple bags / dump)</option>
                <option value="critical">🔴 Critical (Hazard / immediate)</option>
              </select>
            </div>
          </div>

          {/* Suggested Points & Spotter Karma Box */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  Calculated Bounty Reward
                </span>
                <span className="text-[11px] text-emerald-800">
                  Cleaners receive {points} Pts • You earn +{Math.round(points * 0.2)} Karma
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-emerald-700">
                {points} Pts
              </span>
            </div>
          </div>

          {/* Anti-Fraud Cooldown Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Anti-Spam Cooldown:</strong> Users are limited to 3 active bounties within a 500m radius every 2 hours to ensure high signal quality.
            </span>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isSubmitting ? "Publishing Bounty..." : "Publish Bounty to Live Map"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
