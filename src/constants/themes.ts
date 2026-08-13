import { ThemeKey, ThemeConfig, StickerStamp } from "../types";

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  FONTAINHAS_TERRACOTTA: {
    name: "Fontainhas Terracotta & Sand",
    subtitle: "Latin Quarter painted houses in warm terracotta, ochre & Cobalt Azulejo",
    pageBg: "#FDF0D5",
    panelBg: "#FFFFFF",
    panelBorder: "#E07A5F",
    primaryText: "#1D3557",
    secondaryText: "#E07A5F",
    cardBg1: "#FDF0D5",
    cardBg2: "#F4E3C1",
    accentGold: "#E07A5F",
    borderGlow: "rgba(224, 122, 95, 0.45)",
    badgeBg: "#1D3557",
    textColor: "#1D3557",
    isLight: true
  },
  ARABIAN_AZURE: {
    name: "Arabian Azure & Coastal Sky",
    subtitle: "Coastal Arabian Sea azure water paired with sun-washed sand & crisp white",
    pageBg: "#F4F9FC",
    panelBg: "#FFFFFF",
    panelBorder: "#0077B6",
    primaryText: "#1D3557",
    secondaryText: "#0077B6",
    cardBg1: "#EDF6F9",
    cardBg2: "#D8EBF2",
    accentGold: "#0077B6",
    borderGlow: "rgba(0, 119, 182, 0.45)",
    badgeBg: "#1D3557",
    textColor: "#1D3557",
    isLight: true
  },
  PORTUGUESE_AZULEJO: {
    name: "Portuguese Azulejo Tile",
    subtitle: "Traditional Goan cobalt ceramic tile patterns with gold leaf accents",
    pageBg: "#F8F9FA",
    panelBg: "#FFFFFF",
    panelBorder: "#1D3557",
    primaryText: "#1D3557",
    secondaryText: "#2A9D8F",
    cardBg1: "#FAFAFA",
    cardBg2: "#EBF1F5",
    accentGold: "#1D3557",
    borderGlow: "rgba(29, 53, 87, 0.5)",
    badgeBg: "#1D3557",
    textColor: "#1D3557",
    isLight: true
  },
  SUSEGAD_GOLDEN_HOUR: {
    name: "Mandovi Sunset & Amber",
    subtitle: "Susegad golden hour radiance with Mandovi river sunset amber & warm sand",
    pageBg: "#FAF4E8",
    panelBg: "#FFFFFF",
    panelBorder: "#D97706",
    primaryText: "#2D1B0E",
    secondaryText: "#D97706",
    cardBg1: "#FCF6E8",
    cardBg2: "#F3E4C8",
    accentGold: "#D97706",
    borderGlow: "rgba(217, 119, 6, 0.45)",
    badgeBg: "#2D1B0E",
    textColor: "#2D1B0E",
    isLight: true
  },
  PALM_CANOPY_EMERALD: {
    name: "Palolem Palm Canopy",
    subtitle: "Lush coastal palm canopy emerald green with sunlit sand & brass highlights",
    pageBg: "#F3F7F4",
    panelBg: "#FFFFFF",
    panelBorder: "#2D6A4F",
    primaryText: "#112A1D",
    secondaryText: "#2D6A4F",
    cardBg1: "#F1F6F3",
    cardBg2: "#DDE9E2",
    accentGold: "#2D6A4F",
    borderGlow: "rgba(45, 106, 79, 0.45)",
    badgeBg: "#112A1D",
    textColor: "#112A1D",
    isLight: true
  },
  ROYAL_IVORY_GOLD: {
    name: "Colonial Ivory & Gold",
    subtitle: "Warm pearl ivory canvas with regal brass & gold leaf filigree accents",
    pageBg: "#FAF8F5",
    panelBg: "#FFFFFF",
    panelBorder: "#E8E2D5",
    primaryText: "#1C1917",
    secondaryText: "#78716C",
    cardBg1: "#FDFBF7",
    cardBg2: "#F5EFE6",
    accentGold: "#D4AF37",
    borderGlow: "rgba(212, 175, 55, 0.45)",
    badgeBg: "#1C1917",
    textColor: "#1C1917",
    isLight: true
  }
};

