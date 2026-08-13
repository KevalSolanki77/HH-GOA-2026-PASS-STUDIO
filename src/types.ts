export type Format = "BOARDING_PASS" | "DELEGATE_PASS" | "PFP_AVATAR";

export type ThemeKey =
  | "FONTAINHAS_TERRACOTTA"
  | "ARABIAN_AZURE"
  | "PORTUGUESE_AZULEJO"
  | "SUSEGAD_GOLDEN_HOUR"
  | "PALM_CANOPY_EMERALD"
  | "ROYAL_IVORY_GOLD";

export interface ThemeConfig {
  name: string;
  subtitle: string;
  pageBg: string;
  panelBg: string;
  panelBorder: string;
  primaryText: string;
  secondaryText: string;
  cardBg1: string;
  cardBg2: string;
  accentGold: string;
  borderGlow: string;
  badgeBg: string;
  textColor: string;
  isLight: boolean;
}

export type PhotoFilter = "NONE" | "GOLDEN_HOUR" | "PORTRAIT_STUDIO" | "WARM_LUXURY" | "SILVER_MONO";

export type StickerStamp =
  | "GOA_SUNSET_2026"
  | "ANJUNA_CRYPTO_BAY"
  | "PALOLEM_BEACH_AI"
  | "FONTAINHAS_AZULEJO"
  | "DELEGATE_247"
  | "HOUSE_OF_NGMI"
  | "SOLANA_BUILDER"
  | "AI_RESIDENT"
  | "FOUNDER_VIP"
  | "VERIFIED";

export interface AIPersona {
  title: string;
  tagline: string;
  securityCode: string;
  recommendedCoworking: { spot: string; reason: string }[];
  hackerVibeScore: number;
}

export interface PassData {
  id: string;
  createdAt: number;
  format: Format;
  theme: ThemeKey;
  name: string;
  handle: string;
  stack: string;
  department: string;
  location: string;
  builderTitle: string;
  teamName: string;
  seatNo: string;
  flightNo: string;
  imageSrc: string | null;
  sticker: StickerStamp;
  filter: PhotoFilter;
  showQr: boolean;
  aiPersona?: AIPersona;
}

export interface Task {
  id: string;
  title: string;
  time: string;
  completed?: boolean;
}

export interface DaySchedule {
  day: string;
  title: string;
  tasks: Task[];
}

export type MainNavTab = "PASS_STUDIO" | "AI_PLANNER" | "SAVED_PASSES";
