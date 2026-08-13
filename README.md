# 🌴 HackerHouse Goa 2026 — Builder Residency & AI Pass Studio

> A high-performance, client-side web application built to generate, customize, and export branded **Builder ID Cards (Format B)** and **PFP Frames (Format A)** for HackerHouse Goa 2026. Features an interactive Canvas photo studio, 1-click evaluator profiles, an integrated AI Hackathon Sprint Planner, and 1-click posting to X (Twitter).

---

## 📌 Executive Summary

HackerHouse Goa 2026 Pass Studio allows builders to generate high-DPI event badges and social media overlays in seconds. Built entirely on the client side with zero mandatory signups or login walls, it offers near-instant canvas rendering, custom image manipulation, and direct social sharing designed to meet all submission criteria for the HackerHouse Goa 2026 shortlisting task.

---

## ✨ Key Features & Capabilities

- **Format A & B Dual Support:** Simultaneously supports ready-to-use PFP Overlays (Format A) and full Builder ID Badges (Format B).
- **Interactive Photo Studio Canvas:** Real-time client-side image processing (supporting `JPG`, `PNG`, and iPhone `HEIC`) with drag-to-pan positioning, zoom controls, and canvas aspect ratio locks.
- **High-DPI Canvas Export Engine:** Uses $2\times$ pixel context scaling during PNG compilation to produce crisp, high-resolution 1080p outputs without blurriness.
- **1-Click Evaluation Presets:** Instant profile injectors (`Systems Architect`, `Full Stack Dev`, `AI/ML Engineer`) to populate sample badge data instantly for evaluators.
- **On-Brand Visual Identity:** Customized Goan Azulejo tile grid motifs, terracotta accent bars, custom developer personas, and verified pass metadata.
- **AI Hackathon Sprint Planner:** Integrated 3-day hackathon milestone planner with single-checkbox task selection, itemized task deletion, and offline fallback schedule protection.
- **Publish & Share Action Group:**
  - 📥 **Export Pass PNG:** Downloads a $2\times$ high-resolution badge PNG directly to disk.
  - 𝕏 **Share on X:** Opens a pre-filled tweet composer targeting mandatory `#FrameInGoa`, `#HackerHouseGoa`, and `@HackerHouseGoa`.
  - 🔗 **Copy Public Link:** Copies the live application URL directly to the clipboard with visual toast alerts.
- **Zero Friction:** 100% client-side execution—no sign-up gates, login walls, or database latency.

---

## 🛠️ Tech Stack

| Layer | Technology Used |
| :--- | :--- |
| **Framework** | [React 18](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Canvas Engine** | Native HTML5 Canvas 2D API ($2\times$ High-DPI Context Scaling) |
| **Icons** | Lucide React |
| **Deployment** | Vercel / Netlify |

---

## 📁 Project Directory Structure

```text
hh-goa-2026-pass-studio/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Optional CI/CD deployment pipeline
├── public/
│   ├── favicon.ico                 # Application favicon
│   ├── og-image.png                # Open Graph preview image for Twitter/X link cards
│   └── assets/
│       ├── frames/                 # SVG/PNG border overlays
│       └── badges/                 # Azulejo tile motifs and logos
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/                 # Reusable UI components
│   │   │   ├── HeaderActions.tsx   # Uncombined action menu (Export PNG / Copy Link)
│   │   │   ├── Toast.tsx           # Floating notification alerts
│   │   │   └── Button.tsx          # Standard button primitives
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # App header & tab switching navigation
│   │   │   └── Footer.tsx          # Footer branding & social links
│   │   ├── pass-studio/            # Core Badge Generator Domain
│   │   │   ├── PassCanvas.tsx      # High-DPI HTML5 canvas viewport
│   │   │   ├── SidebarControls.tsx # Controls panel (Upload, Zoom, Form Inputs)
│   │   │   └── DemoPresets.tsx     # 1-Click evaluation presets
│   │   └── sprint-planner/         # Hackathon Schedule Domain
│   │       ├── AISchedulePlanner.tsx # Task list with itemized task selection
│   │       └── TaskItem.tsx        # Individual milestone item rendering
│   ├── hooks/
│   │   ├── useCanvasRender.ts      # Custom hook for canvas drawing logic
│   │   ├── useImageEditor.ts       # Hook managing image dragging & scaling
│   │   └── useClipboard.ts         # Clipboard copy handlers
│   ├── lib/
│   │   ├── canvasExporter.ts       # $2\times$ pixel scaling PNG export handler
│   │   └── constants.ts            # Default presets and theme colors
│   ├── types/
│   │   └── pass.ts                 # TypeScript interfaces for Builder Profiles
│   ├── App.tsx                     # Main layout and view orchestration
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind directives and global styles
├── .gitignore                      # Git exclusion rules
├── index.html                      # HTML entry point with Open Graph & Twitter meta tags
├── package.json                    # Project dependencies and scripts
├── postcss.config.js               # PostCSS configuration for Tailwind
├── README.md                       # Comprehensive documentation
├── tailwind.config.js              # Custom design system tokens
├── tsconfig.json                   # Root TypeScript configuration
└── vite.config.ts                  # Vite bundler configuration