export const GOA_BEACH_HUBS = [
  {
    id: "ARAMBOL",
    name: "Arambol Sunset Villa",
    region: "NORTH",
    tagline: "Bohemian Sunset Gathering & AI Hack Haven",
    vibe: "Relaxed, Creative, AI Swarms",
    description: "Famous for cliffside sunsets, drum circles, and open-air villa hackathons under swaying palms.",
    icon: "Sun",
    presetDepartment: "Goa AI Residency & Agents",
    presetLocation: "Goa (Arambol Sunset Villa)",
    presetTitle: "Goa Resident AI Architect",
    presetStack: "AI Swarms / LLM Agents / Solana",
    presetTheme: "SUSEGAD_GOLDEN_HOUR",
    presetSticker: "GOA_SUNSET_2026"
  },
  {
    id: "ANJUNA",
    name: "Anjuna Beach Bay",
    region: "NORTH",
    tagline: "Iconic Crypto Bay & Flea Market Culture",
    vibe: "High Energy Web3 & DePIN",
    description: "The historic heart of Goan counterculture, now hosting Solana protocol devs & DePIN builders.",
    icon: "Waves",
    presetDepartment: "Solana & Crypto Protocol",
    presetLocation: "Goa (Anjuna Beach Bay)",
    presetTitle: "Solana Protocol Dev",
    presetStack: "Rust / ZK Proofs / Solana Core",
    presetTheme: "ARABIAN_AZURE",
    presetSticker: "ANJUNA_CRYPTO_BAY"
  },
  {
    id: "FONTAINHAS",
    name: "Panaji Fontainhas Latin Quarter",
    region: "CENTRAL",
    tagline: "Indo-Portuguese Heritage & Azulejo Architecture",
    vibe: "Heritage Architecture & Design",
    description: "Cobblestone alleys, brightly painted colonial houses, terracotta roofs, and historic Azulejo ceramic tiles.",
    icon: "Landmark",
    presetDepartment: "Product, Design & UX Studio",
    presetLocation: "Goa (Panaji Fontainhas)",
    presetTitle: "Fontainhas UX & Heritage Craftsman",
    presetStack: "Design Systems / React / Canvas API",
    presetTheme: "FONTAINHAS_TERRACOTTA",
    presetSticker: "FONTAINHAS_AZULEJO"
  },
  {
    id: "PALOLEM",
    name: "Palolem Beach Residency",
    region: "SOUTH",
    tagline: "Pristine Crescent Bay & Deep Focus Sanctuary",
    vibe: "Deep Susegad & Deep Research",
    description: "South Goa's tranquil crescent beach, surrounded by dense palm groves — ideal for quiet focus & cryptography.",
    icon: "Compass",
    presetDepartment: "Research & ZK Cryptography",
    presetLocation: "Goa (Palolem Residency)",
    presetTitle: "Palolem Beach AI Fellow",
    presetStack: "Python / PyTorch / Agentic AI",
    presetTheme: "PALM_CANOPY_EMERALD",
    presetSticker: "PALOLEM_BEACH_AI"
  }
];

export const BUILDER_TITLES = [
  "Goa Resident AI Architect",
  "Fontainhas UX & Heritage Craftsman",
  "Solana Protocol Dev",
  "Agentic AI Specialist",
  "Arambol Hack Villa Lead",
  "Palolem Beach AI Fellow",
  "Fullstack Web3 Engineer",
  "ZK Proofs Researcher",
  "LLM Systems Specialist",
  "Founder & Lead Builder",
  "House of NGMI Creator",
  "DePIN Infrastructure Lead",
  "Autonomous Agent Architect"
];

export const DEPARTMENTS = [
  "Goa AI Residency & Agents",
  "Solana & Crypto Protocol",
  "Product, Design & UX Studio",
  "Arambol Hack Villa & Studio",
  "Engineering & AI Core",
  "Ecosystem & Founders Circle",
  "Research & ZK Cryptography"
];

export const LOCATIONS = [
  "Goa (Arambol Sunset Villa)",
  "Goa (Anjuna Beach Bay)",
  "Goa (Panaji Fontainhas)",
  "Goa (Palolem Residency)",
  "Goa (Vagator Cliff Hub)",
  "Goa (Morjim AI House)",
  "Bengaluru, India",
  "Mumbai, India",
  "San Francisco, USA",
  "Dubai, UAE",
  "Singapore",
  "London, UK",
  "Tokyo, Japan"
];

export const STICKER_LABELS: Record<StickerStamp, { title: string; subtitle: string; color: string }> = {
  GOA_SUNSET_2026: { title: "GOA SUNSET", subtitle: "ARAMBOL VILLA", color: "#E07A5F" },
  ANJUNA_CRYPTO_BAY: { title: "ANJUNA BAY", subtitle: "CRYPTO RESIDENT", color: "#0077B6" },
  PALOLEM_BEACH_AI: { title: "PALOLEM AI", subtitle: "RESIDENT BUILDER", color: "#2D6A4F" },
  FONTAINHAS_AZULEJO: { title: "FONTAINHAS", subtitle: "AZULEJO TILE", color: "#1D3557" },
  DELEGATE_247: { title: "247 SELECTED", subtitle: "HH GOA 2026", color: "#D4AF37" },
  HOUSE_OF_NGMI: { title: "NGMI CREATOR", subtitle: "AI x CRYPTO", color: "#E07A5F" },
  SOLANA_BUILDER: { title: "SOLANA ECO", subtitle: "CORE DEV", color: "#0077B6" },
  AI_RESIDENT: { title: "AI RESIDENT", subtitle: "AGENTS & LLMS", color: "#D97706" },
  FOUNDER_VIP: { title: "FOUNDER VIP", subtitle: "ALL ACCESS", color: "#B45309" },
  VERIFIED: { title: "VERIFIED 247", subtitle: "SELECTED RESIDENT", color: "#2D6A4F" }
};

export const SAMPLE_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
];
