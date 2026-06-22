import { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import CareerRecommendations from "./components/CareerRecommendations";
import InteractiveRoadmap from "./components/InteractiveRoadmap";
import CareerChatbot from "./components/CareerChatbot";
import { UserProfile, CareerPathAIResult } from "./types";
import { 
  Sparkles, GraduationCap, MapPin, Wallet, Calendar, Bot, 
  RefreshCcw, Compass, ArrowRight, CheckCircle2, AlertCircle, BookOpen, Clock, HeartHandshake, LogOut 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const LOADING_STEPS = [
  "Scouting real-time Nigerian job market conditions...",
  "Estimating potential junior-level entry salaries in Naira (₦)...",
  "Locating active NITDA, ALX, and 3MTT cohorts...",
  "Mapping free resources (YouTube hubs, freeCodeCamp, Google Digital)...",
  "Tailoring milestones into your academic calendar or NYSC schedule...",
  "Reviewing generator auto-saves and night data plan survival tricks...",
  "Wrapping up mentorship suggestions from your Big Sibling in Tech!"
];

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [aiResult, setAiResult] = useState<CareerPathAIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedPathTitle, setSelectedPathTitle] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<"paths" | "roadmap" | "chat">("paths");

  // Custom Gemini API Key configuration state
  const [customKeyInput, setCustomKeyInput] = useState("");
  const [showKeySetup, setShowKeySetup] = useState(false);
  const [keySaveSuccess, setKeySaveSuccess] = useState(false);

  // Load profile and result from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("career-path-ai-profile");
    const savedResult = localStorage.getItem("career-path-ai-result");
    const savedSelectedPath = localStorage.getItem("career-path-ai-selected-path");
    const savedCustomKey = localStorage.getItem("career-path-ai-custom-key") || "";

    setCustomKeyInput(savedCustomKey);

    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setAiResult(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    if (savedSelectedPath) {
      setSelectedPathTitle(savedSelectedPath);
    }
  }, []);

  // Cycle loading status text
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3000);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem("career-path-ai-profile", JSON.stringify(profile));
    setLoading(true);
    setError(null);

    try {
      const customKey = localStorage.getItem("career-path-ai-custom-key") || "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customKey.trim().length > 0) {
        headers["x-gemini-key"] = customKey.trim();
      }

      const response = await fetch("/api/generate-career-path", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        let errMessage = "Unable to contact your big sister/brother. Please try again.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMessage = errData.error;
          }
        } catch (_) {}
        throw new Error(errMessage);
      }

      const data: CareerPathAIResult = await response.json();
      
      setAiResult(data);
      localStorage.setItem("career-path-ai-result", JSON.stringify(data));
      
      // Auto-select the first career path
      if (data.recommendedPaths && data.recommendedPaths.length > 0) {
        const defaultPath = data.recommendedPaths[0].title;
        setSelectedPathTitle(defaultPath);
        localStorage.setItem("career-path-ai-selected-path", defaultPath);
      }
      setCurrentTab("paths");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze your profile. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPath = (pathTitle: string) => {
    setSelectedPathTitle(pathTitle);
    localStorage.setItem("career-path-ai-selected-path", pathTitle);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to change your profile and regenerate your career paths?")) {
      setUserProfile(null);
      setAiResult(null);
      setSelectedPathTitle("");
      setError(null);
      localStorage.removeItem("career-path-ai-profile");
      localStorage.removeItem("career-path-ai-result");
      localStorage.removeItem("career-path-ai-selected-path");
    }
  };

  const handleSaveCustomKey = () => {
    localStorage.setItem("career-path-ai-custom-key", customKeyInput.trim());
    setKeySaveSuccess(true);
    setTimeout(() => {
      setKeySaveSuccess(false);
      setShowKeySetup(false);
    }, 1500);
  };

  // Main UI routing
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Platform Header Banner */}
      <header className="bg-white border-b border-gray-150 sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/15">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-950 flex items-center gap-1.5 leading-none">
              <span>Career Path AI</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">2026</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1">Localized Tech Career Roadmaps & Sibling Mentorship</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Custom API Key Button */}
          <div className="relative">
            <button
              onClick={() => setShowKeySetup(!showKeySetup)}
              id="api-key-setup-btn"
              className={`px-3.5 py-1.5 border rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                customKeyInput.trim().length > 0
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 font-extrabold"
                  : "border-gray-200 hover:border-emerald-200 text-gray-650 hover:text-emerald-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{customKeyInput.trim().length > 0 ? "API Active" : "Setup API Key"}</span>
            </button>

            {/* Custom API Key Form Dropdown */}
            {showKeySetup && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white border border-gray-150 rounded-xl p-4 shadow-xl z-50 text-left space-y-3"
                id="api-key-dropdown"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">Set Your Gemini API Key</h4>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    If you face internet issues or need direct connection, enter your personal key from Google AI Studio. It is saved securely in your browser's localStorage.
                  </p>
                </div>
                
                <input
                  type="password"
                  id="api-key-input"
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  placeholder="Paste AI Studio API key here"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                />

                <div className="flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => {
                      setCustomKeyInput("");
                      localStorage.removeItem("career-path-ai-custom-key");
                      setShowKeySetup(false);
                    }}
                    id="clear-api-key-btn"
                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear Key
                  </button>
                  <button
                    onClick={handleSaveCustomKey}
                    id="save-api-key-btn"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors"
                  >
                    {keySaveSuccess ? "Saved ✓" : "Save Key"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {userProfile && (
            <button
              onClick={handleReset}
              id="reset-profile-top-btn"
              className="px-3.5 py-1.5 border border-gray-200 hover:border-red-200 text-xs font-bold text-gray-650 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Setup</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 flex flex-col relative py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        
        <AnimatePresence mode="wait">
          
          {/* LOADER */}
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-20 text-center"
              id="loader-screen"
            >
              <div className="bg-white border border-gray-150 rounded-2xl p-8 max-w-md shadow-sm relative overflow-hidden flex flex-col items-center space-y-6">
                {/* Visual loading icon */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xl">
                    ⚡
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Designing Your Pathways</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Analyzing budgets, schedules, and electricity buffers. Your older sibling is mapping out the best options for you...
                  </p>
                </div>

                {/* Shifting text lines */}
                <div className="w-full bg-emerald-50 text-emerald-800 border border-emerald-100/60 p-3.5 rounded-xl text-xs font-bold font-mono min-h-[58px] flex items-center justify-center">
                  <motion.span
                    key={loadingStepIdx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {LOADING_STEPS[loadingStepIdx]}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}

          {/* INITIAL ONBOARDING */}
          {!loading && !userProfile && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex items-center justify-center"
            >
              <Onboarding onComplete={handleOnboardingComplete} />
            </motion.div>
          )}

          {/* ERROR STATUS */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center py-12 max-w-lg mx-auto w-full"
              id="error-screen"
            >
              <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 w-full">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Active API / Network Sync Delay</h3>
                  <div className="bg-red-50/60 border border-red-100 rounded-xl p-3 text-xs text-red-800 leading-relaxed font-medium">
                    {error}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                    Your Senior Tech Bro/Sis hit a speedbump trying to connect. This happens when the server does not have an active API Key or internet access is delayed.
                  </p>
                </div>

                {/* API Setup Walkthrough Info */}
                <div className="bg-slate-50 rounded-xl p-4.5 border border-gray-150 space-y-3 text-left">
                  <h4 className="text-[11px] font-black text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
                    💡 Deployment Configuration Guide
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    To make this deployment live permanently without entering custom keys on the screen, add the following key inside your workspace <code className="bg-gray-200 text-gray-750 px-1 py-0.5 rounded text-[10px] font-mono font-bold">.env</code> or Platform Secrets under Settings:
                  </p>
                  <div className="bg-slate-900 text-slate-100 rounded-lg p-3 text-[10.5px] font-mono leading-relaxed border border-slate-950 overflow-x-auto">
                    <span className="text-amber-400"># In your environment secrets or .env file:</span><br />
                    <span className="text-emerald-400">GEMINI_API_KEY</span>=your_actual_gemini_api_key_here
                  </div>
                </div>

                {/* Direct Key Entry Component inside error screen */}
                <div className="bg-emerald-50/60 border border-emerald-110 rounded-xl p-4.5 space-y-3.5 text-left">
                  <div className="flex items-start gap-2.5">
                    <div className="bg-emerald-600 text-white rounded-lg p-1.5 flex items-center justify-center mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-950">Quick Fix: Paste Key Directly</h4>
                      <p className="text-[11px] text-emerald-850 leading-normal">
                        Paste your Gemini API key from Google AI Studio. It runs on the server through secure client headers, and is stored only in your local browser state.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="password"
                      id="error-screen-api-key"
                      placeholder="Paste AIzaSy... key format here"
                      value={customKeyInput}
                      onChange={(e) => setCustomKeyInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-lg text-xs placeholder-emerald-800/40 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={async () => {
                          const cleaned = customKeyInput.trim();
                          localStorage.setItem("career-path-ai-custom-key", cleaned);
                          setError(null);
                          if (userProfile) {
                            await handleOnboardingComplete(userProfile);
                          } else {
                            setError("Please re-enter details before generating.");
                          }
                        }}
                        id="error-screen-save-btn"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span>Save Key & Try Generating</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-150 pt-4.5">
                  <button
                    onClick={() => {
                      setError(null);
                      setUserProfile(null);
                    }}
                    id="error-screen-back-btn"
                    className="text-xs font-bold text-gray-500 hover:text-slate-800 transition-colors flex items-center gap-1"
                  >
                    ← Edit Setup Form
                  </button>

                  <button
                    onClick={() => {
                      setError(null);
                      if (userProfile) {
                        handleOnboardingComplete(userProfile);
                      }
                    }}
                    id="error-screen-retry-btn"
                    className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                  >
                    Just Retry Code Connection
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* COMPLETED DASHBOARD */}
          {!loading && !error && userProfile && aiResult && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              id="dashboard-screen"
            >
              
              {/* LEFT PROFILE & INTRO SUMMARY RAIL - 3 cols */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Profile Widget */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-extrabold text-slate-900 text-sm">Your Parameters</h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>

                  <div className="space-y-3" id="profile-details-sidebar">
                    <div className="flex gap-2.5 items-start">
                      <GraduationCap className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Stage</span>
                        <span className="text-xs font-bold text-gray-800">{userProfile.educationLevel}</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <BookOpen className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Course/Field</span>
                        <span className="text-xs font-bold text-gray-800">{userProfile.courseField || "Not specified"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Residency State</span>
                        <span className="text-xs font-bold text-gray-800">{userProfile.stateResidence}</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <Wallet className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Data Budget Level</span>
                        <span className="text-xs font-bold text-gray-800">₦{userProfile.monthlyBudget}</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <Calendar className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Target Schedule</span>
                        <span className="text-xs font-bold text-gray-800">{userProfile.timelinePreference} Sync</span>
                      </div>
                    </div>
                  </div>

                  {/* Redo setup */}
                  <div className="pt-2">
                    <button
                      onClick={handleReset}
                      id="reset-profile-side-btn"
                      className="w-full py-2.5 border border-slate-100 hover:border-red-100 text-xs font-bold text-gray-500 hover:text-red-600 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>Re-enter Profile Info</span>
                    </button>
                  </div>
                </div>

                {/* Sibling Letter Overall summary */}
                <div className="bg-gradient-to-br from-emerald-900 to-emerald-955 text-white rounded-2xl p-5 md:p-6 shadow-md space-y-4 border border-emerald-950">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-emerald-450 shrink-0 animate-bounce" />
                    <h3 className="font-extrabold text-sm uppercase tracking-wide text-emerald-250">Word from Your Mentor</h3>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-emerald-100 font-medium italic whitespace-pre-line">
                    "{aiResult.overallSummary}"
                  </p>
                </div>

              </div>

              {/* RIGHT TABS & MAIN ACTION workspace - 9 cols */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Navigation Menu Buttons */}
                <div className="flex gap-1.5 bg-white border border-gray-150 p-1.5 rounded-2xl shadow-xs" id="dashboard-navbar">
                  <button
                    onClick={() => setCurrentTab("paths")}
                    id="nav-tab-paths"
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      currentTab === "paths"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-gray-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>1. Career Choices</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab("roadmap")}
                    id="nav-tab-roadmap"
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      currentTab === "roadmap"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-gray-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>2. Monthly Roadmap</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab("chat")}
                    id="nav-tab-chat"
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      currentTab === "chat"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-gray-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span>3. Ask Elder Sibling</span>
                  </button>
                </div>

                {/* ACTIVE TAB DISPLAY WORKSPACE */}
                <div className="min-h-[500px]" id="dashboard-tab-content-container">
                  <AnimatePresence mode="wait">
                    
                    {currentTab === "paths" && (
                      <motion.div
                        key="paths"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CareerRecommendations 
                          paths={aiResult.recommendedPaths} 
                          onSelectPath={handleSelectPath}
                          selectedPathTitle={selectedPathTitle}
                        />

                        {/* Informative next action cue helper */}
                        <div className="mt-6 bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
                          <div className="space-y-1">
                            <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
                              <span>Ready to build modern digital skills?</span>
                              <Sparkles className="w-3.5 h-3.5 text-emerald-450" />
                            </h4>
                            <p className="text-xs text-slate-450">
                              Choose your focus career path, then switch to the **Monthly Roadmap** step-by-step checker!
                            </p>
                          </div>
                          <button
                            onClick={() => setCurrentTab("roadmap")}
                            id="navigate-roadmap-shortcut-btn"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Go to Roadmaps</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentTab === "roadmap" && (
                      <motion.div
                        key="roadmap"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectedPathTitle ? (
                          <InteractiveRoadmap 
                            timelinePreference={userProfile.timelinePreference}
                            selectedPathTitle={selectedPathTitle}
                            roadmap={aiResult.roadmap}
                          />
                        ) : (
                          <div className="bg-white border border-gray-150 rounded-2xl p-8 text-center" id="select-path-cta">
                            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-base font-extrabold text-slate-900">Choose a career track first!</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto mb-4">
                              Hop over to the **Career Choices** tab first and make a selection to set up your roadmap plan.
                            </p>
                            <button
                              onClick={() => setCurrentTab("paths")}
                              id="journey-start-tab-btn"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              Browse Choices
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {currentTab === "chat" && (
                      <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CareerChatbot userProfile={userProfile} />
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Sticky footer credits */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-450 py-5 mt-16 px-4 md:px-8 text-center shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© 2026 Career Path AI. Built specifically for Nigerian Students, Graduates, and Switchers.</p>
          <p className="text-emerald-450">Focused on local realities • Power saving tips • Affordable study resources</p>
        </div>
      </footer>

    </div>
  );
}
