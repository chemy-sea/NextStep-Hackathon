"use client";

import React, { useState, useMemo } from "react";
import HeaderBar from "./HeaderBar";
import FilterBar from "./FilterBar";
import BountyCard from "./BountyCard";
import InteractiveMap from "./InteractiveMap";
import BountyDetailModal from "./BountyDetailModal";
import PostBountyModal from "./PostBountyModal";
import { Bounty, FilterState, ViewMode } from "@/lib/types";
import { INITIAL_BOUNTIES, MOCK_USERS } from "@/lib/mock-data";
import { Sparkles, Users, Award, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

export default function SplitExplorer() {
  const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [modalBounty, setModalBounty] = useState<Bounty | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<"citizen" | "official">("citizen");
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    locationQuery: "Austin, TX",
    statusFilter: "all",
    categoryFilter: "all",
    maxDistance: 10,
    sortBy: "nearest",
    eventOnly: false,
  });

  // Filter & Sort Bounties logic
  const filteredBounties = useMemo(() => {
    return bounties
      .filter((b) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = b.title.toLowerCase().includes(q);
          const matchesDesc = b.description.toLowerCase().includes(q);
          const matchesAddress = b.location.address.toLowerCase().includes(q);
          const matchesCat = b.wasteCategory.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesAddress && !matchesCat) {
            return false;
          }
        }

        // Status filter
        if (filters.statusFilter !== "all" && b.status !== filters.statusFilter) {
          return false;
        }

        // Category filter
        if (filters.categoryFilter !== "all" && b.wasteCategory !== filters.categoryFilter) {
          return false;
        }

        // Distance filter
        if (b.distanceMiles > filters.maxDistance) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "nearest") {
          return a.distanceMiles - b.distanceMiles;
        }
        if (filters.sortBy === "points_high") {
          return b.points - a.points;
        }
        if (filters.sortBy === "urgency") {
          const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.severity] - urgencyOrder[a.severity];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [bounties, filters]);

  // Open detail modal when a card or map popup is clicked
  const handleOpenDetailModal = (bounty: Bounty) => {
    setModalBounty(bounty);
    setIsDetailModalOpen(true);
  };

  // State Handler: Claim bounty
  const handleClaimBounty = (bountyId: string) => {
    setBounties((prev) =>
      prev.map((b) =>
        b.id === bountyId
          ? {
              ...b,
              status: "in_progress",
              claimedBy: MOCK_USERS.alex,
              timeline: [
                ...b.timeline,
                {
                  timestamp: "Just now",
                  event: "Bounty claimed & cleaning started",
                  actor: "You (@alex_eco)",
                },
              ],
            }
          : b
      )
    );

    if (modalBounty?.id === bountyId) {
      setModalBounty((prev) =>
        prev
          ? {
              ...prev,
              status: "in_progress",
              claimedBy: MOCK_USERS.alex,
            }
          : null
      );
    }
  };

  // State Handler: Submit proof
  const handleSubmitProof = (bountyId: string, proofImageUrl: string) => {
    setBounties((prev) =>
      prev.map((b) =>
        b.id === bountyId
          ? {
              ...b,
              status: "pending_verification",
              afterImageUrl: proofImageUrl,
              timeline: [
                ...b.timeline,
                {
                  timestamp: "Just now",
                  event: "After cleanup proof photo submitted",
                  actor: "You (@alex_eco)",
                },
              ],
            }
          : b
      )
    );

    if (modalBounty?.id === bountyId) {
      setModalBounty((prev) =>
        prev
          ? {
              ...prev,
              status: "pending_verification",
              afterImageUrl: proofImageUrl,
            }
          : null
      );
    }
  };

  // State Handler: Official review
  const handleVerifyBounty = (bountyId: string, approved: boolean) => {
    setBounties((prev) =>
      prev.map((b) =>
        b.id === bountyId
          ? {
              ...b,
              status: approved ? "verified" : "disputed",
              timeline: [
                ...b.timeline,
                {
                  timestamp: "Just now",
                  event: approved
                    ? "Cleanup approved & points awarded"
                    : "Flagged for follow-up review",
                  actor: "Austin Parks Official",
                },
              ],
            }
          : b
      )
    );

    if (modalBounty?.id === bountyId) {
      setModalBounty((prev) =>
        prev
          ? {
              ...prev,
              status: approved ? "verified" : "disputed",
            }
          : null
      );
    }
  };

  // State Handler: Add new bounty
  const handlePostBounty = (newBounty: Bounty) => {
    setBounties((prev) => [newBounty, ...prev]);
    setSelectedBounty(newBounty);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Universal Header */}
      <HeaderBar
        userRole={userRole}
        onRoleChange={setUserRole}
        onOpenPostBounty={() => setIsPostModalOpen(true)}
      />

      {/* Filter & View Switcher Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredBounties.length}
      />

      {/* Main Responsive Split Discovery View (Matches Reference Design) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Bounty Cards Grid (Visible in 'split' or 'list' mode) */}
          <div
            className={`space-y-4 ${
              viewMode === "map"
                ? "hidden"
                : viewMode === "list"
                ? "lg:col-span-12"
                : "lg:col-span-6"
            }`}
          >
            {/* Section Heading Banner */}
            <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Explore Litter Bounties in{" "}
                  <span className="text-emerald-700">
                    {filters.locationQuery || "Austin, TX"}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {filteredBounties.length} active bounties nearby • Clean up & earn rewards
                </p>
              </div>
            </div>

            {/* Cards Grid: 2 columns on desktop (like reference design) */}
            {filteredBounties.length > 0 ? (
              <div
                className={`grid gap-4 ${
                  viewMode === "list"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {filteredBounties.map((bounty) => (
                  <BountyCard
                    key={bounty.id}
                    bounty={bounty}
                    isSelected={selectedBounty?.id === bounty.id}
                    onSelect={(b) => {
                      setSelectedBounty(b);
                      handleOpenDetailModal(b);
                    }}
                  />
                ))}

                {/* Callout Card (Matches Reference Design promo card: "Want to view all of our results?") */}
                <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between shadow-md border border-emerald-800/40">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base mb-1 text-emerald-100">
                      Organizing a Community Cleanup?
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Create sponsor-funded event pools, invite neighborhood teams, and earn verified civic impact badges.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Post New Bounty Pool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  No bounties match your filters
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Try widening your distance radius, clearing category filters, or be the first to spot and report litter in this area!
                </p>
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  + Post a New Bounty
                </button>
              </div>
            )}
          </div>

          {/* Right Pane: Interactive Map (Visible in 'split' or 'map' mode) */}
          <div
            className={`sticky top-20 h-[calc(100vh-160px)] min-h-[500px] ${
              viewMode === "list"
                ? "hidden"
                : viewMode === "map"
                ? "lg:col-span-12"
                : "lg:col-span-6"
            }`}
          >
            <InteractiveMap
              bounties={filteredBounties}
              selectedBounty={selectedBounty}
              onSelectBounty={setSelectedBounty}
              onOpenDetailModal={handleOpenDetailModal}
              onOpenPostBounty={() => setIsPostModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Bounty Detail Modal */}
      <BountyDetailModal
        bounty={modalBounty}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setModalBounty(null);
        }}
        userRole={userRole}
        currentUserId={MOCK_USERS.alex.id}
        onClaimBounty={handleClaimBounty}
        onSubmitProof={handleSubmitProof}
        onVerifyBounty={handleVerifyBounty}
      />

      {/* Post Bounty Modal Flow */}
      <PostBountyModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostBounty={handlePostBounty}
      />
    </div>
  );
}
