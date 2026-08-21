"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Sparkles,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Camera,
  Share2,
  Flag,
  Calendar,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { Bounty, PosterProfile } from "@/lib/types";

interface BountyDetailModalProps {
  bounty: Bounty | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: "citizen" | "official";
  currentUserId: string;
  onClaimBounty: (bountyId: string) => void;
  onSubmitProof: (bountyId: string, proofImageUrl: string) => void;
  onVerifyBounty: (bountyId: string, approved: boolean) => void;
}

export default function BountyDetailModal({
  bounty,
  isOpen,
  onClose,
  userRole,
  currentUserId,
  onClaimBounty,
  onSubmitProof,
  onVerifyBounty,
}: BountyDetailModalProps) {
  const [proofSubmittedUrl, setProofSubmittedUrl] = useState<string | null>(null);
  const [showCameraSimulation, setShowCameraSimulation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen || !bounty) return null;

  const isClaimedByMe = bounty.claimedBy?.id === currentUserId;

  const handleClaim = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onClaimBounty(bounty.id);
      setIsSubmitting(false);
      setSuccessToast("🎉 Bounty Claimed! You have 24h to clean up and submit proof.");
      setTimeout(() => setSuccessToast(null), 4000);
    }, 600);
  };

  const handleSimulatedCameraSubmit = () => {
    setIsSubmitting(true);
    const mockAfterPhoto =
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80";
    setTimeout(() => {
      onSubmitProof(bounty.id, mockAfterPhoto);
      setShowCameraSimulation(false);
      setIsSubmitting(false);
      setSuccessToast("📸 Proof Submitted! Your points are pending official review.");
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1000);
  };

  const handleOfficialReview = (approved: boolean) => {
    onVerifyBounty(bounty.id, approved);
    setSuccessToast(
      approved
        ? "✅ Bounty Approved! Points distributed to the cleaner."
        : "⚠️ Bounty Flagged for further investigation."
    );
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const getStatusBadge = () => {
    switch (bounty.status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Open for Cleanup
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            In Progress (Claimed)
          </span>
        );
      case "pending_verification":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-600 text-white shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pending Verification
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified & Cleaned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span>{successToast}</span>
        </div>
      )}

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            {getStatusBadge()}
            {bounty.isHighReward && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white shadow-xs animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                Featured Event
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Media Section: Before Photo & Optional After Comparison */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evidence Photos
              </span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Camera Verified
              </span>
            </div>

            {bounty.afterImageUrl ? (
              /* Before vs After Comparison Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bounty.beforeImageUrl}
                    alt="Before Cleanup"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                    BEFORE
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-emerald-500 ring-2 ring-emerald-500/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bounty.afterImageUrl}
                    alt="After Cleanup"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    AFTER CLEANUP
                  </div>
                </div>
              </div>
            ) : (
              /* Single Before Photo */
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bounty.beforeImageUrl}
                  alt={bounty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{bounty.location.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Title & Reward Info Block */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {bounty.title}
              </h2>

              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-2xl shadow-md shadow-amber-500/20">
                <Sparkles className="w-5 h-5" />
                <div className="flex flex-col text-right">
                  <span className="text-xs uppercase font-semibold text-amber-100 leading-none">
                    Reward
                  </span>
                  <span className="text-lg font-black leading-tight">
                    {bounty.points} Pts
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {bounty.description}
            </p>

            {/* Key Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Distance
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {bounty.distanceMiles} mi away
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Category
                </span>
                <span className="font-bold text-slate-800 capitalize">
                  {bounty.wasteCategory}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Severity
                </span>
                <span className="font-bold text-slate-800 capitalize">
                  {bounty.severity} Level
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Karma Bounty
                </span>
                <span className="font-bold text-emerald-700">
                  +{bounty.karmaReward} Karma
                </span>
              </div>
            </div>
          </div>

          {/* Poster & Trust Score Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bounty.postedBy.avatarUrl}
                alt={bounty.postedBy.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900">
                    {bounty.postedBy.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    @{bounty.postedBy.username}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>Reported {bounty.timeAgo}</span>
                  <span>•</span>
                  <span>{bounty.postedBy.reportedCount} Verified Posts</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl text-xs font-bold border border-emerald-200">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>{bounty.postedBy.reliabilityScore}% Trust</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline Log (Anti-fraud proof check) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Activity & Verification Timeline
            </h4>
            <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
              {bounty.timeline.map((item, idx) => (
                <div key={idx} className="relative text-xs">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <span className="font-bold text-slate-700">{item.timestamp}</span>{" "}
                  — <span className="text-slate-600">{item.event}</span>{" "}
                  <span className="text-slate-400">({item.actor})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Live Camera Flow Modal View */}
          {showCameraSimulation && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Camera className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Simulating Live Camera Capture</span>
                </div>
                <span className="text-[10px] uppercase font-extrabold bg-red-600 px-2 py-0.5 rounded text-white">
                  Gallery Blocked
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                TrashMap requires on-site live camera capture to ensure proof authenticity and prevent recycled photos.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSimulatedCameraSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl text-white transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Uploading & Verifying GPS..." : "📸 Take Photo & Submit Proof"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCameraSimulation(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="Share Bounty"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors"
              title="Report suspicious post"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Role-Based CTAs */}
          <div className="w-full sm:w-auto flex-1 flex justify-end gap-2">
            {userRole === "official" ? (
              /* Official Role Controls */
              bounty.status === "pending_verification" ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleOfficialReview(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-red-300 text-red-700 font-bold text-xs hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Flag Suspicious
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOfficialReview(true)}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Payout</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-500 self-center">
                  Official view: Bounty is currently {bounty.status}
                </span>
              )
            ) : (
              /* Citizen Role Controls */
              bounty.status === "open" ? (
                <button
                  type="button"
                  onClick={handleClaim}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isSubmitting ? "Claiming..." : "Accept Bounty (Start Cleaning)"}</span>
                </button>
              ) : bounty.status === "in_progress" ? (
                <button
                  type="button"
                  onClick={() => setShowCameraSimulation(true)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Submit Proof Photo</span>
                </button>
              ) : bounty.status === "pending_verification" ? (
                <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Awaiting official verification — Points pending</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cleanup Verified & Points Awarded</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
