import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { generateReading, FALLBACK_TEXT } from "../utils/generateReading";

const TRUMP_SYMBOLS = {
  "The Fool": "🃏", "The Magician": "🧙", "The High Priestess": "🔮",
  "The Empress": "👑", "The Emperor": "♔", "The Hierophant": "❦",
  "The Lovers": "💕", "The Chariot": "🏰", "Strength": "🦁",
  "The Hermit": "🕯️", "Wheel of Fortune": "🎡", "Justice": "⚖️",
  "The Hanged Man": "†", "Death": "💀", "Temperance": "🕊️",
  "The Devil": "😈", "The Tower": "🗼", "The Star": "⭐",
  "The Moon": "🌙", "The Sun": "☀️", "Judgement": "📯", "The World": "🌍"
};

const SUIT_SYMBOLS = {
  Wands: "🔥", Cups: "💧", Swords: "🗡️", Pentacles: "⛏️"
};

const QUICK_ACTIONS = [
  { id: "yesno", label: "Yes / No (direct)", icon: "❓" },
  { id: "today", label: "Aaj ka din kaisa hoga", icon: "☀️" },
  { id: "feelings", label: "Unki current feelings", icon: "💖" },
  { id: "actions", label: "Unke next actions", icon: "⚡" },
  { id: "monthly", label: "Aaj ka mahina", icon: "📅" },
  { id: "spiritual", label: "Spiritual journey", icon: "🌟" }
];

const QUICK_ACTION_QUESTION_MAP = {
  yesno: 5,
  today: 7,
  feelings: 1,
  actions: 2,
  monthly: 9,
  spiritual: 8
};

const ChatCard = ({ card, index }) => {
  const symbol = card.type === "trump"
    ? (TRUMP_SYMBOLS[card.name] || "🔮")
    : (SUIT_SYMBOLS[card.suit] || "🃏");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-16 h-24 sm:w-20 sm:h-28 bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gold/35 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent" />
        <span className="text-2xl sm:text-3xl opacity-80 drop-shadow-[0_0_6px_rgba(218,165,32,0.4)]">
          {symbol}
        </span>
      </div>
      <div className="mt-1.5 text-center px-1">
        <h4 className="text-[10px] sm:text-xs font-bold text-gold leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          {card.name}
        </h4>
        <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
          {card.reversed ? "Reversed" : "Upright"}
        </p>
      </div>
    </motion.div>
  );
};

const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800/80 border border-gold/20 rounded-2xl rounded-bl-sm w-fit">
    <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
);

