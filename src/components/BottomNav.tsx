import React from "react";
import { MainNavTab } from "../types";
import { Sparkles, Calendar, Bookmark } from "lucide-react";

interface BottomNavProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  savedPassesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  savedPassesCount,
}) => {
  const NAV_ITEMS: { id: MainNavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "PASS_STUDIO", label: "Pass Studio", icon: <Sparkles size={18} /> },
    { id: "AI_PLANNER", label: "AI Sprint", icon: <Calendar size={18} /> },
    { id: "SAVED_PASSES", label: "Badges", icon: <Bookmark size={18} />, badge: savedPassesCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 border-t border-slate-800 backdrop-blur-md px-4 py-2 md:hidden shadow-2xl">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
                isActive
                  ? "text-[#38BDF8] font-black scale-105"
                  : "text-slate-400 font-bold hover:text-white"
              }`}
            >
              {item.icon}
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-[#F47C48] text-white text-[9px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
