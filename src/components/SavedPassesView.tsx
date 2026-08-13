import React, { useRef } from "react";
import { PassData } from "../types";
import { THEMES } from "../constants/themes";
import { BadgeQR } from "./BadgeQR";
import { Bookmark, Trash2, Edit3, Download, Sparkles, FileDown, FileUp } from "lucide-react";

interface SavedPassesViewProps {
  savedPasses: PassData[];
  onSelectPass: (pass: PassData) => void;
  onDeletePass: (id: string) => void;
  onGoToStudio: () => void;
  onImportPasses?: (passes: PassData[]) => void;
}

export const SavedPassesView: React.FC<SavedPassesViewProps> = ({
  savedPasses,
  onSelectPass,
  onDeletePass,
  onGoToStudio,
  onImportPasses,
}) => {
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportJSON = () => {
    if (savedPasses.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedPasses, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "saved_badges.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          if (onImportPasses) {
            onImportPasses(imported);
          }
        } else {
          alert("Invalid JSON format. Expected an array of saved badges.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-2 border-[#38BDF8]/30 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black uppercase tracking-widest border border-sky-500/30">
          <Bookmark size={14} />
          <span>Goa Residency Network Gallery</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black font-heritage text-white">
          Saved Residency Badges ({savedPasses.length})
        </h2>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto">
          All your saved HackerHouse Goa 2026 Developer Badges stored securely in your browser's local storage. Re-edit or download any pass anytime.
        </p>

        {/* JSON Import/Export Backup Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleExportJSON}
            disabled={savedPasses.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition cursor-pointer shadow-sm ${
              savedPasses.length > 0
                ? "bg-slate-800 hover:bg-slate-700 text-sky-300 border-sky-500/30 hover:border-sky-400"
                : "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed"
            }`}
          >
            <FileDown size={15} />
            <span>Export Backup JSON</span>
          </button>

          <button
            onClick={() => jsonFileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <FileUp size={15} />
            <span>Import JSON</span>
          </button>

          <input
            ref={jsonFileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </div>
      </section>

      {/* Gallery Cards Grid */}
      {savedPasses.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/80 rounded-3xl border-2 border-dashed border-slate-700 space-y-4">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mx-auto">
            <Sparkles size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">No Saved Badges Yet!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Design your customized Goan Hacker Badge in the Pass Studio, curate your AI Persona, and click "Save Badge" to populate your gallery.
            </p>
          </div>
          <button
            onClick={onGoToStudio}
            className="px-6 py-3 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
          >
            Create Your First Badge Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPasses.map((pass, idx) => {
            const themeObj = THEMES[pass.theme] || THEMES.FONTAINHAS_TERRACOTTA;

            return (
              <div
                key={pass.id ? `saved-pass-${pass.id}-${idx}` : `saved-pass-${idx}`}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      {pass.imageSrc ? (
                        <img
                          src={pass.imageSrc}
                          alt={pass.name}
                          className="w-10 h-10 rounded-xl object-cover border border-sky-400/40"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold text-sm">
                          {pass.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-black text-white">{pass.name || "Anonymous Builder"}</h4>
                        <p className="text-xs font-bold text-[#38BDF8]">@{pass.handle}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePass(pass.id);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                      title="Delete saved pass"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-3 text-xs text-slate-300">
                    <div className="space-y-1 flex-1">
                      <p className="font-bold text-white font-heritage">{pass.builderTitle}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Stack: {pass.stack}</p>
                      <p className="text-[11px] text-slate-400">Location: {pass.location}</p>
                    </div>
                    {pass.showQr !== false && (
                      <BadgeQR
                        name={pass.name}
                        role={pass.builderTitle}
                        stack={pass.stack}
                        id={pass.flightNo || pass.id}
                        size={72}
                        uniqueKey={`pass-qr-${pass.id}-${idx}`}
                        className="shrink-0"
                      />
                    )}
                  </div>

                  {pass.aiPersona && (
                    <div className="p-2.5 rounded-xl bg-sky-950/50 border border-sky-500/30 text-[11px] text-sky-200 italic mt-2">
                      "{pass.aiPersona.tagline}"
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onSelectPass(pass)}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Edit3 size={14} />
                    <span>Re-Edit</span>
                  </button>

                  <button
                    onClick={() => onSelectPass(pass)}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} className="text-sky-400" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
