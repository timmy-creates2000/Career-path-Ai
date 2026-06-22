import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client with telemetric header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint to generate Nigerian local career pathway and roadmap
app.post("/api/generate-career-path", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      educationLevel,
      courseField,
      stateResidence,
      monthlyBudget,
      interests,
      futureHope,
      timelinePreference,
    } = req.body;

    if (!educationLevel || !interests) {
      res.status(400).json({ error: "Education level and interests are required." });
      return;
    }

    // Build immediate context for the LLM
    const userPrompt = `
      User Profile:
      - Current Stage/Education Level: ${educationLevel}
      - Course of Study / Field: ${courseField || "Not specified or none"}
      - State of Residence in Nigeria: ${stateResidence || "Not specified"}
      - Monthly study budget (Naira): ₦${monthlyBudget || "No specific budget limit"}
      - Actual Interests and Talents: ${interests}
      - Ideal Career Hope / Dream: ${futureHope || "To build a great career"}
      - Preferred Timeline Context: ${timelinePreference || "Academic Calendar"}

      Generate 3 highly realistic, distinct digital skill or modern career paths in Nigeria that match their talent, state constraints (e.g. Lagos vs other states, power costs, tech hub presence), and learning budget.
      Also build a tailored 6-month roadmap aligned specifically to their preferred timeline (${timelinePreference === "NYSC" ? "NYSC calendar (3 weeks Orientation Camp, 11 months Place of Primary Assignment PPA, Community Development Service CDS)" : timelinePreference === "Academic" ? "Academic calendar (Semester 1 lectures, Exams, Break/ASUU strike buffers, Semester 2 lectures)" : "Work-compatible calendar (flexible weekends & evenings)"}).
      Ensure other local realities of Nigeria are integrated such as:
      - Actual power challenges / generator / self-saving files
      - Local internet bundle saving tricks (e.g., MTN/Airtel midnight data bundles 11PM-6AM, night plans)
      - Free/Affordable resources accessible in Nigeria (e.g., Youtube, ALX Africa, 3MTT, Google Digital Skills, freeCodeCamp, Coursera with financial aid)
      - Naira monthly salary ranges matching Nigerian junior roles (e.g., ₦120,000 - ₦300,000)
    `;

    const systemInstruction = 
      "You are a friendly, highly knowledgeable Nigerian older sibling ('Senior Tech Bro/Sis') who is a mentor. " +
      "You speak in standard, clear, warm English occasionally flavored with light, friendly Nigerian slangs or standard collocations (like 'Senior Bro', 'no-gree-for-failure', 'you've got this', 'NEPA light', etc.) without being overly unprofessional. " +
      "Your goal is to give direct, brutally honest, but deeply encouraging advice. You understand the local terrain, actual rates of pay, power issues, data charges, and local initiatives (like Federal Government's 3MTT, ALX Africa, NITDA programs, and free YouTube content). " +
      "You MUST respond ONLY with a JSON object fitting the provided schema.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        overallSummary: {
          type: Type.STRING,
          description: "Friendly, encouraging welcome message from you as their loving older sibling mentor, summarizing their potential and validating their situation."
        },
        recommendedPaths: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Official name of the modern digital career path (e.g., Frontend Web Developer, UX Writer, Digital Marketer)." },
              averageSalary: { type: Type.STRING, description: "Monthly junior salary range in Nigerian Naira (e.g., ₦150k - ₦280k/month)." },
              demandLevel: { type: Type.STRING, description: "Current demand level in key Nigerian cities (Lagos, Abuja, remote etc.)" },
              remoteViability: { type: Type.STRING, description: "Remote capability score and local internet/electricity notes for this specific role." },
              localJobContext: { type: Type.STRING, description: "Where these roles are found (e.g. Lagos fintechs, freelancing, outsourcing hubs)." },
              requiredSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              nigerianResources: {
                type: Type.ARRAY,
                items: { 
                  type: Type.OBJECT, 
                  properties: {
                    name: { type: Type.STRING, description: "e.g., Dave Gray HTML/CSS Course, ALX Africa, 3MTT cohort, freeCodeCamp" },
                    type: { type: Type.STRING, description: "e.g., YouTube Channel, Free Government Program, Certification" },
                    purpose: { type: Type.STRING, description: "What they will learn from this specific resource." }
                  },
                  required: ["name", "type", "purpose"]
                }
              },
              localDataSavingTips: { type: Type.STRING, description: "Specific nigerian-focused trick for this path (e.g., 'MTN Night Plan of ₦25/250MB' or offline reading)." }
            },
            required: ["title", "averageSalary", "demandLevel", "remoteViability", "localJobContext", "requiredSkills", "nigerianResources", "localDataSavingTips"]
          }
        },
        roadmap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              month: { type: Type.STRING, description: "Month label (e.g., Month 1, Month 2, etc.)" },
              focusTitle: { type: Type.STRING, description: "Core thematic focus of this month." },
              timelineCommentary: { type: Type.STRING, description: "How this aligns with their calendar (e.g., how to handle this during NYSC orientation camp, exams, or day job)." },
              milestones: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendedResources: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              hoursNeededPerWeek: { type: Type.STRING, description: "Realistic hours to commit per week (e.g., 10-15 hours)." },
              localSurvivalTip: { type: Type.STRING, description: "Local survival tip (e.g., 'Set up auto-save on VS Code', 'Charge laptop fully at library during lectures')." }
            },
            required: ["month", "focusTitle", "timelineCommentary", "milestones", "recommendedResources", "hoursNeededPerWeek", "localSurvivalTip"]
          }
        }
      },
      required: ["overallSummary", "recommendedPaths", "roadmap"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const resultText = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/generate-career-path:", error);
    res.status(500).json({ error: error.message || "Failed to generate pathway." });
  }
});

// Endpoint to chat with the Elder Sibling Tech Mentor
app.post("/api/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, userProfile } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required." });
      return;
    }

    // Capture user profile context for the conversation if available
    let systemInstruction = 
      "You are a friendly, deeply supportive, and street-smart Nigerian tech brother or sister ('Senior Tech Bro/Sis'). " +
      "You acts as a mentor for career pathways and digital skills in Nigeria. " +
      "You give honest, practical advice grounded in local Nigerian realities (high data cost, unreliable power, ASUU strikes, NYSC schedules, low-spec computers, Naira-based payments, and 3MTT / ALX initiatives). " +
      "Speak directly, with empathy, and encourage the user like family. Use relatable English styled with standard tech brother warmth, " +
      "and light friendly local colloquialisms (e.g., 'no shaking', 'NEPA strike', 'MTN midnight plan', 'Abeg', 'you self see', 'God speed'). " +
      "Avoid dry corporate speech. Keep your responses organized with simple and short bullet points when listing ideas, and never sound academic." +
      "Do NOT talk about Western assumptions like unlimited internet or expensive gadgets unless they can afford it based on their profile.";

    if (userProfile) {
      systemInstruction += `\n\nUser Profile Context:
      - Stage: ${userProfile.educationLevel}
      - Course/Field: ${userProfile.courseField || "None"}
      - State: ${userProfile.stateResidence || "Unknown"}
      - Budget: ₦${userProfile.monthlyBudget || "Limited"}
      - Interests: ${userProfile.interests || "Tech"}
      - Selected Timeline: ${userProfile.timelinePreference || "Academic Calendar"}`;
    }

    // Format chat contents for GenAI Chat API
    // We can select the last few messages or use a clear list of turns
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const text = response.text || "I'm listening, tell me more about what's on your mind!";
    res.json({ reply: text });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Failed to chat." });
  }
});

// Serve frontend assets and listen
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
