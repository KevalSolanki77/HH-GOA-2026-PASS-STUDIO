import React, { useRef, useState } from "react";
import { Format, ThemeKey, PhotoFilter, StickerStamp, AIPersona } from "../types";
import { THEMES, BUILDER_TITLES, SAMPLE_AVATARS, STICKER_LABELS } from "../constants/themes";
import {
  Upload,
  Download,
  Link,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Check,
  ImageIcon,
  RotateCcw,
  Palette,
  QrCode,
  BookmarkPlus,
  Ticket,
  Users,
  AtSign,
  Code,
  Zap,
  MapPin,
  Compass,
} from "lucide-react";

interface ControlsPanelProps {
  format: Format;
  setFormat: (f: Format) => void;
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  name: string;
  setName: (n: string) => void;
  handle: string;
  setHandle: (h: string) => void;
  stack: string;
  setStack: (s: string) => void;
  department: string;
  setDepartment: (d: string) => void;
  location: string;
  setLocation: (l: string) => void;
  builderTitle: string;
  setBuilderTitle: (bt: string) => void;
  teamName: string;
  setTeamName: (tn: string) => void;
  seatNo: string;
  setSeatNo: (sn: string) => void;
  flightNo: string;
  setFlightNo: (fn: string) => void;
  imageSrc: string | null;
  setImageSrc: (src: string | null) => void;
  zoom: number;
  setZoom: (z: number) => void;
  setPan: (p: { x: number; y: number }) => void;
  photoFilter: PhotoFilter;
  setPhotoFilter: (pf: PhotoFilter) => void;
  sticker: StickerStamp;
  setSticker: (s: StickerStamp) => void;
  showQr: boolean;
  setShowQr: (sq: boolean) => void;
  isProcessing: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: (exportFormat?: "png" | "jpeg") => void;
  onShare: () => void;
  onSavePass: () => void;
  copiedShare: boolean;
  aiPersona?: AIPersona;
  setAiPersona: (persona: AIPersona) => void;
  isEditingImage?: boolean;
  setIsEditingImage?: (editing: boolean) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  format,
  setFormat,
  theme,
  setTheme,
  name,
  setName,
  handle,
  setHandle,
  stack,
  setStack,
  department,
  setDepartment,
  location,
  setLocation,
  builderTitle,
  setBuilderTitle,
  teamName,
  setTeamName,
  seatNo,
  setSeatNo,
  flightNo,
  setFlightNo,
  imageSrc,
  setImageSrc,
  zoom,
  setZoom,
  setPan,
  photoFilter,
  setPhotoFilter,
  sticker,
  setSticker,
  showQr,
  setShowQr,
  isProcessing,
  onFileUpload,
  onDownload,
  onShare,
  onSavePass,
  copiedShare,
  aiPersona,
  setAiPersona,
  isEditingImage = false,
  setIsEditingImage,
}) => {
  const [activeTab, setActiveTab] = useState<"DETAILS" | "AI_PERSONA" | "PHOTO" | "THEME">("DETAILS");
  const [isGeneratingPersona, setIsGeneratingPersona] = useState<boolean>(false);
  const [hackathonIdeaInput, setHackathonIdeaInput] = useState<string>("");
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const generateLocalPersona = () => {
    const titles = [
      "Susegad CUDA Architect",
      "Feni-Fueled Async Dev",
      "Fontainhas Frontend Virtuoso",
      "Calangute Cloud Ninja",
      "Anjuna Swarm Builder",
      "Palolem Full-Stack Voyager"
    ];
    const taglines = [
      "Feni-fueled async systems builder crafting Goan heritage AI agents by Calangute sunset.",
      "Basking in Susegad vibes while compiling zero-latency neural nets at Fontainhas Villa.",
      "Debugs TypeScript with coconut water in hand and sunset views over Anjuna Beach."
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const tagline = taglines[Math.floor(Math.random() * taglines.length)];
    const securityCode = "HHG-2026-" + Math.floor(1000 + Math.random() * 9000);

    return {
      title,
      tagline,
      securityCode,
      recommendedCoworking: [
        { spot: "Barefoot Cafe, Fontainhas", reason: "Spacious historic veranda with artisanal Goan espresso & gigabit fiber." },
        { spot: "Clay Cafe, Anjuna", reason: "Shaded garden tables perfect for late-night async AI agent debugging." },
        { spot: "91springboard, Panjim", reason: "High-power ergonomic setups with ocean breeze views." }
      ],
      hackerVibeScore: Math.floor(88 + Math.random() * 12)
    };
  };

  // Generate AI Goan Hacker Persona
  const handleGenerateAIPersona = async () => {
    setIsGeneratingPersona(true);
    setToastNotice(null);
    try {
      const res = await fetch("/api/ai/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          github: "@" + handle,
          role: builderTitle,
          techStack: stack,
          hackathonIdea: hackathonIdeaInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.persona && data.persona.title) {
        setAiPersona(data.persona);
        setBuilderTitle(data.persona.title);
        setFlightNo(data.persona.securityCode || ("HHG-2026-" + Math.floor(1000 + Math.random() * 9000)));
        if (data.isQuotaError || data.isOfflineFallback) {
          setToastNotice("Quota limit reached. Using local offline generator.");
        }
      } else {
        const fallback = generateLocalPersona();
        setAiPersona(fallback);
        setBuilderTitle(fallback.title);
        setFlightNo(fallback.securityCode);
        setToastNotice("Quota limit reached. Using local offline generator.");
      }
    } catch (err) {
      console.warn("AI Persona error, using local fallback mode:", err);
      const fallback = generateLocalPersona();
      setAiPersona(fallback);
      setBuilderTitle(fallback.title);
      setFlightNo(fallback.securityCode);
      setToastNotice("Quota limit reached. Using local offline generator.");
    } finally {
      setIsGeneratingPersona(false);
    }
  };

  const activeThemeObj = THEMES[theme] || THEMES.FONTAINHAS_TERRACOTTA;

  const inputStyleClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white placeholder-slate-500 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all";

  return (
    <div className="p-5 sm:p-6 rounded-3xl border-2 border-[#38BDF8]/20 bg-[#1E293B]/95 text-white shadow-xl">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/80">
        <div>
          <h2 className="text-xl font-bold font-heritage tracking-tight text-white flex items-center gap-2">
            <span>Residency Pass Builder</span>
            <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-black uppercase border border-[#38BDF8]/30">
              Live Studio
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Configure your Goan developer identity, photo, & AI persona
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onSavePass}
            className="px-3 py-2 rounded-xl text-xs font-extrabold border transition flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-xs"
          >
            <BookmarkPlus size={14} className="text-[#38BDF8]" />
            <span>Save Badge</span>
          </button>

          <button
            onClick={onShare}
            className="px-3 py-2 rounded-xl text-xs font-extrabold border transition flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-xs"
          >
            {copiedShare ? <Check size={14} className="text-emerald-400" /> : <Link size={14} className="text-sky-400" />}
            <span>{copiedShare ? "Link Copied!" : "Copy Link"}</span>
          </button>

          <button
            onClick={() => onDownload("png")}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#38BDF8] hover:opacity-95 shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <Download size={15} />
            )}
            <span>Export Pass PNG</span>
          </button>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-b border-slate-700/80 my-4 no-scrollbar">
        {[
          { id: "DETAILS", label: "Profile Info", icon: Users },
          { id: "AI_PERSONA", label: "AI Persona Generator", icon: Sparkles },
          { id: "PHOTO", label: "Avatar & Photo", icon: ImageIcon },
          { id: "THEME", label: "Theme & Format", icon: Palette },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#0284C7] text-white shadow-md border border-[#38BDF8]/40"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              <IconComponent size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BUILDER PROFILE DETAILS */}
      {activeTab === "DETAILS" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* DEMO PRESET PROFILES */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase text-sky-400 tracking-wider flex items-center gap-1">
                <Zap size={13} />
                Quick Fill Presets
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">1-Click Demo Profiles</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "🤖 AI/ML Eng", name: "Anand Sharma", role: "AI Researcher", stack: ["PyTorch", "CUDA", "FastAPI"], handle: "anand_ai" },
                { label: "⚡ Web3 Dev", name: "Rohan Varma", role: "Smart Contract Dev", stack: ["Solidity", "Ethers.js", "Rust"], handle: "rohan_web3" },
                { label: "🦀 Full Stack", name: "Taksh Modi", role: "Systems Architect", stack: ["React", "Express", "Tailwind"], handle: "takshmodi" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setName(p.name);
                    setBuilderTitle(p.role);
                    setStack(p.stack.join(" / "));
                    setHandle(p.handle);
                  }}
                  className="text-xs bg-slate-900 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-700 hover:border-sky-500/50 transition font-bold cursor-pointer shadow-xs"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                Developer Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Taksh Modi"
                className={inputStyleClass}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                GitHub / Twitter Handle
              </label>
              <div className="relative">
                <AtSign size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="takshmodi"
                  className={`${inputStyleClass} pl-9`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                Core Tech Stack
              </label>
              <input
                type="text"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                placeholder="React / Express / Node.js"
                className={inputStyleClass}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                Goan Resident Title
              </label>
              <input
                type="text"
                value={builderTitle}
                onChange={(e) => setBuilderTitle(e.target.value)}
                placeholder="Susegad Systems Architect"
                className={inputStyleClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                Residency Hub / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Fontainhas Heritage Villa"
                className={inputStyleClass}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                Hackathon Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="House of Susegad"
                className={inputStyleClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI PERSONA GENERATOR */}
      {activeTab === "AI_PERSONA" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950 border border-sky-500/30 space-y-3">
            <div className="flex items-center gap-2 text-sky-300 font-extrabold text-sm">
              <Sparkles size={18} className="text-sky-400" />
              <span>AI Goan Hacker Persona Curator</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Let AI analyze your tech stack and hackathon project to generate an authentic Goan Developer Title, humorous bio tagline, security code, and recommended local co-working cafes.
            </p>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-300 mb-1">
                Your Hackathon Project Idea (Optional)
              </label>
              <input
                type="text"
                value={hackathonIdeaInput}
                onChange={(e) => setHackathonIdeaInput(e.target.value)}
                placeholder="AI Autonomous Tourism Agent for Fontainhas Heritage..."
                className={inputStyleClass}
              />
            </div>

            <button
              onClick={handleGenerateAIPersona}
              disabled={isGeneratingPersona}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#38BDF8] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPersona ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                  <span>Sparking AI Identity...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-amber-300 fill-amber-300" />
                  <span>✨ Spark AI Identity</span>
                </>
              )}
            </button>
          </div>

          {toastNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-extrabold flex items-center gap-2 shadow-sm animate-fade-in">
              <span className="text-base">⚠️</span>
              <span>{toastNotice}</span>
            </div>
          )}

          {aiPersona && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase border border-sky-500/30">
                  AI Curated Persona
                </span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  🔥 Susegad Score: {aiPersona.hackerVibeScore}/100
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black text-white font-heritage">{aiPersona.title}</h4>
                <p className="text-xs text-slate-300 italic mt-1">"{aiPersona.tagline}"</p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <p className="text-[11px] font-black text-sky-400 uppercase">Recommended Goan Co-Working Hubs:</p>
                {aiPersona.recommendedCoworking?.map((cowork, idx) => (
                  <div key={cowork.spot ? `cowork-${cowork.spot.replace(/\s+/g, '_')}-${idx}` : `cowork-${idx}`} className="p-2 rounded-xl bg-slate-800/80 text-xs text-slate-200 flex items-start gap-2">
                    <MapPin size={14} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">{cowork.spot}:</strong> {cowork.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PHOTO & CROP */}
      {activeTab === "PHOTO" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-700">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400">
                <ImageIcon size={24} />
              </div>
            )}

            <div className="space-y-2 text-center sm:text-left flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369A1] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Upload Photo</span>
                </button>
                {imageSrc && (
                  <button
                    onClick={() => setImageSrc(null)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Supports PNG, JPG, WebP. High resolution square recommended.</p>
            </div>
          </div>

          {/* Direct Photo Adjustment Controls */}
          {imageSrc && (
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700/80 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  Photo Position Controls
                </span>
                <span className="text-[10px] text-slate-400 font-bold">Drag on canvas to pan</span>
              </div>

              <div className="pt-2 border-t border-slate-800/90 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-bold mb-1">
                    <span>Zoom Level</span>
                    <span className="font-mono text-amber-400">{zoom.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setZoom(Math.min(3.0, zoom + 0.1))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPan({ x: 0, y: 0 });
                    setZoom(1.0);
                  }}
                  className="w-full py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset Position & Zoom</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
              Sample Hacker Avatars
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {SAMPLE_AVATARS.map((avatar, idx) => (
                <img
                  key={`avatar-${idx}-${avatar.slice(-12)}`}
                  src={avatar}
                  alt={`Sample Avatar ${idx + 1}`}
                  onClick={() => {
                    setImageSrc(avatar);
                    setPan({ x: 0, y: 0 }); // Reset pan position
                    setZoom(1.0);           // Lock scale to default 1x
                    if (setIsEditingImage) setIsEditingImage(false); // Photo starts locked into place
                  }}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-slate-700 hover:border-sky-400 cursor-pointer transition shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PALETTE & FORMAT */}
      {activeTab === "THEME" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
              Card Format Layout
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "BOARDING_PASS", label: "Boarding Pass" },
                { id: "DELEGATE_PASS", label: "Delegate Badge" },
                { id: "PFP_AVATAR", label: "Avatar Pass" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id as Format)}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    format === f.id
                      ? "bg-[#0284C7] text-white shadow-md border border-[#38BDF8]/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
              Goan Color Aesthetic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(THEMES).map((key) => {
                const tKey = key as ThemeKey;
                const tObj = THEMES[tKey];
                return (
                  <button
                    key={tKey}
                    onClick={() => setTheme(tKey)}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                      theme === tKey
                        ? "border-[#38BDF8] bg-slate-800 ring-2 ring-[#38BDF8]/40"
                        : "border-slate-700 bg-slate-900/60 hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-xs font-black text-white">{tObj.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{tObj.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
