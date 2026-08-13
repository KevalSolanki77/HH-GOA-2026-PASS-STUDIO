import React, { useState, useEffect } from "react";
import { Sparkles, Trash2, Calendar, Clock, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { DaySchedule } from "../types";

interface AISchedulePlannerProps {
  techStack?: string;
}

interface ToastNotification {
  type: "success" | "error" | "info";
  message: string;
}

const generateDynamicSprint = (
  projectName: string,
  techStack: string,
  teamSize: string
): DaySchedule[] => {
  const pName = projectName.trim() || "Autonomous AI Agent";
  const tStack = techStack.trim() || "React, Express & Node.js";
  const tSize = teamSize.trim() || "3 Builders";

  const timestamp = Date.now();

  return [
    {
      day: "Day 1",
      title: `Architecture & Foundation for ${pName}`,
      tasks: [
        {
          id: `d1-1-${timestamp}`,
          title: `Setup scaffolding & wire ${tStack} core architecture for ${pName}`,
          time: "09:00 AM",
        },
        {
          id: `d1-2-${timestamp}`,
          title: `Setup data model & schema design for ${tSize} team workflow`,
          time: "02:00 PM",
        },
        {
          id: `d1-3-${timestamp}`,
          title: `Configure ${tStack} API endpoints & environment variables`,
          time: "06:00 PM",
        },
        {
          id: `d1-4-${timestamp}`,
          title: `Late night MVP foundation sprint for ${pName}`,
          time: "11:30 PM",
        },
      ],
    },
    {
      day: "Day 2",
      title: `Deep Logic & ${tStack} Integration`,
      tasks: [
        {
          id: `d2-1-${timestamp}`,
          title: `Implement core business logic & API integrations for ${pName}`,
          time: "10:00 AM",
        },
        {
          id: `d2-2-${timestamp}`,
          title: `Connect ${tStack} backend services to UI state wiring`,
          time: "02:30 PM",
        },
        {
          id: `d2-3-${timestamp}`,
          title: `Deep work session for ${tSize} team on feature set & edge cases`,
          time: "07:00 PM",
        },
        {
          id: `d2-4-${timestamp}`,
          title: `Midnight bug bash & performance testing for ${pName}`,
          time: "11:30 PM",
        },
      ],
    },
    {
      day: "Day 3",
      title: `UI Polish, Demo & Pitch Showcase`,
      tasks: [
        {
          id: `d3-1-${timestamp}`,
          title: `UI polish, responsive layout & export optimization for ${pName}`,
          time: "09:30 AM",
        },
        {
          id: `d3-2-${timestamp}`,
          title: `Deploy production build built with ${tStack} & verify live URL`,
          time: "01:00 PM",
        },
        {
          id: `d3-3-${timestamp}`,
          title: `Final pitch deck prep & demo video recording for ${pName}`,
          time: "04:30 PM",
        },
        {
          id: `d3-4-${timestamp}`,
          title: `Hackathon presentation & victory celebration`,
          time: "06:30 PM",
        },
      ],
    },
  ];
};

export const AISchedulePlanner: React.FC<AISchedulePlannerProps> = ({ techStack }) => {
  const [projectName, setProjectName] = useState<string>("Autonomous AI Agent for Goan Local Heritage & Tourism");
  const [teamSize, setTeamSize] = useState<string>("3 Builders");
  const [customStack, setCustomStack] = useState<string>(techStack || "React, Express, Node.js");
  
  // Safe state initialization
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(() =>
    generateDynamicSprint("Autonomous AI Agent for Goan Local Heritage & Tourism", techStack || "React, Express, Node.js", "3 Builders")
  );
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Auto-hide toast notification after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load from localStorage or initialize
  useEffect(() => {
    try {
      const saved = localStorage.getItem("saved_sprint_plan");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setScheduleData(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Update input when prop changes
  useEffect(() => {
    if (techStack) {
      setCustomStack(techStack);
    }
  }, [techStack]);

  // Helper to safely parse JSON by stripping markdown backticks
  const parseSafeJSON = (rawStr: string): DaySchedule[] | null => {
    try {
      const cleaned = rawStr.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // Dynamic Gemini Sprint Generation via API endpoint
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setToast({ type: "info", message: "Connecting to Gemini model to generate custom sprint plan..." });

    try {
      const response = await fetch("/api/ai/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          idea: projectName,
          techStack: customStack,
          teamSize,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to reach AI service`);
      }

      const resData = await response.json();

      let newSchedule: DaySchedule[] | null = null;

      if (resData?.schedule) {
        if (typeof resData.schedule === "string") {
          newSchedule = parseSafeJSON(resData.schedule);
        } else if (Array.isArray(resData.schedule)) {
          newSchedule = resData.schedule;
        }
      }

      if (newSchedule && Array.isArray(newSchedule) && newSchedule.length > 0) {
        setScheduleData(newSchedule);
        setSelectedTaskIds([]);
        setActiveDayIndex(0);
        
        try {
          localStorage.setItem("saved_sprint_plan", JSON.stringify(newSchedule));
        } catch (e) {
          // ignore
        }

        if (resData.isOfflineFallback) {
          setToast({
            type: "info",
            message: "Generated sprint plan using local dynamic AI engine.",
          });
        } else {
          setToast({
            type: "success",
            message: `Custom 3-day sprint plan generated by Gemini for "${projectName || 'Your Project'}"!`,
          });
        }
      } else {
        throw new Error("Invalid schedule format returned from AI model");
      }
    } catch (err: any) {
      console.warn("AI Generation Error / Fallback triggered:", err?.message || err);
      
      // Clean fallback generation without crashing UI
      const fallbackSchedule = generateDynamicSprint(projectName, customStack, teamSize);
      setScheduleData(fallbackSchedule);
      setSelectedTaskIds([]);
      setActiveDayIndex(0);

      try {
        localStorage.setItem("saved_sprint_plan", JSON.stringify(fallbackSchedule));
      } catch (e) {
        // ignore
      }

      setToast({
        type: "error",
        message: "Network or API timeout. Created dynamic sprint plan locally.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle task selection on row click or checkbox toggle
  const toggleTaskSelection = (id: string) => {
    setSelectedTaskIds((prev) => {
      const safePrev = prev || [];
      return safePrev.includes(id) ? safePrev.filter((item) => item !== id) : [...safePrev, id];
    });
  };

  // Delete ONLY selected tasks across all days
  const handleDeleteSelected = () => {
    const safeSelected = selectedTaskIds || [];
    if (safeSelected.length === 0) return;

    setScheduleData((prevDays) => {
      const safePrevDays = prevDays || [];
      const updated = safePrevDays
        .map((day) => ({
          ...day,
          tasks: (day?.tasks || []).filter((task) => !safeSelected.includes(task.id)),
        }))
        .filter((day) => (day?.tasks || []).length > 0);

      const finalSchedule = updated.length > 0 ? updated : generateDynamicSprint(projectName, customStack, teamSize);
      try {
        localStorage.setItem("saved_sprint_plan", JSON.stringify(finalSchedule));
      } catch (e) {
        // ignore
      }
      return finalSchedule;
    });

    setSelectedTaskIds([]);
    setToast({
      type: "info",
      message: `Deleted ${safeSelected.length} task(s).`,
    });
  };

  const safeScheduleData = scheduleData || [];
  const currentDay = safeScheduleData[activeDayIndex] || safeScheduleData[0];
  const safeSelectedLength = (selectedTaskIds || []).length;

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto relative">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between gap-3 shadow-xl transition-all ${
            toast.type === "error"
              ? "bg-red-950/80 border-red-500/40 text-red-200"
              : toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
              : "bg-amber-950/80 border-amber-500/40 text-amber-200"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            {toast.type === "error" ? (
              <AlertCircle size={16} className="text-red-400 shrink-0" />
            ) : toast.type === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <Sparkles size={16} className="text-amber-400 shrink-0" />
            )}
            <span className="truncate block w-full overflow-hidden">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-200 cursor-pointer p-1 rounded-lg shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Configuration Header */}
      <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20 mb-2">
              <Sparkles size={14} />
              <span>Gemini AI Hackathon Sprint Planner</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              3-Day Hackathon Execution Scheduler
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mt-1">
              Enter project details below and click Generate Sprint Plan to construct a step-by-step AI hackathon execution schedule. Select checkboxes to delete tasks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Delete Selected Action */}
            <button
              onClick={handleDeleteSelected}
              disabled={safeSelectedLength === 0 || isGenerating}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              <Trash2 size={14} />
              <span>Delete Selected ({safeSelectedLength})</span>
            </button>

            {/* Dynamic Gemini Sprint Generation */}
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Planning with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>⚡ Generate Sprint Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Project Name / Idea
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. AI Heritage Guide"
              disabled={isGenerating}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-medium text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Team Size
            </label>
            <input
              type="text"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="e.g. 3 Builders"
              disabled={isGenerating}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-medium text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Tech Stack
            </label>
            <input
              type="text"
              value={customStack}
              onChange={(e) => setCustomStack(e.target.value)}
              placeholder="e.g. React, Express, Python"
              disabled={isGenerating}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-medium text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
            />
          </div>
        </div>
      </section>

      {/* Day Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(safeScheduleData || []).map((day, idx) => (
          <button
            key={day?.day || `day-${idx}`}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeDayIndex === idx
                ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <Calendar size={13} />
            <span className="truncate max-w-[220px] overflow-hidden">{day?.day}: {day?.title}</span>
          </button>
        ))}
      </div>

      {/* Active Day Schedule Content */}
      {currentDay && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="min-w-0 flex-1 overflow-hidden mr-2">
              <h3 className="text-sm font-bold text-amber-400 truncate overflow-hidden">
                {currentDay.day}: {currentDay.title}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 shrink-0">
              {(currentDay?.tasks || []).length} tasks
            </span>
          </div>

          {/* Task Items Container with Strict Layout Boundaries */}
          <div className="space-y-2 w-full max-w-full overflow-hidden">
            {(currentDay?.tasks || []).map((task) => {
              const safeSelected = selectedTaskIds || [];
              const isChecked = safeSelected.includes(task.id);

              return (
                <div
                  key={task.id}
                  onClick={() => toggleTaskSelection(task.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 w-full max-w-full overflow-hidden cursor-pointer transition-all ${
                    isChecked
                      ? "bg-amber-500/10 border-amber-500/40"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Left: Single Checkbox + Title (truncate & overflow-hidden prevent line breaks) */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Driven by div container click
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer flex-shrink-0 accent-amber-500"
                    />
                    <span
                      className={`text-xs font-medium truncate block w-full min-w-0 overflow-hidden ${
                        isChecked ? "line-through text-slate-500" : "text-slate-200"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Right: Time Badge */}
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 flex-shrink-0 whitespace-nowrap flex items-center gap-1">
                    <Clock size={11} className="text-slate-500" />
                    <span>{task.time}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISchedulePlanner;
