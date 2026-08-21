// Central list of main nav screens. Add/remove entries here only —
// the Nav component and layout render from this list, so adding a new
// top-level screen later doesn't require touching navigation structure.
export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/community", label: "Community" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];
