"use client";

import React from "react";
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  List as ListIcon,
  Map as MapIcon,
  Columns,
  RotateCcw,
} from "lucide-react";
import { FilterState, ViewMode, BountyStatus, WasteCategory } from "@/lib/types";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalResults: number;
}

export default function FilterBar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalResults,
}: FilterBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, locationQuery: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      statusFilter: e.target.value as BountyStatus | "all",
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      categoryFilter: e.target.value as WasteCategory | "all",
    });
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      maxDistance: Number(e.target.value),
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as FilterState["sortBy"],
    });
  };

  const resetFilters = () => {
    onFilterChange({
      searchQuery: "",
      locationQuery: "Manila, Philippines",
      statusFilter: "all",
      categoryFilter: "all",
      maxDistance: 10,
      sortBy: "nearest",
      eventOnly: false,
    });
  };

  return (
    <div className="bg-[#FCFAF7] border-b border-[#E8E2D5] py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Inputs Group */}
          <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-[300px]">
            {/* Keyword Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#306D29]/70" />
              <input
                type="text"
                placeholder="Search litter (bottles, tires, cans)..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#306D29]/20 focus:border-[#306D29] text-[#0D530E] placeholder-[#306D29]/50 shadow-xs transition-colors"
              />
            </div>

            {/* Location Input */}
            <div className="relative min-w-[150px] max-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#306D29]" />
              <input
                type="text"
                placeholder="Location"
                value={filters.locationQuery}
                onChange={handleLocationChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#306D29]/20 focus:border-[#306D29] shadow-xs font-semibold text-[#0D530E]"
              />
            </div>

            {/* Distance Filter */}
            <div className="relative">
              <select
                value={filters.maxDistance}
                onChange={handleDistanceChange}
                aria-label="Filter by distance"
                className="appearance-none bg-[#FFFFFF] border border-[#E8E2D5] text-[#0D530E] text-sm font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#306D29]/20 focus:border-[#306D29] shadow-xs cursor-pointer"
              >
                <option value={1}>Distance: &lt; 1 mi</option>
                <option value={3}>Distance: &lt; 3 mi</option>
                <option value={5}>Distance: &lt; 5 mi</option>
                <option value={10}>Distance: &lt; 10 mi</option>
                <option value={50}>Distance: Any</option>
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#306D29] pointer-events-none" />
            </div>

            {/* Waste Category Filter */}
            <div className="relative">
              <select
                value={filters.categoryFilter}
                onChange={handleCategoryChange}
                aria-label="Filter by waste category"
                className="appearance-none bg-[#FFFFFF] border border-[#E8E2D5] text-[#0D530E] text-sm font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#306D29]/20 focus:border-[#306D29] shadow-xs cursor-pointer"
              >
                <option value="all">Type: All Waste</option>
                <option value="plastic">Type: Plastic</option>
                <option value="glass">Type: Glass</option>
                <option value="cans">Type: Cans / Aluminum</option>
                <option value="bulky">Type: Bulky / Tires</option>
                <option value="mixed">Type: Mixed Waste</option>
                <option value="hazardous">Type: Hazardous</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#306D29] pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.statusFilter}
                onChange={handleStatusChange}
                aria-label="Filter by status"
                className="appearance-none bg-[#FFFFFF] border border-[#E8E2D5] text-[#0D530E] text-sm font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#306D29]/20 focus:border-[#306D29] shadow-xs cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="open">🟢 Open Bounties</option>
                <option value="in_progress">🟡 In Progress</option>
                <option value="pending_verification">🟣 Pending Verification</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#306D29] pointer-events-none" />
            </div>

            {(filters.searchQuery ||
              filters.statusFilter !== "all" ||
              filters.categoryFilter !== "all" ||
              filters.maxDistance !== 10) && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-[#306D29] hover:text-[#0D530E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F1E9] font-semibold transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* View Mode Segmented Switcher (List | Map | Split) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F5F1E9] p-1 rounded-xl border border-[#E8E2D5] shadow-xs">
              <button
                type="button"
                onClick={() => onViewModeChange("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#0D530E] text-[#FCFAF7] shadow-xs"
                    : "text-[#0D530E] hover:bg-[#FFFFFF]/80"
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>List</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("split")}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "split"
                    ? "bg-[#0D530E] text-[#FCFAF7] shadow-xs"
                    : "text-[#0D530E] hover:bg-[#FFFFFF]/80"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "map"
                    ? "bg-[#0D530E] text-[#FCFAF7] shadow-xs"
                    : "text-[#0D530E] hover:bg-[#FFFFFF]/80"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results summary & Sorting */}
        <div className="flex items-center justify-between text-xs text-[#306D29] pt-2 border-t border-[#E8E2D5]">
          <div>
            <span className="font-extrabold text-[#0D530E]">{totalResults}</span>{" "}
            active bounties in{" "}
            <span className="font-bold text-[#0D530E] underline decoration-[#306D29]">
              {filters.locationQuery || "Manila, Philippines"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-[#0D530E]">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              aria-label="Sort bounties"
              className="bg-[#F5F1E9] px-2.5 py-1 rounded-lg border border-[#E8E2D5] font-bold text-[#0D530E] focus:outline-none cursor-pointer"
            >
              <option value="nearest">Nearest First</option>
              <option value="points_high">Highest Reward (Pts)</option>
              <option value="newest">Recently Posted</option>
              <option value="urgency">Highest Severity</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

