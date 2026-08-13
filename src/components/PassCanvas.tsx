import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  Format,
  ThemeKey,
  PhotoFilter,
  StickerStamp
} from "../types";
import { THEMES, STICKER_LABELS } from "../constants/themes";
import { drawPassQRCode } from "../utils/qrCode";

interface PassCanvasProps {
  format: Format;
  theme: ThemeKey;
  name: string;
  handle: string;
  stack: string;
  department?: string;
  location?: string;
  builderTitle: string;
  teamName: string;
  seatNo: string;
  flightNo: string;
  imageSrc: string | null;
  zoom: number;
  setZoom: (fn: (prev: number) => number) => void;
  pan: { x: number; y: number };
  setPan: (fn: (prev: { x: number; y: number }) => { x: number; y: number }) => void;
  filter: PhotoFilter;
  sticker: StickerStamp;
  showQr: boolean;
  resolution: "1x" | "2x";
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isEditingImage?: boolean;
}

export const PassCanvas: React.FC<PassCanvasProps> = ({
  format,
  theme,
  name,
  handle,
  stack,
  department = "Goa AI Residency & Agents",
  location = "Goa (Arambol Sunset Villa)",
  builderTitle,
  teamName,
  seatNo,
  flightNo,
  imageSrc,
  zoom,
  setZoom,
  pan,
  setPan,
  filter,
  sticker,
  showQr,
  resolution,
  canvasRef,
  isEditingImage = false,
}) => {
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  // Preload image source asynchronously
  useEffect(() => {
    if (!imageSrc) {
      setLoadedImg(null);
      return;
    }
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (isMounted) setLoadedImg(img);
    };
    img.onerror = () => {
      if (isMounted) setLoadedImg(null);
    };
    img.src = imageSrc;
    return () => {
      isMounted = false;
    };
  }, [imageSrc]);

  // 3D Parallax Mouse Tracking
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      rx: (-y / rect.height) * 6,
      ry: (x / rect.width) * 6
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setIsDragging(false);
  };

  // Drag Pan Controls (Always active when image is present)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imageSrc) return;
    setPan(() => ({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Drag Pan Controls for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!imageSrc) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imageSrc || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan(() => ({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    }));
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Wheel Zoom Controls
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 3.5));
  };

  // Official Monogram Logo Drawer
  const drawLogoMark = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);

    // Official Interwoven Monogram Pillars
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(0, 0, size * 0.26, size, size * 0.1);
    ctx.roundRect(size * 0.74, 0, size * 0.26, size, size * 0.1);
    ctx.roundRect(0, size * 0.38, size, size * 0.24, size * 0.08);
    ctx.fill();

    // Metallic Terracotta / Gold Accent Dot
    ctx.fillStyle = "#E07A5F";
    ctx.beginPath();
    ctx.arc(size * 0.5, size * 0.5, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Portuguese Azulejo Ceramic Tile Corner Motifs
  const drawAzulejoCornerMotifs = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, m: number, color: string) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8 * m;

    const arm = 24 * m;
    const gap = 8 * m;

    // Top-Left Corner
    ctx.beginPath();
    ctx.moveTo(x + gap, y + gap + arm);
    ctx.lineTo(x + gap, y + gap);
    ctx.lineTo(x + gap + arm, y + gap);
    ctx.stroke();

    // Corner Azulejo Diamond Floret
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + gap + 4 * m, y + gap + 4 * m, 3 * m, 0, Math.PI * 2);
    ctx.fill();

    // Top-Right Corner
    ctx.beginPath();
    ctx.moveTo(x + w - gap - arm, y + gap);
    ctx.lineTo(x + w - gap, y + gap);
    ctx.lineTo(x + w - gap, y + gap + arm);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + w - gap - 4 * m, y + gap + 4 * m, 3 * m, 0, Math.PI * 2);
    ctx.fill();

    // Bottom-Left Corner
    ctx.beginPath();
    ctx.moveTo(x + gap, y + h - gap - arm);
    ctx.lineTo(x + gap, y + h - gap);
    ctx.lineTo(x + gap + arm, y + h - gap);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + gap + 4 * m, y + h - gap - 4 * m, 3 * m, 0, Math.PI * 2);
    ctx.fill();

    // Bottom-Right Corner
    ctx.beginPath();
    ctx.moveTo(x + w - gap - arm, y + h - gap);
    ctx.lineTo(x + w - gap, y + h - gap);
    ctx.lineTo(x + w - gap, y + h - gap - arm);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + w - gap - 4 * m, y + h - gap - 4 * m, 3 * m, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Goa Coastal Watermark
  const drawGoaBeachMotifs = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, m: number) => {
    ctx.save();
    ctx.fillStyle = "rgba(224, 122, 95, 0.08)";
    ctx.font = `${64 * m}px sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("🌴", x + w - 30 * m, y + h - 25 * m);
    ctx.restore();
  };

  // Main Canvas Render Engine
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const activeTheme = THEMES[theme] || THEMES.FONTAINHAS_TERRACOTTA;
    const multiplier = resolution === "2x" ? 2 : 1;

    let passW = 1200 * multiplier;
    let passH = 560 * multiplier;

    if (format === "DELEGATE_PASS") {
      passW = 800 * multiplier;
      passH = 1200 * multiplier;
    } else if (format === "PFP_AVATAR") {
      passW = 1080 * multiplier;
      passH = 1080 * multiplier;
    }

    // Canvas dimensions
    let canvasW = passW;
    let canvasH = passH;

    canvas.width = canvasW;
    canvas.height = canvasH;

    // 1. Full Canvas Sun-washed Sand Background
    const outerBgGrad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
    outerBgGrad.addColorStop(0, activeTheme.pageBg);
    outerBgGrad.addColorStop(0.6, activeTheme.cardBg1);
    outerBgGrad.addColorStop(1, activeTheme.cardBg2);
    ctx.fillStyle = outerBgGrad;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Azulejo Tile Grid Background Accents
    ctx.strokeStyle = "rgba(29, 53, 87, 0.04)";
    ctx.lineWidth = 1.5 * multiplier;
    const tileSize = 60 * multiplier;
    for (let x = 0; x < canvasW; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasH);
      ctx.stroke();
    }
    for (let y = 0; y < canvasH; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasW, y);
      ctx.stroke();
    }

    // 2. Center Pass Placement if Preset is Social Aspect Ratio
    let offsetX = (canvasW - passW) / 2;
    let offsetY = (canvasH - passH) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Filter Helper for Profile Photo
    const applyFilters = () => {
      if (filter === "GOLDEN_HOUR") {
        ctx.filter = "sepia(0.25) saturate(1.3) contrast(1.1) brightness(1.02)";
      } else if (filter === "PORTRAIT_STUDIO") {
        ctx.filter = "contrast(1.08) saturate(1.15) brightness(1.02)";
      } else if (filter === "WARM_LUXURY") {
        ctx.filter = "sepia(0.18) contrast(1.06) saturate(1.1)";
      } else if (filter === "SILVER_MONO") {
        ctx.filter = "grayscale(1) contrast(1.15) brightness(1.02)";
      } else {
        ctx.filter = "none";
      }
    };

    // Dynamic QR Code Payload
    const dynamicQrPayload = JSON.stringify({
      name: name || "Builder",
      role: builderTitle || "Dev",
      stack: stack ? stack.split(",").map((s) => s.trim()) : [],
      id: flightNo || "GOA-2026",
    });

    // FORMAT 1: BOARDING_PASS (Horizontal Ticket with Tear-off Stub)
    if (format === "BOARDING_PASS") {
      const stubX = passW * 0.72;

      // Card Main Ivory Fill
      const cardGrad = ctx.createLinearGradient(0, 0, passW, passH);
      cardGrad.addColorStop(0, activeTheme.cardBg1);
      cardGrad.addColorStop(1, activeTheme.cardBg2);
      ctx.fillStyle = cardGrad;
      ctx.shadowColor = "rgba(29, 53, 87, 0.08)";
      ctx.shadowBlur = 30 * multiplier;
      ctx.fillRect(20 * multiplier, 20 * multiplier, passW - 40 * multiplier, passH - 40 * multiplier);
      ctx.shadowColor = "transparent";

      // Portuguese Azulejo Border
      ctx.strokeStyle = activeTheme.accentGold;
      ctx.lineWidth = 3 * multiplier;
      ctx.strokeRect(20 * multiplier, 20 * multiplier, passW - 40 * multiplier, passH - 40 * multiplier);

      // Corner Motifs & Goa Palm
      drawAzulejoCornerMotifs(ctx, 20 * multiplier, 20 * multiplier, passW - 40 * multiplier, passH - 40 * multiplier, multiplier, activeTheme.accentGold);
      drawGoaBeachMotifs(ctx, 20 * multiplier, 20 * multiplier, passW - 40 * multiplier, passH - 40 * multiplier, multiplier);

      // Tear Line Divider
      ctx.strokeStyle = activeTheme.accentGold;
      ctx.setLineDash([8 * multiplier, 8 * multiplier]);
      ctx.lineWidth = 2 * multiplier;
      ctx.beginPath();
      ctx.moveTo(stubX, 20 * multiplier);
      ctx.lineTo(stubX, passH - 20 * multiplier);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tear Notch Cutouts
      ctx.fillStyle = activeTheme.pageBg;
      ctx.beginPath();
      ctx.arc(stubX, 20 * multiplier, 18 * multiplier, 0, Math.PI * 2);
      ctx.arc(stubX, passH - 20 * multiplier, 18 * multiplier, 0, Math.PI * 2);
      ctx.fill();

      // LEFT SECTION: MAIN BOARDING PASS
      drawLogoMark(ctx, 50 * multiplier, 50 * multiplier, 42 * multiplier, activeTheme.accentGold);

      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `800 ${28 * multiplier}px Playfair Display, serif`;
      ctx.textAlign = "left";
      ctx.fillText("HH GOA 2026 🌴", 110 * multiplier, 78 * multiplier);

      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `700 ${12 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText("INDO-PORTUGUESE RESIDENCY PASS • AI × CRYPTO BUILDERS", 110 * multiplier, 98 * multiplier);

      // Flight Route Header: GLOBAL -> GOA
      ctx.fillStyle = "rgba(224, 122, 95, 0.08)";
      ctx.beginPath();
      ctx.roundRect(50 * multiplier, 120 * multiplier, stubX - 100 * multiplier, 70 * multiplier, 16 * multiplier);
      ctx.fill();

      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `800 ${26 * multiplier}px Playfair Display, serif`;
      ctx.fillText("GLOBAL", 70 * multiplier, 162 * multiplier);

      ctx.fillStyle = activeTheme.accentGold;
      ctx.font = `800 ${18 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText("✈  HH-2026-GOI  ➔", (stubX - 100 * multiplier) / 2 - 30 * multiplier, 162 * multiplier);

      ctx.fillStyle = activeTheme.primaryText;
      ctx.textAlign = "right";
      ctx.font = `800 ${26 * multiplier}px Playfair Display, serif`;
      ctx.fillText("GOA (GOI) 🌴", stubX - 70 * multiplier, 162 * multiplier);

      // Delegate Photo Thumbnail
      const photoX = 50 * multiplier;
      const photoY = 210 * multiplier;
      const photoSize = 195 * multiplier;
      const photoRadius = 24 * multiplier;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoSize, photoSize, photoRadius);
      ctx.clip();

      if (loadedImg && loadedImg.naturalWidth > 0 && loadedImg.naturalHeight > 0) {
        applyFilters();
        const imgAspect = loadedImg.naturalWidth / loadedImg.naturalHeight || 1;
        const renderW = photoSize * zoom;
        const renderH = (photoSize / imgAspect) * zoom;

        if (Number.isFinite(renderW) && Number.isFinite(renderH) && renderW > 0 && renderH > 0) {
          ctx.drawImage(
            loadedImg,
            photoX + (photoSize - renderW) / 2 + pan.x * multiplier,
            photoY + (photoSize - renderH) / 2 + pan.y * multiplier,
            renderW,
            renderH
          );
        }
      } else {
        ctx.fillStyle = "#EAE3D2";
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = activeTheme.secondaryText;
        ctx.font = `600 ${14 * multiplier}px Plus Jakarta Sans, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Upload Photo", photoX + photoSize / 2, photoY + photoSize / 2);
      }
      ctx.restore();

      // Photo Frame Border
      ctx.strokeStyle = activeTheme.accentGold;
      ctx.lineWidth = 2.5 * multiplier;
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoSize, photoSize, photoRadius);
      ctx.stroke();

      if (isEditingImage) {
        ctx.save();
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3 * multiplier;
        ctx.setLineDash([8 * multiplier, 8 * multiplier]);
        ctx.beginPath();
        ctx.roundRect(photoX - 4 * multiplier, photoY - 4 * multiplier, photoSize + 8 * multiplier, photoSize + 8 * multiplier, photoRadius + 4 * multiplier);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#f59e0b";
        ctx.font = `700 ${11 * multiplier}px Plus Jakarta Sans, sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText("EDIT MODE (DRAG TO MOVE)", photoX, photoY - 10 * multiplier);
        ctx.restore();
      }

      // Delegate Info Column
      const infoX = 270 * multiplier;
      ctx.textAlign = "left";

      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `800 ${36 * multiplier}px Playfair Display, serif`;
      ctx.fillText(name || "BUILDER DELEGATE", infoX, 250 * multiplier);

      ctx.fillStyle = activeTheme.accentGold;
      ctx.font = `700 ${17 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(`@${handle || "handle"} • ${builderTitle}`, infoX, 282 * multiplier);

      // Department & Location Sub-line
      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `600 ${13 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(`${department}  |  📍 ${location}`, infoX, 308 * multiplier);

      // Tech Stack Pill
      const stackStr = `STACK: ${stack || "AI Agent / Solana / Fullstack"}`;
      ctx.font = `600 ${13 * multiplier}px Plus Jakarta Sans, sans-serif`;
      const stackWidth = Math.min(stubX - infoX - 40 * multiplier, ctx.measureText(stackStr).width + 30 * multiplier);

      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.beginPath();
      ctx.roundRect(infoX, 325 * multiplier, stackWidth, 32 * multiplier, 10 * multiplier);
      ctx.fill();

      ctx.fillStyle = activeTheme.primaryText;
      ctx.fillText(stackStr, infoX + 15 * multiplier, 346 * multiplier);

      // Flight Details Grid
      const gridY = 385 * multiplier;
      const col1 = infoX;
      const col2 = infoX + 135 * multiplier;
      const col3 = infoX + 270 * multiplier;
      const col4 = infoX + 405 * multiplier;

      const drawDetailCell = (cx: number, cy: number, label: string, val: string, isHighlight = false) => {
        ctx.fillStyle = activeTheme.secondaryText;
        ctx.font = `700 ${11 * multiplier}px Plus Jakarta Sans, sans-serif`;
        ctx.fillText(label, cx, cy);

        ctx.fillStyle = isHighlight ? activeTheme.accentGold : activeTheme.primaryText;
        ctx.font = `800 ${15 * multiplier}px Plus Jakarta Sans, sans-serif`;
        ctx.fillText(val, cx, cy + 20 * multiplier);
      };

      drawDetailCell(col1, gridY, "FLIGHT NO", flightNo || "HH-2026");
      drawDetailCell(col2, gridY, "SEAT / NO", seatNo || "247/6800+", true);
      drawDetailCell(col3, gridY, "DATE", "OCT 28–31, 2026");
      drawDetailCell(col4, gridY, "VENUE", "BEACH RESORT 🏖️");

      drawDetailCell(col1, gridY + 48 * multiplier, "VILLA / HOUSE", teamName || "HOUSE OF NGMI");
      drawDetailCell(col2, gridY + 48 * multiplier, "STATUS", "CONFIRMED ✅", true);
      drawDetailCell(col3, gridY + 48 * multiplier, "BOUNTIES", "$50,000+");

      // RIGHT SECTION: TEAR-OFF STUB
      ctx.textAlign = "left";
      const stubPad = stubX + 35 * multiplier;

      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `800 ${20 * multiplier}px Playfair Display, serif`;
      ctx.fillText("HH GOA 2026 🌴", stubPad, 65 * multiplier);

      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `700 ${11 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText("RESIDENCY STUB", stubPad, 84 * multiplier);

      // Stub Delegate Details
      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `800 ${22 * multiplier}px Playfair Display, serif`;
      ctx.fillText((name || "DELEGATE").split(" ")[0], stubPad, 125 * multiplier);

      ctx.fillStyle = activeTheme.accentGold;
      ctx.font = `700 ${14 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(`@${handle || "handle"}`, stubPad, 148 * multiplier);

      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `600 ${12 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(`SEAT: ${seatNo || "247/6800+"}`, stubPad, 172 * multiplier);

      // QR Code
      if (showQr) {
        drawPassQRCode(
          ctx,
          stubPad,
          195 * multiplier,
          130 * multiplier,
          dynamicQrPayload,
          activeTheme.accentGold
        );
      }

      // Barcode Lines
      const barcodeY = 350 * multiplier;
      const barcodeW = passW - stubPad - 40 * multiplier;
      ctx.fillStyle = activeTheme.primaryText;

      for (let i = 0; i < barcodeW; i += 6 * multiplier) {
        const lineW = (i % 12 === 0 ? 3 : 1.5) * multiplier;
        ctx.fillRect(stubPad + i, barcodeY, lineW, 45 * multiplier);
      }

      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `700 ${11 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText("#FrameInGoa", stubPad, 425 * multiplier);

      // Sticker Badge on Stub
      const stickerInfo = STICKER_LABELS[sticker] || STICKER_LABELS.GOA_SUNSET_2026;
      ctx.save();
      ctx.translate(stubPad + 160 * multiplier, 435 * multiplier);
      ctx.rotate((-6 * Math.PI) / 180);

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(-65 * multiplier, -24 * multiplier, 130 * multiplier, 48 * multiplier, 12 * multiplier);
      ctx.fill();

      ctx.strokeStyle = activeTheme.accentGold;
      ctx.lineWidth = 1.5 * multiplier;
      ctx.beginPath();
      ctx.roundRect(-65 * multiplier, -24 * multiplier, 130 * multiplier, 48 * multiplier, 12 * multiplier);
      ctx.stroke();

      ctx.fillStyle = activeTheme.accentGold;
      ctx.font = `800 ${12 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(stickerInfo.title, 0, -2 * multiplier);
      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `700 ${9 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(stickerInfo.subtitle, 0, 12 * multiplier);
      ctx.restore();

    } else if (format === "DELEGATE_PASS") {
      // FORMAT 2: DELEGATE_PASS (Vertical VIP Keycard)
      const cx = passW / 2;

      // Card Main Fill & Border
      const cardGrad = ctx.createLinearGradient(0, 0, passW, passH);
      cardGrad.addColorStop(0, activeTheme.cardBg1);
      cardGrad.addColorStop(1, activeTheme.cardBg2);
      ctx.fillStyle = cardGrad;
      ctx.shadowColor = "rgba(29, 53, 87, 0.08)";
      ctx.shadowBlur = 30 * multiplier;
      ctx.fillRect(25 * multiplier, 25 * multiplier, passW - 50 * multiplier, passH - 50 * multiplier);
      ctx.shadowColor = "transparent";

      ctx.strokeStyle = activeTheme.accentGold;
      ctx.lineWidth = 3.5 * multiplier;
      ctx.strokeRect(25 * multiplier, 25 * multiplier, passW - 50 * multiplier, passH - 50 * multiplier);

      drawAzulejoCornerMotifs(ctx, 25 * multiplier, 25 * multiplier, passW - 50 * multiplier, passH - 50 * multiplier, multiplier, activeTheme.accentGold);
      drawGoaBeachMotifs(ctx, 25 * multiplier, 25 * multiplier, passW - 50 * multiplier, passH - 50 * multiplier, multiplier);

      // Lanyard Hole
      ctx.fillStyle = activeTheme.pageBg;
      ctx.beginPath();
      ctx.roundRect(cx - 50 * multiplier, 15 * multiplier, 100 * multiplier, 22 * multiplier, 11 * multiplier);
      ctx.fill();
      ctx.strokeStyle = activeTheme.accentGold;
      ctx.lineWidth = 2 * multiplier;
      ctx.stroke();

      // Header Brand Bar
      drawLogoMark(ctx, 60 * multiplier, 60 * multiplier, 52 * multiplier, activeTheme.accentGold);

      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `800 ${36 * multiplier}px Playfair Display, serif`;
      ctx.textAlign = "left";
      ctx.fillText("HH GOA 2026 🌴", 130 * multiplier, 92 * multiplier);

      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `700 ${14 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText("TROPICAL BUILDER RESIDENCY • GOA, INDIA", 130 * multiplier, 116 * multiplier);

      // Photo Frame Centered
      const photoSize = 340 * multiplier;
      const photoX = cx - photoSize / 2;
      const photoY = 160 * multiplier;
      const photoRadius = 36 * multiplier;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoSize, photoSize, photoRadius);
      ctx.clip();

      if (loadedImg && loadedImg.naturalWidth > 0 && loadedImg.naturalHeight > 0) {
        applyFilters();
        const imgAspect = loadedImg.naturalWidth / loadedImg.naturalHeight || 1;
        const renderW = photoSize * zoom;
        const renderH = (photoSize / imgAspect) * zoom;

        if (Number.isFinite(renderW) && Number.isFinite(renderH) && renderW > 0 && renderH > 0) {
          ctx.drawImage(
            loadedImg,
            photoX + (photoSize - renderW) / 2 + pan.x * multiplier,
            photoY + (photoSize - renderH) / 2 + pan.y * multiplier,
            renderW,
            renderH
          );
        }
      } else {
        ctx.fillStyle = "#EAE3D2";
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = activeTheme.secondaryText;
        ctx.font = `600 ${18 * multiplier}px Plus Jakarta Sans, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Upload Photo", photoX + photoSize / 2, photoY + photoSize / 2);
      }
      ctx.restore();

      // Gold Metallic Frame
      ctx.strokeStyle = activeTheme.accentGold;
      ctx.lineWidth = 3.5 * multiplier;
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoSize, photoSize, photoRadius);
      ctx.stroke();

      if (isEditingImage) {
        ctx.save();
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3.5 * multiplier;
        ctx.setLineDash([8 * multiplier, 8 * multiplier]);
        ctx.beginPath();
        ctx.roundRect(photoX - 6 * multiplier, photoY - 6 * multiplier, photoSize + 12 * multiplier, photoSize + 12 * multiplier, photoRadius + 6 * multiplier);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#f59e0b";
        ctx.font = `700 ${14 * multiplier}px Plus Jakarta Sans, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("EDIT MODE (DRAG TO MOVE)", photoX + photoSize / 2, photoY - 14 * multiplier);
        ctx.restore();
      }

      // Name & Role Details
      ctx.textAlign = "center";

      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `800 ${46 * multiplier}px Playfair Display, serif`;
      ctx.fillText(name || "BUILDER DELEGATE", cx, 550 * multiplier);

      ctx.fillStyle = activeTheme.accentGold;
      ctx.font = `700 ${22 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(`@${handle || "handle"} • ${builderTitle}`, cx, 595 * multiplier);

      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `600 ${16 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(`${department}  |  📍 ${location}`, cx, 630 * multiplier);

      // Stack & House Details Pill
      const stackPillStr = `STACK: ${stack || "AI Agent / Solana / Fullstack"}`;
      ctx.font = `600 ${16 * multiplier}px Plus Jakarta Sans, sans-serif`;
      const stackPillW = Math.min(passW - 120 * multiplier, ctx.measureText(stackPillStr).width + 40 * multiplier);

      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.beginPath();
      ctx.roundRect(cx - stackPillW / 2, 660 * multiplier, stackPillW, 44 * multiplier, 14 * multiplier);
      ctx.fill();

      ctx.fillStyle = activeTheme.primaryText;
      ctx.fillText(stackPillStr, cx, 688 * multiplier);

      // Grid stats
      const keyY = 740 * multiplier;
      ctx.textAlign = "left";
      const kCol1 = 80 * multiplier;
      const kCol2 = cx;

      const drawKeyVal = (kx: number, ky: number, l: string, v: string) => {
        ctx.fillStyle = activeTheme.secondaryText;
        ctx.font = `700 ${13 * multiplier}px Plus Jakarta Sans, sans-serif`;
        ctx.fillText(l, kx, ky);

        ctx.fillStyle = activeTheme.primaryText;
        ctx.font = `800 ${20 * multiplier}px Playfair Display, serif`;
        ctx.fillText(v, kx, ky + 26 * multiplier);
      };

      drawKeyVal(kCol1, keyY, "FLIGHT CODE", flightNo || "HH-2026-GOI");
      drawKeyVal(kCol2, keyY, "SEAT NO / SLOT", seatNo || "247/6800+");

      drawKeyVal(kCol1, keyY + 70 * multiplier, "VILLA / TEAM", teamName || "HOUSE OF NGMI");
      drawKeyVal(kCol2, keyY + 70 * multiplier, "RESIDENCY DATE", "OCT 28–31, 2026");

      // QR Code
      if (showQr) {
        drawPassQRCode(
          ctx,
          cx - 85 * multiplier,
          910 * multiplier,
          170 * multiplier,
          dynamicQrPayload,
          activeTheme.accentGold
        );
      }

      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `700 ${13 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("#FrameInGoa • 247 SELECTED RESIDENTS 🌴", cx, 1120 * multiplier);

    } else {
      // FORMAT 3: PFP_AVATAR (Square Social Profile Frame)
      const cx = passW / 2;
      const cy = passH / 2;

      const radius = 380 * multiplier;
      const pX = cx - radius;
      const pY = cy - radius - 30 * multiplier;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy - 30 * multiplier, radius, 0, Math.PI * 2);
      ctx.clip();

      if (loadedImg && loadedImg.naturalWidth > 0 && loadedImg.naturalHeight > 0) {
        applyFilters();
        const imgAspect = loadedImg.naturalWidth / loadedImg.naturalHeight || 1;
        const renderW = radius * 2 * zoom;
        const renderH = ((radius * 2) / imgAspect) * zoom;

        if (Number.isFinite(renderW) && Number.isFinite(renderH) && renderW > 0 && renderH > 0) {
          ctx.drawImage(
            loadedImg,
            cx - renderW / 2 + pan.x * multiplier,
            cy - 30 * multiplier - renderH / 2 + pan.y * multiplier,
            renderW,
            renderH
          );
        }
      } else {
        ctx.fillStyle = "#EAE3D2";
        ctx.fillRect(pX, pY, radius * 2, radius * 2);
      }
      ctx.restore();

      // Gold / Azulejo Circular Frame Ring
      ctx.strokeStyle = activeTheme.accentGold;
      ctx.lineWidth = 12 * multiplier;
      ctx.beginPath();
      ctx.arc(cx, cy - 30 * multiplier, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3 * multiplier;
      ctx.beginPath();
      ctx.arc(cx, cy - 30 * multiplier, radius + 10 * multiplier, 0, Math.PI * 2);
      ctx.stroke();

      if (isEditingImage) {
        ctx.save();
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 4 * multiplier;
        ctx.setLineDash([10 * multiplier, 10 * multiplier]);
        ctx.beginPath();
        ctx.arc(cx, cy - 30 * multiplier, radius + 18 * multiplier, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#f59e0b";
        ctx.font = `700 ${16 * multiplier}px Plus Jakarta Sans, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("EDIT MODE (DRAG TO MOVE)", cx, cy - 30 * multiplier - radius - 28 * multiplier);
        ctx.restore();
      }

      // Bottom Badge Banner
      const bannerY = passH - 180 * multiplier;
      ctx.fillStyle = activeTheme.cardBg1;
      ctx.shadowColor = "rgba(29,53,87,0.12)";
      ctx.shadowBlur = 25 * multiplier;
      ctx.beginPath();
      ctx.roundRect(70 * multiplier, bannerY, passW - 140 * multiplier, 140 * multiplier, 28 * multiplier);
      ctx.fill();
      ctx.shadowColor = "transparent";

      ctx.strokeStyle = activeTheme.accentGold;
      ctx.lineWidth = 3 * multiplier;
      ctx.beginPath();
      ctx.roundRect(70 * multiplier, bannerY, passW - 140 * multiplier, 140 * multiplier, 28 * multiplier);
      ctx.stroke();

      drawLogoMark(ctx, 100 * multiplier, bannerY + 28 * multiplier, 54 * multiplier, activeTheme.accentGold);

      ctx.textAlign = "left";
      ctx.fillStyle = activeTheme.primaryText;
      ctx.font = `800 ${36 * multiplier}px Playfair Display, serif`;
      ctx.fillText(name || "BUILDER DELEGATE", 175 * multiplier, bannerY + 58 * multiplier);

      ctx.fillStyle = activeTheme.accentGold;
      ctx.font = `700 ${20 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(`@${handle || "handle"} • HH GOA 2026 🌴`, 175 * multiplier, bannerY + 92 * multiplier);

      ctx.fillStyle = activeTheme.secondaryText;
      ctx.font = `600 ${14 * multiplier}px Plus Jakarta Sans, sans-serif`;
      ctx.fillText(`${builderTitle} | ${department}`, 175 * multiplier, bannerY + 118 * multiplier);
    }

    ctx.restore(); // Restore preset translation
  }, [
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
    loadedImg,
    zoom,
    pan,
    filter,
    sticker,
    showQr,
    resolution,
    canvasRef,
    isEditingImage
  ]);

  // Lock image scale state to prevent re-renders on scroll or window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prevent default touch/wheel browser scaling events on the canvas
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };

    canvas.addEventListener('wheel', preventZoom, { passive: false });
    return () => canvas.removeEventListener('wheel', preventZoom);
  }, [canvasRef]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden p-1 sm:p-2">
      {/* 3D Tilt Card Wrapper with Goan Sand & Azulejo Border */}
      <div
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        className="relative max-w-full overflow-hidden rounded-3xl shadow-2xl border-2 border-[#1D3557]/30 transition-all select-none bg-[#FDF0D5]/80 backdrop-blur-md p-1 sm:p-1.5 flex justify-center items-center"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className={`max-w-full h-auto block rounded-3xl touch-none aspect-auto ${
            imageSrc ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          }`}
          style={{ maxHeight: "75vh" }}
        />
      </div>

      <div className="mt-2.5 text-[11px] font-sans font-bold text-sky-200 flex items-center gap-2 text-center">
        <span>
          {imageSrc
            ? "💡 Drag photo directly on canvas to reposition • Scroll or use controls to zoom"
            : "Upload a photo to customize your developer pass"}
        </span>
      </div>
    </div>
  );
};
