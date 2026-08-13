import React from "react";
import { PassData } from "../types";
import { THEMES } from "../constants/themes";
import { X, Trash2, PlusCircle, ArrowUpRight } from "lucide-react";

interface PassGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  savedPasses: PassData[];
  onSelectPass: (pass: PassData) => void;
  onDeletePass: (id: string) => void;
  onNewPass: () => void;
}

export const PassGallery: React.FC<PassGalleryProps> = ({
  isOpen,
  onClose,
  savedPasses,
  onSelectPass,
  onDeletePass,
  onNewPass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-amber-900/15 dark:border-amber-500/20 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-['Plus_Jakarta_Sans']">
              Saved Residency Passes ({savedPasses.length})
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              HH Goa 2026 • Studio Local Gallery
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedPasses.length === 0 ? (
            <div className="col-span-full py-12 text-center flex flex-col items-center gap-3">
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">No saved passes in gallery.</p>
              <button
                onClick={() => {
                  onNewPass();
                  onClose();
                }}
                className="px-4 py-2 bg-amber-600 text-white font-bold rounded-full text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <PlusCircle size={15} /> Create New Pass
              </button>
            </div>
          ) : (
            savedPasses.map((pass, idx) => {
              const themeConfig = THEMES[pass.theme] || THEMES.ROYAL_IVORY_GOLD;
              return (
                <div
                  key={pass.id ? `gallery-pass-${pass.id}-${idx}` : `gallery-pass-${idx}`}
                  className="bg-stone-50 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 flex flex-col justify-between gap-3 group hover:border-amber-500/50 transition shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{pass.name || "Unnamed Builder"}</div>
                      <div className="text-xs text-amber-600 font-semibold">@{pass.handle || "handle"}</div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{pass.builderTitle}</div>
                    </div>
                    <span
                      className="text-[10px] px-2.5 py-0.5 font-bold rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: themeConfig.accentGold, color: "#FFFFFF" }}
                    >
                      {themeConfig.name.split("&")[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <button
                      onClick={() => {
                        onSelectPass(pass);
                        onClose();
                      }}
                      className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Load Studio</span> <ArrowUpRight size={13} />
                    </button>
                    <button
                      onClick={() => onDeletePass(pass.id)}
                      className="p-1.5 bg-stone-100 hover:bg-rose-100 dark:bg-stone-800 dark:hover:bg-rose-950/50 border border-stone-200 dark:border-stone-700 hover:border-rose-400 text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition cursor-pointer"
                      title="Delete pass"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
