import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "hh-goa-builder-2026",
        },
      },
    });
  };

  // API Route: AI Persona Generator
  app.post("/api/ai/persona", async (req, res) => {
    try {
      const { name, github, role, techStack, hackathonIdea } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are the chief AI curator for "HackerHouse Goa 2026", an elite developer residency in Goa, India.
Generate a creative, hilarious, and authentic Goan Hacker Persona for the developer with the following details:
- Name: ${name || "Anonymous Builder"}
- GitHub Handle: ${github || "@goahacker"}
- Core Role: ${role || "Full Stack Developer"}
- Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack || "TypeScript, React"}
- Hackathon Idea: ${hackathonIdea || "AI Agent for Goan Tourism"}

Respond in JSON with the following structure:
- title: A quirky, epic Goan Hacker Title (e.g., "Susegad Systems Architect", "Feni-Fueled Async Dev", "Fontainhas Frontend Virtuoso", "Calangute Cloud Ninja")
- tagline: A funny 1-sentence bio blending Goa lifestyle (Feni, susegad, sunsets, cashews, beaches, shacks) with elite coding flexes.
- securityCode: A cool hex badge pass code formatted like "HHG-2026-XXXX" (e.g., "HHG-2026-F3N1")
- recommendedCoworking: Array of 3 specific Goan cafes or beach co-working hubs (e.g., "Barefoot Cafe Fontainhas", "Clay Cafe Anjuna", "91springboard Panjim") with a 1-sentence reason why it suits their tech stack.
- hackerVibeScore: An integer between 88 and 99 representing their Goan Susegad-to-Code ratio.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              tagline: { type: Type.STRING },
              securityCode: { type: Type.STRING },
              recommendedCoworking: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    spot: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                },
              },
              hackerVibeScore: { type: Type.INTEGER },
            },
            required: ["title", "tagline", "securityCode", "recommendedCoworking", "hackerVibeScore"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      return res.json({ success: true, persona: data });
    } catch (err: any) {
      console.error("AI Persona Engine Error:", err?.message || err);
      // Fallback local persona generation on error / rate-limit
      const isQuotaError = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.message?.includes("quota");
      
      const fallbackPersona = {
        title: "Susegad Systems Architect",
        tagline: "Feni-fueled async systems builder crafting Goan heritage AI agents by Calangute sunset.",
        securityCode: "HHG-2026-F3N1",
        recommendedCoworking: [
          { spot: "Barefoot Cafe, Fontainhas", reason: "Spacious historic veranda with artisanal Goan espresso & gigabit fiber." },
          { spot: "Clay Cafe, Anjuna", reason: "Shaded garden tables perfect for late-night async AI agent debugging." },
          { spot: "91springboard, Panjim", reason: "High-power ergonomic setups with ocean breeze views." }
        ],
        hackerVibeScore: 95
      };

      return res.json({
        success: true,
        persona: fallbackPersona,
        isQuotaError: true,
        isOfflineFallback: true,
        error: err?.message || "Using local fallback mode"
      });
    }
  });

  // API Route: AI 3-Day Hackathon Sprint Scheduler
  const handleScheduleRequest = async (req: express.Request, res: express.Response) => {
    try {
      const { idea, projectName, teamSize, techStack } = req.body;
      const ai = getGeminiClient();
      const pName = projectName || idea || "Autonomous AI Agent for Goan Local Heritage";

      const prompt = `You are a senior technical lead and hackathon mentor. Construct a realistic, step-by-step 3-day hackathon execution schedule for a developer team.
Project Name / Idea: ${pName}
Team Size: ${teamSize || "3 Builders"}
Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack || "React, Express, Node.js"}

Respond in valid JSON matching this exact structure:
[
  {
    "day": "Day 1",
    "title": "Day 1 Focus Theme & Title",
    "tasks": [
      { "id": "d1-1", "title": "Detailed concise task title", "time": "10:00 AM" },
      { "id": "d1-2", "title": "Detailed concise task title", "time": "02:00 PM" }
    ]
  },
  {
    "day": "Day 2",
    "title": "Day 2 Focus Theme & Title",
    "tasks": [
      { "id": "d2-1", "title": "Detailed concise task title", "time": "11:00 AM" },
      { "id": "d2-2", "title": "Detailed concise task title", "time": "04:00 PM" }
    ]
  },
  {
    "day": "Day 3",
    "title": "Day 3 Focus Theme & Title",
    "tasks": [
      { "id": "d3-1", "title": "Detailed concise task title", "time": "10:00 AM" },
      { "id": "d3-2", "title": "Detailed concise task title", "time": "02:00 PM" }
    ]
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                title: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      time: { type: Type.STRING },
                    },
                    required: ["id", "title", "time"],
                  },
                },
              },
              required: ["day", "title", "tasks"],
            },
          },
        },
      });

      let rawText = response.text || "[]";
      // Strip markdown backticks if any exist
      rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const data = JSON.parse(rawText);
      return res.json({ success: true, schedule: data });
    } catch (err: any) {
      console.error("AI Schedule Engine Error:", err?.message || err);

      const fallbackSchedule = [
        {
          day: "Day 1",
          title: "Architecture & Foundation",
          tasks: [
            { id: "d1-1", title: "Residency Orientation & Team Welcome", time: "09:00 AM" },
            { id: "d1-2", title: "Core API Architecture & Scaffolding Setup", time: "02:00 PM" },
            { id: "d1-3", title: "Data Model & Schema Design Review", time: "06:00 PM" },
            { id: "d1-4", title: "Midnight Code Sprint & Base Routing", time: "11:30 PM" }
          ]
        },
        {
          day: "Day 2",
          title: "Deep Logic & Full-Stack Integration",
          tasks: [
            { id: "d2-1", title: "Full-Stack Data Wiring & State Management", time: "11:00 AM" },
            { id: "d2-2", title: "Core Business Logic & API Edge Cases", time: "04:30 PM" },
            { id: "d2-3", title: "Team Synchronization & Feature Testing", time: "08:00 PM" },
            { id: "d2-4", title: "Late Night Bug Bash & Performance Tuning", time: "02:00 AM" }
          ]
        },
        {
          day: "Day 3",
          title: "UI Polish & Final Pitch Showcase",
          tasks: [
            { id: "d3-1", title: "UI Responsive Polish & Asset Exporting", time: "10:00 AM" },
            { id: "d3-2", title: "Final Pitch Prep, Demo Video & Submission", time: "02:00 PM" },
            { id: "d3-3", title: "Hackathon Presentation & Project Launch", time: "06:00 PM" }
          ]
        }
      ];

      return res.json({
        success: true,
        schedule: fallbackSchedule,
        isQuotaError: true,
        isOfflineFallback: true,
        error: err?.message || "Using local fallback schedule"
      });
    }
  };

  app.post("/api/ai/schedule", handleScheduleRequest);
  app.post("/api/generate-sprint", handleScheduleRequest);

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
