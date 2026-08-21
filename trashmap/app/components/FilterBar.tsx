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
      locationQuery: "Austin, TX",
      statusFilter: "all",
      categoryFilter: "all",
      maxDistance: 10,
      sortBy: "nearest",
      eventOnly: false,
    });
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Inputs Group */}
          <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[300px]">
            {/* Keyword Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search litter (bottles, tires, cans)..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
              />
            </div>

            {/* Location Input */}
            <div className="relative min-w-[150px] max-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                type="text"
                placeholder="Location"
                value={filters.locationQuery}
                onChange={handleLocationChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-medium text-slate-700"
              />
            </div>

            {/* Distance Filter */}
            <div className="relative">
              <select
                value={filters.maxDistance}
                onChange={handleDistanceChange}
                aria-label="Filter by distance"
                className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer"
              >
                <option value={1}>Distance: &lt; 1 mi</option>
                <option value={3}>Distance: &lt; 3 mi</option>
                <option value={5}>Distance: &lt; 5 mi</option>
                <option value={10}>Distance: &lt; 10 mi</option>
                <option value={50}>Distance: Any</option>
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Waste Category Filter */}
            <div className="relative">
              <select
                value={filters.categoryFilter}
                onChange={handleCategoryChange}
                aria-label="Filter by waste category"
                className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer"
              >
                <option value="all">Type: All Waste</option>
                <option value="plastic">Type: Plastic</option>
                <option value="glass">Type: Glass</option>
                <option value="cans">Type: Cans / Aluminum</option>
                <option value="bulky">Type: Bulky / Tires</option>
                <option value="mixed">Type: Mixed Waste</option>
                <option value="hazardous">Type: Hazardous</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.statusFilter}
                onChange={handleStatusChange}
                aria-label="Filter by status"
                className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="open">🔵 Open Bounties</option>
                <option value="in_progress">🟡 In Progress</option>
                <option value="pending_verification">🟣 Pending Verification</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {(filters.searchQuery ||
              filters.statusFilter !== "all" ||
              filters.categoryFilter !== "all" ||
              filters.maxDistance !== 10) && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* View Mode Segmented Switcher (List | Map | Split) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
              <button
                type="button"
                onClick={() => onViewModeChange("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>List</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("split")}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "split"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "map"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results summary & Sorting */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
          <div>
            <span className="font-semibold text-slate-800">{totalResults}</span>{" "}
            active bounties in{" "}
            <span className="font-semibold text-emerald-700">
              {filters.locationQuery || "Austin, TX"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              aria-label="Sort bounties"
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
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
