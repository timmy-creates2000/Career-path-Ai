import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";
import { Sparkles, ArrowRight, ArrowLeft, GraduationCap, MapPin, Wallet, BookOpen, MessageSquare, Compass, CalendarRange } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Rivers (Port Harcourt)", "Oyo (Ibadan)", "Enugu", 
  "Kaduna", "Ogun", "Anambra", "Edo", "Kano", "Plateau (Jos)", "Kwara", "Delta"
];

const SUGGESTED_COURSES = [
  "Computer Science", "Biochemistry", "Microbiology", "Electrical Engineering", 
  "Mass Communication", "Accounting", "Economics", "None - Just looking for skills"
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [educationLevel, setEducationLevel] = useState<UserProfile["educationLevel"] | "">("");
  const [courseField, setCourseField] = useState("");
  const [stateResidence, setStateResidence] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [interests, setInterests] = useState("");
  const [futureHope, setFutureHope] = useState("");
  const [timelinePreference, setTimelinePreference] = useState<UserProfile["timelinePreference"] | "">("");

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      onComplete({
        educationLevel: educationLevel as UserProfile["educationLevel"],
        courseField,
        stateResidence,
        monthlyBudget,
        interests,
        futureHope,
        timelinePreference: timelinePreference as UserProfile["timelinePreference"],
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return educationLevel !== "";
      case 2: return courseField.trim().length > 0;
      case 3: return stateResidence.trim().length > 0;
      case 4: return monthlyBudget !== "";
      case 5: return interests.trim().length >= 10; // Encouraging detail
      case 6: return futureHope.trim().length > 0;
      case 7: return timelinePreference !== "";
      default: return false;
    }
  };

  const progressPercentage = (step / 7) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto" id="onboarding-container">
      {/* Upper header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 border border-emerald-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Career Architect for Nigeria</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Let's map out your path</h1>
        <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
          No generic Western paths. Tell me about your situation, and I will help you build a job-ready tech career right here in Nigeria.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-100 h-2.5 rounded-full mb-8 overflow-hidden relative">
        <motion.div 
          className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
          layoutId="progress-bar-fill"
        />
        <div className="absolute right-3 top-0 h-full flex items-center">
          <span className="text-[10px] font-mono font-medium text-gray-500 bg-white/90 px-1.5 rounded-sm">Step {step}/7</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col justify-center"
          >
            {/* STEP 1: EDUCATION LEVEL */}
            {step === 1 && (
              <div id="step-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Where are you currently at in your journey?</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">This helps me align terms and targets perfectly for your current state.</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { val: "Secondary School Student", desc: "Choosing a future course / figuring out options before exam entries" },
                    { val: "Undergraduate Student", desc: "Currently in university / polytechnic, want to prepare for job readiness" },
                    { val: "Fresh Graduate (NYSC Era)", desc: "Finished school, on NYSC or about to serve. Need job skills ASAP" },
                    { val: "Graduate / Career Changer", desc: "Already working or graduated time ago, looking to pivot into digital roles" }
                  ].map((item) => (
                    <button
                      key={item.val}
                      id={`edu-level-${item.val.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      onClick={() => setEducationLevel(item.val as UserProfile["educationLevel"])}
                      className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col ${
                        educationLevel === item.val 
                          ? "border-emerald-500 bg-emerald-50/50 text-gray-900" 
                          : "border-gray-100 bg-white hover:border-gray-200 text-gray-600"
                      }`}
                    >
                      <span className="font-semibold text-sm text-gray-900">{item.val}</span>
                      <span className="text-xs text-gray-500 mt-1">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: COURSE OF STUDY */}
            {step === 2 && (
              <div id="step-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">What is your course of study or area of interest?</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">Are you studying Biochemistry, Art, Computer Science? Or none? Be open, standard tech values multi-disciplines!</p>
                
                <input
                  type="text"
                  id="course-input"
                  value={courseField}
                  onChange={(e) => setCourseField(e.target.value)}
                  placeholder="e.g. Biochemistry, Mass Communication, Computer Science"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 placeholder-gray-400 font-medium"
                  autoFocus
                />

                <div className="mt-4">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_COURSES.map((course) => (
                      <button
                        key={course}
                        id={`suggested-course-${course.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        onClick={() => setCourseField(course)}
                        type="button"
                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-600 rounded-lg transition-colors border border-gray-200/50"
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: STATE RESIDENCE */}
            {step === 3 && (
              <div id="step-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Which state in Nigeria do you live in?</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">Lagos has active physical nodes, Enugu is tech-vibrant, other towns rely more on remote setups. This defines physical and virtual opportunity mappings.</p>
                
                <input
                  type="text"
                  id="state-input"
                  value={stateResidence}
                  onChange={(e) => setStateResidence(e.target.value)}
                  placeholder="e.g. Lagos, Abuja, Enugu, Kaduna"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 placeholder-gray-400 font-medium"
                  autoFocus
                />

                <div className="mt-4">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Popular hubs / cities:</p>
                  <div className="flex flex-wrap gap-2">
                    {NIGERIAN_STATES.map((st) => (
                      <button
                        key={st}
                        id={`state-btn-${st.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        onClick={() => setStateResidence(st)}
                        type="button"
                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-600 rounded-lg transition-colors border border-gray-200/50"
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: MONTHLY LEARNING BUDGET */}
            {step === 4 && (
              <div id="step-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">What is your monthly learning & data budget?</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">Let's be real—broadband / internet data in Nigeria is not cheap! I will structure programs, PDF materials, and low-res free YouTube pathways accordingly.</p>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { val: "0 (Purely Free / Zero Money)", desc: "I want only free resources that I can load via WiFi, school, or highly optimized offline modes" },
                    { val: "1,000 - 5,000 Naira / Month", desc: "Enough for standard nightly data bundles to download tutorials" },
                    { val: "5,000 - 15,000 Naira / Month", desc: "Can purchase affordable bundles & access paid local communities" },
                    { val: "15,000+ Naira / Month", desc: "Able to pay for structured Udemy/Coursera pathways, premium data and mentorship" }
                  ].map((level) => (
                    <button
                      key={level.val}
                      id={`budget-${level.val.substring(0, 5).replace(/[^a-z0-9]/gi, "-")}`}
                      onClick={() => setMonthlyBudget(level.val)}
                      className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col ${
                        monthlyBudget === level.val 
                          ? "border-emerald-500 bg-emerald-50/50 text-gray-900" 
                          : "border-gray-100 bg-white hover:border-gray-200 text-gray-600"
                      }`}
                    >
                      <span className="font-semibold text-sm text-gray-900">₦{level.val}</span>
                      <span className="text-xs text-gray-500 mt-1">{level.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: INTERESTS AND TALENTS */}
            {step === 5 && (
              <div id="step-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">What are your genuine interests/strengths?</h2>
                </div>
                <p className="text-gray-500 text-sm mb-4">Tell me who you truly are (e.g. 'I enjoy beautifully putting objects together, writing stories, playing logic puzzles, or trading/marketing goods online'). Let's build on things you already love.</p>
                
                <textarea
                  id="interests-textarea"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Describe your interests in at least 10 letters... (e.g., 'I actually enjoy drawing, playing with mobile screen layouts, and writing essays. I don't really like heavy math.')"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 placeholder-gray-400 font-medium text-sm"
                  autoFocus
                />
                
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-xs ${interests.trim().length >= 10 ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {interests.trim().length}/10 minimum characters required
                  </span>
                </div>
              </div>
            )}

            {/* STEP 6: FUTURE HOPES */}
            {step === 6 && (
              <div id="step-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">What kind of future do you hope to build?</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">What is your practical, honest dream? We won't judge! Your honesty makes your customized roadmap genuinely work.</p>
                
                <input
                  type="text"
                  id="future-hope-input"
                  value={futureHope}
                  onChange={(e) => setFutureHope(e.target.value)}
                  placeholder="e.g. To secure a remote tech job to support my family, or launch a tech business in Lagos..."
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 placeholder-gray-400 font-medium text-sm"
                  autoFocus
                />

                <div className="mt-4 bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex gap-2.5 items-start">
                  <span className="text-emerald-500 text-base">💡</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Some hope to secure currency hedging (earning USD), while others want solid local operations. Your choice adjusts local VS global tech skillset targeting.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 7: TIMELINE CONTEXT */}
            {step === 7 && (
              <div id="step-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                    <CalendarRange className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Finally, how do we structure your learning timeline?</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6">I will design study workloads to mesh smoothly with your actual local schedules, avoiding burnout.</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { key: "Academic", title: "Academic Calendar Sync", desc: "Aligned with university semesters, exams, and allocates flexible buffers for strike periods." },
                    { key: "NYSC", title: "NYSC Timeline Sync", desc: "Prepped for camp (3 weeks off but phone learning), PPA settling, and passing out parade triggers." },
                    { key: "Flexible", title: "Flexible Weekend / Pivot Tracker", desc: "Perfect for secondary scholars, workers, and career-changers needing consistent part-time hours." }
                  ].map((timeline) => (
                    <button
                      key={timeline.key}
                      id={`timeline-${timeline.key.toLowerCase()}`}
                      onClick={() => setTimelinePreference(timeline.key as UserProfile["timelinePreference"])}
                      className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col ${
                        timelinePreference === timeline.key 
                          ? "border-emerald-500 bg-emerald-50/50 text-gray-900" 
                          : "border-gray-100 bg-white hover:border-gray-200 text-gray-600"
                      }`}
                    >
                      <span className="font-semibold text-sm text-gray-900">{timeline.title}</span>
                      <span className="text-xs text-gray-500 mt-1">{timeline.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Buttons bottom alignment */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            id="back-btn"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-gray-50 text-gray-600 cursor-pointer"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            id="next-btn"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
              canProceed() 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.98]" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>{step === 7 ? "Generate My Roadmap!" : "Next"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
