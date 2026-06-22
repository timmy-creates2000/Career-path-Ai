export interface UserProfile {
  educationLevel: "Secondary School Student" | "Undergraduate Student" | "Fresh Graduate (NYSC Era)" | "Graduate / Career Changer";
  courseField: string;
  stateResidence: string;
  monthlyBudget: string;
  interests: string;
  futureHope: string;
  timelinePreference: "Academic" | "NYSC" | "Flexible";
}

export interface NigerianResource {
  name: string;
  type: string;
  purpose: string;
}

export interface CareerPath {
  title: string;
  averageSalary: string;
  demandLevel: string;
  remoteViability: string;
  localJobContext: string;
  requiredSkills: string[];
  nigerianResources: NigerianResource[];
  localDataSavingTips: string;
}

export interface RoadmapMonth {
  month: string;
  focusTitle: string;
  timelineCommentary: string;
  milestones: string[];
  recommendedResources: string[];
  hoursNeededPerWeek: string;
  localSurvivalTip: string;
}

export interface CareerPathAIResult {
  overallSummary: string;
  recommendedPaths: CareerPath[];
  roadmap: RoadmapMonth[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
