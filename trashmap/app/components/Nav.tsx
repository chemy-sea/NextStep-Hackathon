"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Users, Trophy, User } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/community", label: "Community", icon: Users },
    { href: "/leaderboard", label: "Rank", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav aria-label="Mobile navigation" className="md:hidden">
      {/* Mobile Fixed Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-semibold transition-all ${
                isActive
                  ? "text-emerald-700 font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 ${
                  isActive ? "text-emerald-600 stroke-[2.5]" : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
