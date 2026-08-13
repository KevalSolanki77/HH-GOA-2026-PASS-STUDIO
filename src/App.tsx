import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { ControlsPanel } from "./components/ControlsPanel";
import { PassCanvas } from "./components/PassCanvas";
import { AISchedulePlanner } from "./components/AISchedulePlanner";
import { SavedPassesView } from "./components/SavedPassesView";
import { CommandPalette } from "./components/CommandPalette";
import { BottomNav } from "./components/BottomNav";
import {
  MainNavTab,
  Format,
  ThemeKey,
  PhotoFilter,
  StickerStamp,
  PassData,
  AIPersona,
} from "./types";
import { Sparkles, Download, BookmarkPlus, Check } from "lucide-react";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<MainNavTab>("PASS_STUDIO");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Global Cmd+K / Ctrl+K listener for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Share & Processing Controls
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Residency Pass Builder State
  const [format, setFormat] = useState<Format>("BOARDING_PASS");
  const [theme, setTheme] = useState<ThemeKey>("FONTAINHAS_TERRACOTTA");
  const [name, setName] = useState("Taksh Modi");
  const [handle, setHandle] = useState("takshmodi");
  const [builderTitle, setBuilderTitle] = useState("Susegad Systems Architect");
  const [stack, setStack] = useState("React / Express / Node.js");
  const [department, setDepartment] = useState("HackerHouse Goa 2026");
  const [location, setLocation] = useState("Fontainhas Heritage Villa");
  const [teamName, setTeamName] = useState("House of Susegad");
  const [seatNo, setSeatNo] = useState("HHG-2026");
  const [flightNo, setFlightNo] = useState("HHG-2026-F3N1");
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  );
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isEditingImage, setIsEditingImage] = useState<boolean>(false); // Default photo locked
  const [photoFilter, setPhotoFilter] = useState<PhotoFilter>("NONE");
  const [sticker, setSticker] = useState<StickerStamp>("GOA_SUNSET_2026");
  const [showQr, setShowQr] = useState<boolean>(true);
  const [aiPersona, setAiPersona] = useState<AIPersona | undefined>(undefined);

  // Saved Passes State (Persisted in localStorage)
  const [savedPasses, setSavedPasses] = useState<PassData[]>(() => {
    try {
      const saved = localStorage.getItem("hh_goa_saved_passes");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("hh_goa_saved_passes", JSON.stringify(savedPasses));
    } catch (e) {
      console.error(e);
    }
  }, [savedPasses]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // High-DPI Canvas Export Utility (2x Resolution Boost)
  const exportHighQualityPass = (canvasElement: HTMLCanvasElement, filename: string) => {
    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");
    
    // 2x Scaling factor for crisp 1080p/4K rendering
    const scale = 2; 
    exportCanvas.width = canvasElement.width * scale;
    exportCanvas.height = canvasElement.height * scale;

    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.scale(scale, scale);
      ctx.drawImage(canvasElement, 0, 0);
    }

    const dataUrl = exportCanvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  // Publish Pass (High-DPI PNG Download + Copy Link + X / Twitter Intent)
  const handlePublishPass = async () => {
    setIsProcessing(true);
    setIsEditingImage(false); // Automatically lock photo edit mode before export

    // a) Download HD PNG Pass
    const canvas = canvasRef.current || document.querySelector("canvas");
    if (canvas) {
      exportHighQualityPass(
        canvas,
        `hh-goa-2026-pass-${name.toLowerCase().replace(/\s+/g, "-") || "builder"}.png`
      );
    }

    // b) Copy Live Web App URL to Clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }

    // c) Open Pre-filled X Post Intent Window (#FrameInGoa)
    const tweetText = `Building for @HackerHouseGoa 2026 as a ${builderTitle || "Developer"}! 🚀 Just generated my Goan Builder Pass using AI Pass Studio. #FrameInGoa #HackerHouseGoa #BuildInGoa`;
    const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank");

    setIsProcessing(false);

    // d) Trigger Floating UX Toast Notification
    setToastMessage("HD Pass Downloaded! Link copied & opening X post draft.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Copy App Link
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIsEditingImage(false); // Default photo locked upon upload
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Badge to LocalStorage
  const handleSavePass = () => {
    const newPass: PassData = {
      id: "pass-" + Date.now(),
      createdAt: Date.now(),
      format,
      theme,
      name,
      handle,
      stack,
      department,
      location,
      builderTitle,
      teamName,
      seatNo,
      flightNo,
      imageSrc,
      sticker,
      filter: photoFilter,
      showQr,
      aiPersona,
    };

    setSavedPasses((prev) => [newPass, ...prev]);
    setActiveTab("SAVED_PASSES");
  };

  // Select Saved Badge
  const handleSelectPass = (pass: PassData) => {
    setFormat(pass.format);
    setTheme(pass.theme);
    setName(pass.name);
    setHandle(pass.handle);
    setStack(pass.stack);
    setDepartment(pass.department);
    setLocation(pass.location);
    setBuilderTitle(pass.builderTitle);
    setTeamName(pass.teamName);
    setSeatNo(pass.seatNo);
    setFlightNo(pass.flightNo);
    setImageSrc(pass.imageSrc);
    setSticker(pass.sticker);
    setPhotoFilter(pass.filter);
    setShowQr(pass.showQr);
    if (pass.aiPersona) setAiPersona(pass.aiPersona);
    setActiveTab("PASS_STUDIO");
  };

  // Delete Saved Badge
  const handleDeletePass = (id: string) => {
    setSavedPasses((prev) => prev.filter((p) => p.id !== id));
  };

  // Import Saved Badges JSON
  const handleImportPasses = (imported: PassData[]) => {
    setSavedPasses((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newItems = imported.filter((p) => p && p.id && !existingIds.has(p.id));
      return [...prev, ...newItems];
    });
  };

  // Download Badge PNG
  const handleDownload = (exportFormat: "png" | "jpeg" = "png") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    setTimeout(() => {
      const mimeType = exportFormat === "jpeg" ? "image/jpeg" : "image/png";
      const imageURI = canvas.toDataURL(mimeType, 0.95);
      const cleanUser = (name || handle || "developer")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "developer";
      const link = document.createElement("a");
      link.download = `hackerhouse-goa-pass-${cleanUser}.${exportFormat}`;
      link.href = imageURI;
      link.click();
      setIsProcessing(false);
    }, 300);
  };

  // Copy Link Action
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-[#38BDF8] selection:text-black">
      {/* Persistent Global Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedPassesCount={savedPasses.length}
        onOpenGallery={() => setActiveTab("SAVED_PASSES")}
        copiedLink={copiedLink}
        onCopyLink={handleCopyLink}
        onPublishPass={handlePublishPass}
      />

      {/* Main Single-Canvas Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* TAB 1: LIVE BUILDER PASS STUDIO (HERO FEATURE) */}
        {activeTab === "PASS_STUDIO" && (
          <div className="space-y-6 animate-fade-in">
            {/* Studio Banner */}
            <section className="relative overflow-hidden rounded-3xl p-5 sm:p-8 border-2 border-[#38BDF8]/30 shadow-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-[#38BDF8] text-xs font-black uppercase tracking-widest">
                <Sparkles size={14} />
                <span>HackerHouse Goa 2026 • AI Residency Pass Studio</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heritage tracking-tight text-white max-w-4xl mx-auto leading-tight">
                Design Your Goan Developer Residency Badge
              </h1>

              <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Customize your Goan Hacker Badge with custom tech stack pills, photo filters, QR codes, and AI-generated Goan developer personas.
              </p>
            </section>

            {/* Live Pass Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Canvas Preview Area */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900/90 p-3 sm:p-6 rounded-3xl border-2 border-slate-800 shadow-2xl relative min-h-[380px] sm:min-h-[500px] w-full overflow-hidden">
                <PassCanvas
                  format={format}
                  theme={theme}
                  name={name}
                  handle={handle}
                  stack={stack}
                  department={department}
                  location={location}
                  builderTitle={builderTitle}
                  teamName={teamName}
                  seatNo={seatNo}
                  flightNo={flightNo}
                  imageSrc={imageSrc}
                  zoom={zoom}
                  setZoom={setZoom}
                  pan={pan}
                  setPan={setPan}
                  filter={photoFilter}
                  sticker={sticker}
                  showQr={showQr}
                  resolution="2x"
                  canvasRef={canvasRef}
                  isEditingImage={isEditingImage}
                />
              </div>

              {/* Controls Form Panel */}
              <div className="lg:col-span-5 w-full">
                <ControlsPanel
                  format={format}
                  setFormat={setFormat}
                  theme={theme}
                  setTheme={setTheme}
                  name={name}
                  setName={setName}
                  handle={handle}
                  setHandle={setHandle}
                  stack={stack}
                  setStack={setStack}
                  department={department}
                  setDepartment={setDepartment}
                  location={location}
                  setLocation={setLocation}
                  builderTitle={builderTitle}
                  setBuilderTitle={setBuilderTitle}
                  teamName={teamName}
                  setTeamName={setTeamName}
                  seatNo={seatNo}
                  setSeatNo={setSeatNo}
                  flightNo={flightNo}
                  setFlightNo={setFlightNo}
                  imageSrc={imageSrc}
                  setImageSrc={setImageSrc}
                  zoom={zoom}
                  setZoom={setZoom}
                  setPan={setPan}
                  photoFilter={photoFilter}
                  setPhotoFilter={setPhotoFilter}
                  sticker={sticker}
                  setSticker={setSticker}
                  showQr={showQr}
                  setShowQr={setShowQr}
                  isProcessing={isProcessing}
                  onFileUpload={handleFileUpload}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  onSavePass={handleSavePass}
                  copiedShare={copiedShare}
                  aiPersona={aiPersona}
                  setAiPersona={setAiPersona}
                  isEditingImage={isEditingImage}
                  setIsEditingImage={setIsEditingImage}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI HACKATHON & RESIDENCY PLANNER */}
        {activeTab === "AI_PLANNER" && (
          <AISchedulePlanner techStack={stack} />
        )}

        {/* TAB 3: SAVED PASSES GALLERY & NETWORK */}
        {activeTab === "SAVED_PASSES" && (
          <SavedPassesView
            savedPasses={savedPasses}
            onSelectPass={handleSelectPass}
            onDeletePass={handleDeletePass}
            onGoToStudio={() => setActiveTab("PASS_STUDIO")}
            onImportPasses={handleImportPasses}
          />
        )}
      </main>

      {/* Footer Attribution */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-900 mt-8 mb-16 md:mb-0">
        <p>HackerHouse Goa 2026 • Open Source Builder Platform</p>
      </footer>

      {/* Command Palette Modal (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onSparkAI={() => setActiveTab("PASS_STUDIO")}
        onExportPNG={() => handleDownload("png")}
      />

      {/* Persistent Bottom Mobile Nav */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedPassesCount={savedPasses.length}
      />

      {/* Floating UX Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
