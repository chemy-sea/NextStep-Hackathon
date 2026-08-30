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
  Flame,
  Camera,
  Share2,
  Flag,
} from "lucide-react";
import { Bounty } from "@/lib/types";

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
  onClaimBounty,
  onSubmitProof,
  onVerifyBounty,
}: BountyDetailModalProps) {
  const [showCameraSimulation, setShowCameraSimulation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen || !bounty) return null;

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#306D29] text-[#FBF5DD] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E7E1B1] animate-ping" />
            Open for Cleanup
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#0D530E] text-[#E7E1B1] shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            In Progress (Claimed)
          </span>
        );
      case "pending_verification":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#306D29] text-[#FBF5DD] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pending Verification
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#0D530E] text-[#FBF5DD] shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E7E1B1]" />
            Verified & Cleaned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0D530E]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-[#0D530E] text-[#FCFAF7] px-5 py-3 rounded-2xl shadow-2xl border border-[#E8E2D5] text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span>{successToast}</span>
        </div>
      )}

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-[#FCFAF7] rounded-3xl shadow-2xl border border-[#E8E2D5] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#FCFAF7]">
          <div className="flex items-center gap-2.5">
            {getStatusBadge()}
            {bounty.isHighReward && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-[#0D530E] text-[#FCFAF7] border border-[#E8E2D5]/40 shadow-xs animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                Featured Event
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F1E9] hover:bg-[#306D29] text-[#0D530E] hover:text-[#FCFAF7] flex items-center justify-center transition-colors cursor-pointer"
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0D530E]/70">
                Evidence Photos
              </span>
              <span className="text-xs text-[#306D29] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Camera Verified
              </span>
            </div>

            {bounty.afterImageUrl ? (
              /* Before vs After Comparison Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F5F1E9] border border-[#E8E2D5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bounty.beforeImageUrl}
                    alt="Before Cleanup"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#0D530E]/80 backdrop-blur-xs text-[#FCFAF7] text-[11px] font-bold px-2 py-0.5 rounded-md">
                    BEFORE
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F5F1E9] border border-[#306D29] ring-2 ring-[#306D29]/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bounty.afterImageUrl}
                    alt="After Cleanup"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#306D29] text-[#FFFFFF] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3 text-[#F5F1E9]" />
                    AFTER CLEANUP
                  </div>
                </div>
              </div>
            ) : (
              /* Single Before Photo */
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#F5F1E9] border border-[#E8E2D5] shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bounty.beforeImageUrl}
                  alt={bounty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#0D530E]/80 backdrop-blur-md text-[#FCFAF7] text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 border border-[#E8E2D5]/30">
                  <MapPin className="w-3.5 h-3.5 text-[#F5F1E9]" />
                  <span>{bounty.location.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Title & Reward Info Block */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0D530E]">
                {bounty.title}
              </h2>

              <div className="flex items-center gap-2 bg-gradient-to-r from-[#0D530E] to-[#306D29] text-[#FCFAF7] px-4 py-2 rounded-2xl shadow-md border border-[#E8E2D5]/30">
                <Sparkles className="w-5 h-5 text-[#F5F1E9]" />
                <div className="flex flex-col text-right">
                  <span className="text-xs uppercase font-bold text-[#F5F1E9] leading-none">
                    Reward
                  </span>
                  <span className="text-lg font-black leading-tight text-[#FFFFFF]">
                    {bounty.points} Pts
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[#306D29] text-sm leading-relaxed mb-4 font-medium">
              {bounty.description}
            </p>

            {/* Key Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#E8E2D5] text-xs shadow-xs">
              <div>
                <span className="text-[#0D530E]/70 block text-[10px] uppercase font-extrabold">
                  Distance
                </span>
                <span className="font-bold text-[#0D530E] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#306D29]" />
                  {bounty.distanceMiles} mi away
                </span>
              </div>

              <div>
                <span className="text-[#0D530E]/70 block text-[10px] uppercase font-extrabold">
                  Category
                </span>
                <span className="font-bold text-[#0D530E] capitalize">
                  {bounty.wasteCategory}
                </span>
              </div>

              <div>
                <span className="text-[#0D530E]/70 block text-[10px] uppercase font-extrabold">
                  Severity
                </span>
                <span className="font-bold text-[#0D530E] capitalize">
                  {bounty.severity} Level
                </span>
              </div>

              <div>
                <span className="text-[#0D530E]/70 block text-[10px] uppercase font-extrabold">
                  Karma Bounty
                </span>
                <span className="font-bold text-[#306D29]">
                  +{bounty.karmaReward} Karma
                </span>
              </div>
            </div>
          </div>

          {/* Poster & Trust Score Box */}
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bounty.postedBy.avatarUrl}
                alt={bounty.postedBy.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#306D29]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#0D530E]">
                    {bounty.postedBy.name}
                  </span>
                  <span className="text-xs text-[#306D29]">
                    @{bounty.postedBy.username}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#0D530E]/70 mt-0.5 font-medium">
                  <span>Reported {bounty.timeAgo}</span>
                  <span>•</span>
                  <span>{bounty.postedBy.reportedCount} Verified Posts</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 bg-[#F5F1E9] text-[#0D530E] px-2.5 py-1 rounded-xl text-xs font-bold border border-[#E8E2D5]">
                <Award className="w-3.5 h-3.5 text-[#306D29]" />
                <span>{bounty.postedBy.reliabilityScore}% Trust</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline Log */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0D530E]/70 mb-2.5">
              Activity & Verification Timeline
            </h4>
            <div className="space-y-2 border-l-2 border-[#E8E2D5] pl-4 ml-2">
              {bounty.timeline.map((item, idx) => (
                <div key={idx} className="relative text-xs">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#306D29] ring-4 ring-[#FCFAF7]" />
                  <span className="font-bold text-[#0D530E]">{item.timestamp}</span>{" "}
                  — <span className="text-[#306D29]">{item.event}</span>{" "}
                  <span className="text-[#0D530E]/60">({item.actor})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Live Camera Flow Modal View */}
          {showCameraSimulation && (
            <div className="p-4 rounded-2xl bg-[#0D530E] text-[#FCFAF7] space-y-3 animate-in fade-in duration-200 border border-[#E8E2D5]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Camera className="w-4 h-4 text-[#F5F1E9] animate-pulse" />
                  <span>Simulating Live Camera Capture</span>
                </div>
                <span className="text-[10px] uppercase font-extrabold bg-[#306D29] px-2 py-0.5 rounded text-[#FCFAF7]">
                  Gallery Blocked
                </span>
              </div>
              <p className="text-xs text-[#F5F1E9] leading-relaxed">
                TrashMap requires on-site live camera capture to ensure proof authenticity and prevent recycled photos.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSimulatedCameraSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#306D29] hover:bg-[#F5F1E9] hover:text-[#0D530E] font-bold text-xs rounded-xl text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Uploading & Verifying GPS..." : "📸 Take Photo & Submit Proof"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCameraSimulation(false)}
                  className="px-3 py-2 bg-[#0D530E] hover:bg-[#306D29] text-xs rounded-xl text-[#F5F1E9] border border-[#E8E2D5]/40 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8E2D5] bg-[#FCFAF7] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="p-2.5 rounded-xl border border-[#E8E2D5] text-[#0D530E] hover:bg-[#F5F1E9] transition-colors cursor-pointer"
              title="Share Bounty"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2.5 rounded-xl border border-[#E8E2D5] text-[#306D29] hover:bg-[#F5F1E9] transition-colors cursor-pointer"
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
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-[#0D530E] font-bold text-xs hover:bg-[#F5F1E9] transition-colors cursor-pointer"
                  >
                    Flag Suspicious
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOfficialReview(true)}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#306D29] hover:bg-[#0D530E] text-[#FFFFFF] font-bold text-xs shadow-sm shadow-[#306D29]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Payout</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs text-[#0D530E]/70 font-semibold self-center">
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
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#306D29] hover:bg-[#0D530E] active:scale-95 text-[#FFFFFF] font-black text-sm rounded-2xl shadow-lg shadow-[#306D29]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#F5F1E9]" />
                  <span>{isSubmitting ? "Claiming..." : "Accept Bounty (Start Cleaning)"}</span>
                </button>
              ) : bounty.status === "in_progress" ? (
                <button
                  type="button"
                  onClick={() => setShowCameraSimulation(true)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#306D29] hover:bg-[#0D530E] active:scale-95 text-[#FFFFFF] font-black text-sm rounded-2xl shadow-lg shadow-[#306D29]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5 text-[#F5F1E9]" />
                  <span>Submit Proof Photo</span>
                </button>
              ) : bounty.status === "pending_verification" ? (
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D530E] bg-[#F5F1E9] px-4 py-2.5 rounded-xl border border-[#E8E2D5]">
                  <ShieldCheck className="w-4 h-4 text-[#306D29]" />
                  <span>Awaiting official verification — Points pending</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D530E] bg-[#F5F1E9] px-4 py-2.5 rounded-xl border border-[#E8E2D5]">
                  <CheckCircle2 className="w-4 h-4 text-[#306D29]" />
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

