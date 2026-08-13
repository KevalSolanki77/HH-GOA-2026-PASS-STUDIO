import React, { useEffect, useState } from "react";
import { Sparkles, Calendar, Ticket, Download, Search, X, Terminal, Command } from "lucide-react";
import { MainNavTab } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: MainNavTab) => void;
  onSparkAI: () => void;
  onExportPNG: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSparkAI,
  onExportPNG,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "pass_studio",
      title: "Navigate to Pass Studio",
      icon: Ticket,
      color: "text-sky-400",
      action: () => onNavigate("PASS_STUDIO"),
    },
    {
      id: "ai_planner",
      title: "Navigate to AI Sprint Planner",
      icon: Calendar,
      color: "text-amber-400",
      action: () => onNavigate("AI_PLANNER"),
    },
    {
      id: "spark_ai",
      title: "Spark AI Identity",
      icon: Sparkles,
      color: "text-purple-400",
      action: onSparkAI,
    },
    {
      id: "export_png",
      title: "Export Pass PNG",
      icon: Download,
      color: "text-emerald-400",
      action: onExportPNG,
    },
  ];

  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-800 py-3">
          <Search size={18} className="text-slate-400 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a command or search (e.g. Pass Studio, AI, Export)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
              Esc
            </span>
            <button
              onClick={onClose}
              aria-label="Close command palette"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
          <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 px-3 py-1 flex items-center justify-between">
            <span>Quick Actions</span>
            <span className="flex items-center gap-0.5 text-[10px]">
              <Command size={10} /> + K
            </span>
          </div>

          {filteredActions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              No matching commands found
            </div>
          ) : (
            filteredActions.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 text-xs font-bold flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp size={16} className={item.color} />
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300 font-mono">
                    ↵ Select
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
