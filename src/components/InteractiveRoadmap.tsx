import { useState, useEffect } from "react";
import { RoadmapMonth } from "../types";
import { CheckSquare, Square, ThumbsUp, Calendar, Zap, Award, Flame, RefreshCcw, BookOpen, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InteractiveRoadmapProps {
  timelinePreference: string;
  selectedPathTitle: string;
  roadmap: RoadmapMonth[];
}

export default function InteractiveRoadmap({ timelinePreference, selectedPathTitle, roadmap }: InteractiveRoadmapProps) {
  // Store ticked milestones in local state and synchronize with localStorage
  const [checkedMilestones, setCheckedMilestones] = useState<Record<string, boolean>>({});
  const [activeMonthIdx, setActiveMonthIdx] = useState(0);

  // Initialize checks from localStorage based on path title
  useEffect(() => {
    const storageKey = `career-path-ai-milestones-${selectedPathTitle}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setCheckedMilestones(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setCheckedMilestones({});
    }
  }, [selectedPathTitle]);

  const toggleMilestone = (monthLabel: string, milestoneText: string) => {
    const key = `${monthLabel}::${milestoneText}`;
    const updated = {
      ...checkedMilestones,
      [key]: !checkedMilestones[key]
    };
    setCheckedMilestones(updated);
    
    // Save to localStorage
    const storageKey = `career-path-ai-milestones-${selectedPathTitle}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Compute total milestones and completed count
  let totalMilestonesCount = 0;
  let completedMilestonesCount = 0;

  roadmap.forEach((stage) => {
    stage.milestones.forEach((m) => {
      totalMilestonesCount++;
      const key = `${stage.month}::${m}`;
      if (checkedMilestones[key]) {
        completedMilestonesCount++;
      }
    });
  });

  const progressPercent = totalMilestonesCount > 0 
    ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100) 
    : 0;

  const currentStage = roadmap[activeMonthIdx] || roadmap[0];

  return (
    <div className="bg-slate-50 rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 space-y-6" id="interactive-roadmap-component">
      
      {/* Title with stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            {timelinePreference} Program Target
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">Your Custom Skills Roadmap</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Focus: <strong className="text-indigo-600">{selectedPathTitle}</strong>
          </p>
        </div>

        {/* Progress Circle & Status */}
        <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-xl border border-gray-150 shadow-xs">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            {/* SVG circle gauge */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-500"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-xs font-black text-slate-800 font-mono">{progressPercent}%</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Milestone Progress</span>
            <span className="text-xs font-bold text-slate-700">
              {completedMilestonesCount} of {totalMilestonesCount} Done
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left Column Month Toggles, Right Column Month Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Step Toggles Left Pane */}
        <div className="lg:col-span-1 space-y-2">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Months Timeline</p>
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scroll-smooth" id="roadmap-month-tabs">
            {roadmap.map((stage, i) => {
              // Calculate checked count in this stage
              let doneInStage = 0;
              stage.milestones.forEach((m) => {
                if (checkedMilestones[`${stage.month}::${m}`]) doneInStage++;
              });
              const allDone = doneInStage === stage.milestones.length && stage.milestones.length > 0;

              return (
                <button
                  key={stage.month}
                  id={`roadmap-month-tab-${i}`}
                  onClick={() => setActiveMonthIdx(i)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between shrink-0 cursor-pointer ${
                    activeMonthIdx === i
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 border-gray-150 hover:border-gray-300"
                  }`}
                  style={{ minWidth: "155px" }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black tracking-tight">{stage.month}</span>
                    {allDone && (
                      <span className="text-[9px] bg-emerald-500 text-white font-mono px-1 rounded uppercase font-bold">
                        Passed
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] truncate mt-1 block ${activeMonthIdx === i ? "text-slate-300" : "text-gray-500"}`}>
                    {stage.focusTitle}
                  </span>
                  
                  {/* Small progress meter on the button */}
                  <div className="w-full bg-gray-200/50 h-1 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300" 
                      style={{ width: `${stage.milestones.length > 0 ? (doneInStage / stage.milestones.length) * 100 : 0}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Month Detail Card Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.month}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 space-y-6"
              id="roadmap-month-detail-pane"
            >
              
              {/* Card Title & Timeline context commentary */}
              <div className="space-y-1 pb-4 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">{currentStage.month}: {currentStage.focusTitle}</h3>
                  <div className="inline-flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{currentStage.hoursNeededPerWeek} / week</span>
                  </div>
                </div>

                {/* Calendar Commentary */}
                {currentStage.timelineCommentary && (
                  <div className="flex gap-2.5 items-start bg-indigo-50/50 border border-indigo-100/40 p-3 rounded-lg text-xs mt-2 text-indigo-900 leading-relaxed font-sans">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-bold underline decoration-indigo-300 mr-1">Calender Strategy:</strong>
                      {currentStage.timelineCommentary}
                    </span>
                  </div>
                )}
              </div>

              {/* Milestones Checklists */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Milestones to Complete</h4>
                
                <div className="grid grid-cols-1 gap-2">
                  {currentStage.milestones.map((milestone, idx) => {
                    const isChecked = !!checkedMilestones[`${currentStage.month}::${milestone}`];
                    return (
                      <button
                        key={idx}
                        id={`milestone-checkbox-${idx}`}
                        onClick={() => toggleMilestone(currentStage.month, milestone)}
                        className={`text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                          isChecked
                            ? "bg-slate-50 text-slate-500 border-gray-200 line-through"
                            : "bg-white text-slate-800 border-gray-150 hover:border-gray-200"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-medium leading-normal">{milestone}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resources Aligned */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Specific YouTube / certifying modules */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Targeted Resources</h5>
                  <div className="space-y-1.5" id="roadmap-resources-list">
                    {currentStage.recommendedResources.map((src, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-150 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{src}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Survival Advice */}
                <div className="bg-amber-50/55 border border-amber-100 rounded-xl p-4 flex gap-3 items-start h-full">
                  <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h6 className="text-[11px] font-black text-amber-900 uppercase">Load Shedding & Grid Survival Tips</h6>
                    <p className="text-[11px] text-amber-800 leading-normal">{currentStage.localSurvivalTip}</p>
                  </div>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
