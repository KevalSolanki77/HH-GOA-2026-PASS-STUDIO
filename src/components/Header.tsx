import React from "react";
import { MainNavTab } from "../types";
import { Sparkles, Calendar, Bookmark, Terminal, Link, Check } from "lucide-react";
import HeaderActions from "./HeaderActions";

interface HeaderProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  savedPassesCount: number;
  onOpenGallery: () => void;
  copiedLink?: boolean;
  onCopyLink?: () => void;
  onPublishPass: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedPassesCount,
  onOpenGallery,
  copiedLink,
  onCopyLink,
  onPublishPass,
}) => {
  const NAV_TABS: { id: MainNavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "PASS_STUDIO", label: "Pass Studio", icon: <Sparkles size={16} /> },
    { id: "AI_PLANNER", label: "AI Sprint Planner", icon: <Calendar size={16} /> },
    { id: "SAVED_PASSES", label: "Saved Passes", icon: <Bookmark size={16} />, badge: savedPassesCount },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/95 border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Header */}
        <div
          onClick={() => onSelectTab("PASS_STUDIO")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0284C7] via-[#0F172A] to-[#38BDF8] flex items-center justify-center text-amber-300 shadow-md border border-[#38BDF8]/40 group-hover:scale-105 transition-transform">
            <Terminal size={22} className="text-[#38BDF8]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black font-heritage tracking-tight text-white flex items-center gap-1.5">
              <span>HackerHouse Goa</span>
              <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-black uppercase border border-[#38BDF8]/40">
                2026
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold hidden sm:block">
              AI Residency & Developer Pass Studio
            </p>
          </div>
        </div>

        {/* Desktop Tab Bar */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#1E293B]/80 p-1.5 rounded-2xl border border-slate-700/60">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-md shadow-sky-900/30 border border-[#38BDF8]/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#F47C48] text-white text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <HeaderActions
            onExportPNG={onPublishPass}
            onCopyLink={onCopyLink || (() => {})}
          />
        </div>
      </div>

      {/* Mobile Horizontally Scrollable Pill Tabs */}
      <nav className="flex md:hidden overflow-x-auto no-scrollbar gap-2 px-4 py-2 border-t border-slate-800/80 w-full bg-slate-950/80">
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-md border border-[#38BDF8]/40"
                  : "bg-slate-800/80 text-slate-300 hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#F47C48] text-white text-[9px] font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