function ReadingOutputChat({
  userName = "User",
  selectedLanguage = "hinglish",
  chatHistory = [],
  readingResult = null,
  isReading = false,
  onStartNewQuestion
}) {
  const [localInput, setLocalInput] = useState("");
  const messagesEndRef = useRef(null);
  const streamRefs = useRef({});

  const formatText = (text) => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  };

  function resolveQuestionNumber(entry) {
    if (entry.questionNumber) return entry.questionNumber;
    if (entry.quickActionId && QUICK_ACTION_QUESTION_MAP[entry.quickActionId]) {
      return QUICK_ACTION_QUESTION_MAP[entry.quickActionId];
    }
    const q = (entry.question || "").toLowerCase();
    if (q.includes("yes") || q.includes("no") || q.includes("direct")) return 5;
    if (q.includes("din") || q.includes("today")) return 7;
    if (q.includes("feeling")) return 1;
    if (q.includes("action")) return 2;
    if (q.includes("mahina") || q.includes("month")) return 9;
    if (q.includes("spiritual") || q.includes("journey")) return 8;
    return 5;
  }

  function formatReadingResults(results, questionNumber) {
    if (!results || !Array.isArray(results) || results.length === 0) {
      return FALLBACK_TEXT;
    }

    if (questionNumber === 10) {
      return results
        .map((r) => r.reading)
        .filter((r) => r)
        .join("\n\n");
    }

    return results
      .map((r) => {
        const orientationLabel = r.orientation === "reversed" ? " (Reversed)" : " (Upright)";
        const title = `${r.cardName || "Card"} - ${orientationLabel}`;
        return `${title}\n\n${r.reading || FALLBACK_TEXT}`;
      })
      .join("\n\n---\n\n");
  }

  const generateBotReading = useCallback(async (entry) => {
    const questionNumber = resolveQuestionNumber(entry);
    const language = entry.language || selectedLanguage;

    try {
      const results = await generateReading(questionNumber, entry.cards, language);
      return formatReadingResults(results, questionNumber);
    } catch (error) {
      console.error("[generateBotReading] Failed to generate reading:", error);
      return FALLBACK_TEXT;
    }
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory.length, readingResult, isReading]);

  useEffect(() => {
    const lastEntry = chatHistory[chatHistory.length - 1];
    if (!lastEntry || lastEntry.reading) return;

    const timer = setTimeout(() => {
      generateBotReading(lastEntry)
        .then((reading) => {
          lastEntry.reading = reading;
          lastEntry.isReading = false;
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        })
        .catch((error) => {
          console.error("[ReadingOutputChat] Reading generation failed:", error);
          lastEntry.reading = FALLBACK_TEXT;
          lastEntry.isReading = false;
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    }, 1000);

    return () => clearTimeout(timer);
  }, [chatHistory.length, generateBotReading]);

  const handleQuickAction = useCallback((action) => {
    const questionNumber = QUICK_ACTION_QUESTION_MAP[action.id];
    if (onStartNewQuestion) {
      onStartNewQuestion({ label: action.label, questionNumber });
    }
    setLocalInput("");
  }, [onStartNewQuestion]);

  const handleSend = useCallback(() => {
    if (!localInput.trim()) return;
    if (onStartNewQuestion) {
      onStartNewQuestion(localInput.trim());
    }
    setLocalInput("");
  }, [localInput, onStartNewQuestion]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="flex flex-col h-full bg-deepSlate/90">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {chatHistory.length === 0 && !readingResult && (
          <div className="flex justify-center py-8">
            <div className="text-center space-y-3">
              <div className="text-4xl opacity-30">🔮</div>
              <p className="text-sm text-muted-foreground">Select cards to begin your reading</p>
            </div>
          </div>
        )}

        {chatHistory.map((entry, idx) => (
          <motion.div
            key={entry.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex justify-end">
              <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-sm bg-gold/20 border border-gold/30 text-foreground">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gold">{userName}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">{entry.question}</p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[90%] px-4 py-4 rounded-2xl rounded-bl-sm bg-slate-800/90 border border-gold/20 shadow-[0_0_20px_rgba(218,165,32,0.08)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🔮</span>
                  <span className="text-xs font-semibold text-gold uppercase tracking-wide">Ginni</span>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Cards drawn for you
                  </p>
                  <div className={`grid gap-2 ${entry.cards.length > 6 ? "grid-cols-4 sm:grid-cols-6" : entry.cards.length > 3 ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
                    {entry.cards.map((card, cIdx) => (
                      <ChatCard key={card.id || cIdx} card={card} index={cIdx} />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-4" />

                <div className="text-sm leading-relaxed whitespace-pre-line text-slate-200">
                  {entry.isReading ? (
                    <TypingDots />
                  ) : entry.reading ? (
                    <span dangerouslySetInnerHTML={{ __html: formatText(entry.reading) }} />
                  ) : (
                    <TypingDots />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {readingResult && isReading && chatHistory.length > 0 && (
          <div className="flex justify-start">
            <TypingDots />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-gold/10 bg-deepSlate/60 backdrop-blur-xl">
        <div className="p-3 overflow-x-auto flex gap-2 no-scrollbar">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              className="shrink-0 px-3 py-1.5 bg-slate-800 border border-gold/20 rounded-full text-xs text-muted-foreground hover:text-gold hover:border-gold/40 hover:shadow-[0_0_12px_rgba(218,165,32,0.15)] transition-all flex items-center gap-1.5"
            >
              <span>{action.icon}</span>
              <span className="whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="p-3 pt-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Apna sawaal likhiye..."
              className="flex-1 px-4 py-3 bg-slate-800 border border-gold/20 rounded-xl text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/40 focus:shadow-[0_0_12px_rgba(218,165,32,0.1)] transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!localInput.trim()}
              className="px-5 py-3 bg-gradient-to-r from-gold to-amber-500 text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all shadow-gold disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Draw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadingOutputChat;
