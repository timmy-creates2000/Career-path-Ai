import { useState, useRef, useEffect } from "react";
import { Message, UserProfile } from "../types";
import { Send, Sparkles, User, Bot, HelpCircle, CornerDownLeft, Loader2 } from "lucide-react";

interface CareerChatbotProps {
  userProfile?: UserProfile;
}

const QUICK_SUGGESTIONS = [
  "Is my course still worth pursuing in Nigeria's current economy?",
  "What digital skills list pays best in Naira or remote USD?",
  "Can I realistically get remote work from my current state?",
  "How can I join NITDA, ALX, or 3MTT cohorts to upskill for free?",
];

export default function CareerChatbot({ userProfile }: CareerChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-msg",
      role: "assistant",
      content: `Aba! Welcome to your digital control room. I'm your Senior Tech Sibling. ${
        userProfile 
          ? `I can see you are an ${userProfile.educationLevel} residing in ${userProfile.stateResidence}. No shaking! Let's get to work.` 
          : "Tell me what's on your mind."
      } Ask me anything about choosing courses, digital learning, NYSC strategies, internet bundle tricks, or how to secure your first tech role in Nigeria!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const customKey = localStorage.getItem("career-path-ai-custom-key") || "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customKey.trim().length > 0) {
        headers["x-gemini-key"] = customKey.trim();
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error("Sibling is offline. Try again shortly!");
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.reply || "Aah, sorry double-checking. Let's try again!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: `Ouch, network issue! ${err.message || "Your Tech Sibling went to check NEPA light. Send another message!"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden" id="chatbot-component">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700/60 p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
              🏢
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-800 animate-pulse"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>Your Senior Tech Sibling</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">Online • Live Nigeria Market Guide</p>
          </div>
        </div>
        
        {userProfile && (
          <div className="hidden sm:block text-right">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 bg-slate-700/60 px-2.5 py-1 rounded-md border border-slate-700">
              {userProfile.stateResidence} • ₦{userProfile.monthlyBudget.substring(0, 10)}
            </span>
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 max-w-[85%] ${
              m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-400" />}
            </div>

            <div
              className={`rounded-2xl px-4 py-3 leading-relaxed border ${
                m.role === "user"
                  ? "bg-slate-800 text-emerald-50 border-emerald-800/60 rounded-tr-none"
                  : "bg-slate-850 text-slate-200 border-slate-800 rounded-tl-none"
              }`}
            >
              {/* Splitting newlines for rich text-like displays */}
              <div className="whitespace-pre-line text-xs sm:text-sm">
                {m.content}
              </div>
              <span className="block text-[10px] text-slate-500 text-right mt-1.5 leading-none font-mono">
                {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="bg-slate-850 px-4 py-3.5 rounded-2xl rounded-tl-none border border-slate-800 text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span className="text-xs font-mono font-medium">Sibling is drafting practical tips...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick advice suggestions */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900 shrink-0">
        <div className="flex gap-2 overflow-x-auto py-1.5 no-scrollbar scroll-smooth">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              id={`chat-suggestion-${s.substring(0, 15).replace(/[^a-z0-9]/gi, "-")}`}
              onClick={() => handleSendMessage(s)}
              disabled={isLoading}
              className="text-[11px] font-medium whitespace-nowrap bg-slate-800 hover:bg-slate-700/80 text-emerald-400 border border-slate-700/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <div className="bg-slate-800 p-3 border-t border-slate-700 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question (e.g., 'What about remote designs from Lagos?')"
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            id="send-chat-btn"
            disabled={!input.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl p-2.5 sm:px-4 sm:py-2.5 flex items-center gap-1.5 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500 font-mono">
          <span>Powered by Gemini 3.5 Flash</span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>Honest advice, no sugarcoating</span>
          </span>
        </div>
      </div>
    </div>
  );
}
