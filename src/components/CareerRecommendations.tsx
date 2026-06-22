import { useState } from "react";
import { CareerPath } from "../types";
import { Award, Briefcase, DollarSign, Globe, Star, ShieldAlert, Wifi, HardDriveDownload, BookOpen, ExternalLink, BatteryCharging } from "lucide-react";
import { motion } from "motion/react";

interface CareerRecommendationsProps {
  paths: CareerPath[];
  onSelectPath?: (pathTitle: string) => void;
  selectedPathTitle?: string;
}

export default function CareerRecommendations({ paths, onSelectPath, selectedPathTitle }: CareerRecommendationsProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!paths || paths.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800" id="no-paths-alert">
        <p className="font-semibold">No career path recommendations available yet.</p>
        <p className="text-sm mt-1">Please complete your Profile conversational setup or speak with the sibling chatbot to generate paths!</p>
      </div>
    );
  }

  const currentPath = paths[activeTab] || paths[0];

  return (
    <div className="space-y-6" id="career-recommendations-component">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <span>Recommended Career Pathways</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Grounded entirely in Nigeria's local economy, actual entry salaries, and internet budget levels.
          </p>
        </div>

        {/* Path Selection Tabs */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl overflow-x-auto" id="path-tabs">
          {paths.map((p, idx) => (
            <button
              key={p.title}
              id={`path-tab-${idx}`}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === idx 
                  ? "bg-white text-emerald-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Path Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            key={currentPath.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
          >
            {/* Inner Heading & Badge stats */}
            <div className="flex flex-wrap justify-between items-start gap-4 pb-5 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Highly Targeted
                </span>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">{currentPath.title}</h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{currentPath.localJobContext}</p>
              </div>

              {onSelectPath && (
                <button
                  onClick={() => onSelectPath(currentPath.title)}
                  id={`select-roadmap-btn-${currentPath.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedPathTitle === currentPath.title
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${selectedPathTitle === currentPath.title ? "fill-emerald-600" : ""}`} />
                  <span>{selectedPathTitle === currentPath.title ? "Selected Path for Roadmap" : "Focus on this Path"}</span>
                </button>
              )}
            </div>

            {/* Local Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Average Junior Salary</span>
                <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-sm sm:text-base">
                  <DollarSign className="w-4 h-4" />
                  <span>{currentPath.averageSalary}</span>
                </div>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-150 pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Nigerian Job Demand</span>
                <div className="text-gray-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{currentPath.demandLevel}</span>
                </div>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-150 pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Remote Support</span>
                <div className="text-gray-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>{currentPath.remoteViability}</span>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Required Skills Needed</h4>
              <div className="flex flex-wrap gap-2">
                {currentPath.requiredSkills.map((sk) => (
                  <span 
                    key={sk} 
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs"
                    id={`skill-badge-${sk.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Nigeria Specific Internet Survivals */}
            <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-100/50 text-emerald-700 rounded-lg shrink-0">
                <Wifi className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-emerald-900 uppercase">Local Data Saving Shortcut</h5>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">{currentPath.localDataSavingTips}</p>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Free Accessible Local Resources */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">Free Learning Centers</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                No need for expensive dollar subscriptions! Start off with these free, highly recognized avenues:
              </p>

              <div className="space-y-3.5" id="resource-cards-list">
                {currentPath.nigerianResources.map((resItem, i) => (
                  <div 
                    key={i} 
                    className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1 transition-all hover:border-slate-300"
                    id={`resource-card-${i}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase font-mono">
                        {resItem.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">Local-Friendly</span>
                    </div>
                    <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-1">{resItem.name}</h5>
                    <p className="text-[11px] text-gray-600 leading-snug">{resItem.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Power backup warning */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 flex gap-2.5 items-start mt-4">
              <BatteryCharging className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h5 className="text-[10px] font-extrabold text-orange-850 uppercase tracking-wide">Power Preservation</h5>
                <p className="text-[10px] text-orange-700 leading-relaxed">
                  Avoid loss of code due to grid load-shedding! Use local computer labs, library plugs, or activate cloud-saves.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
