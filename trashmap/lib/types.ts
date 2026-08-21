export type BountyStatus = "open" | "in_progress" | "pending_verification" | "verified" | "disputed";

export type WasteCategory = "plastic" | "glass" | "cans" | "organic" | "hazardous" | "bulky" | "mixed";

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface PosterProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  reliabilityScore: number; // e.g. 98%
  completedCleanups: number;
  reportedCount: number;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  beforeImageUrl: string;
  afterImageUrl?: string;
  status: BountyStatus;
  points: number;
  karmaReward: number;
  wasteCategory: WasteCategory;
  severity: SeverityLevel;
  location: {
    lat: number;
    lng: number;
    address: string;
    neighborhood: string;
    city: string;
  };
  distanceMiles: number;
  postedBy: PosterProfile;
  claimedBy?: PosterProfile;
  createdAt: string;
  timeAgo: string;
  expiresAt: string;
  timeline: {
    timestamp: string;
    event: string;
    actor: string;
  }[];
  eventId?: string;
  eventTitle?: string;
  isHighReward?: boolean;
}

export type ViewMode = "split" | "list" | "map";

export interface FilterState {
  searchQuery: string;
  locationQuery: string;
  statusFilter: BountyStatus | "all";
  categoryFilter: WasteCategory | "all";
  maxDistance: number; // in miles
  sortBy: "nearest" | "points_high" | "newest" | "urgency";
  eventOnly: boolean;
}
