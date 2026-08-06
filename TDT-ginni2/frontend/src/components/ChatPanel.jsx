import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const LANGUAGES = [
  { code: "hinglish", label: "Hinglish", flag: "🇮🇳" },
  { code: "english", label: "English", flag: "🇬🇧" },
  { code: "hindi", label: "Hindi", flag: "🇮🇳" }
];

// const QUICK_ACTIONS = [
//   { id: "yesno", label: "Yes / No (direct)", icon: "❓" },
//   { id: "today", label: "Aaj ka din kaisa hoga", icon: "☀️" },
//   { id: "feelings", label: "Unki feelings", icon: "💖" },
//   { id: "actions", label: "Unke next actions", icon: "⚡" },
//   { id: "monthly", label: "Aaj ka mahina", icon: "📅" },
//   { id: "spiritual", label: "Spiritual journey", icon: "🌟" }
// ];

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3 bg-card border border-gold/20 rounded-2xl rounded-bl-sm w-fit">
    <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
);

const ChatMessage = ({ message, streamedText, isStreaming }) => {
  const isUser = message.role === "user";
  const displayText = streamedText !== undefined ? streamedText : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          max-w-[85%] px-4 py-3 rounded-2xl
          ${isUser
            ? "bg-gold/20 border border-gold/30 text-foreground rounded-br-sm"
            : "bg-card border border-gold/20 text-foreground rounded-bl-sm"
          }
        `}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔮</span>
            <span className="text-xs font-medium text-gold">Ginni</span>
          </div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {isUser ? (
            displayText
          ) : (
            <span dangerouslySetInnerHTML={{
              __html: displayText
                .replace(/\n/g, "<br/>")
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            }} />
          )}
          {isStreaming && !isUser && (
            <span className="inline-block w-2 h-4 bg-gold/60 ml-1 animate-pulse" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CardVisual = ({ card }) => {
  const suitSymbols = {
    Wands: "🔥",
    Cups: "💧",
    Swords: "🗡️",
    Pentacles: "⛏️"
  };

  const trumpImages = {
    "The Fool": "🃏", "The Magician": "🧙", "The High Priestess": "🔮",
    "The Empress": "👑", "The Emperor": "♔", "The Hierophant": "❦",
    "The Lovers": "💕", "The Chariot": "🏰", "Strength": "🦁",
    "The Hermit": "🕯️", "Wheel of Fortune": "🎡", "Justice": "⚖️",
    "The Hanged Man": "†", "Death": "💀", "Temperance": "🕊️",
    "The Devil": "😈", "The Tower": "🗼", "The Star": "⭐",
    "The Moon": "🌙", "The Sun": "☀️", "Judgement": "📯", "The World": "🌍"
  };

  const symbol = card.type === "trump"
    ? (trumpImages[card.card] || "🔮")
    : (suitSymbols[card.suit] || "🃏");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 mb-3 p-3 bg-deepSlate/50 rounded-xl border border-gold/20"
    >
      <div className="w-12 h-16 bg-card border border-gold/30 rounded-lg flex items-center justify-center text-2xl shadow-lg">
        {symbol}
      </div>
      <div>
        <h4 className="text-gold font-bold text-sm">{card.card}</h4>
        <p className="text-muted-foreground text-xs">
          {card.reversed ? "Reversed" : "Upright"}
        </p>
      </div>
    </motion.div>
  );
};

const ChatPanel = () => {
  const { state, setLanguage, addChatMessage, resetReading } = useApp();
  const { chatMessages, readingResult, language, userName, selectedQuestion, isReading } = state;
  const messagesEndRef = useRef(null);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(-1);
  const [streamedTexts, setStreamedTexts] = useState({});
  const [inputValue, setInputValue] = useState("");
  const streamIntervalRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, streamedTexts]);

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!readingResult || isReading || chatMessages.length > 0) return;

    const cardReadings = readingResult.reading || [];
    const newMessages = [];

    const greetingText = language === "hindi"
      ? `नमस्ते ${userName}! आज का आपका पूछा हुआ सवाल है: "${readingResult.questionTitle}"\n\nमैंने आपके लिए ${cardReadings.length} कार्ड निकाला है। आइए देखते हैं क्या कहता है भाग्य।`
      : language === "english"
        ? `Hello ${userName}! Your question today is: "${readingResult.questionTitle}"\n\nI have drawn ${cardReadings.length} card(s) for you. Let us see what the cards reveal.`
        : `Namaste ${userName}! Aaj ka aapka sawal hai: "${readingResult.questionTitle}"\n\nMaine aapke liye ${cardReadings.length} card nikaal rakhe hain. Aaiye dekhte hain kya keh raha hai aapka kismat.`;

    newMessages.push({ id: `msg-${Date.now()}-greeting`, role: "assistant", content: greetingText });

    cardReadings.forEach((item, idx) => {
      const cardText = language === "hindi"
        ? `${idx + 1}. ${item.card}${item.reversed ? " (उल्टा)" : " (सीधा)"}\n\n${item.interpretation}`
        : `${idx + 1}. ${item.card}${item.reversed ? " (Reversed)" : " (Upright)"}\n\n${item.interpretation}`;
      newMessages.push({ id: `msg-${Date.now()}-card-${idx}`, role: "assistant", content: cardText, cardData: item });
    });

    const closingText = language === "hindi"
      ? "आशा है ये पाठ्य आपके लिए उपयोगी रहा होगा। किसी भी समय आप यहां वापस आ सकते हैं। जय भोलेनाथ! 🙏"
      : language === "english"
        ? "I hope this reading provides the clarity you seek. You can return anytime. Blessed be! 🙏"
        : "Umeed hai yeh reading aapke liye useful rahi hogi. Aap kabhi bhi yahin wapas aa sakte ho. Jai Bholenath! 🙏";

    newMessages.push({ id: `msg-${Date.now()}-close`, role: "assistant", content: closingText });

    newMessages.forEach((msg) => addChatMessage(msg));
    setCurrentStreamIndex(0);
  }, [readingResult, isReading, addChatMessage, language, userName, chatMessages.length]);

  useEffect(() => {
    if (currentStreamIndex < 0 || currentStreamIndex >= chatMessages.length) return;

    const message = chatMessages[currentStreamIndex];
    const fullText = message.content;
    const currentStreamed = streamedTexts[message.id] || "";

    if (currentStreamed === fullText) {
      if (currentStreamIndex + 1 < chatMessages.length) {
        setCurrentStreamIndex(prev => prev + 1);
      } else {
        setCurrentStreamIndex(-1);
      }
      return;
    }

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    let index = currentStreamed.length;
    streamIntervalRef.current = setInterval(() => {
      if (index < fullText.length) {
        index += 3;
        setStreamedTexts(prev => ({
          ...prev,
          [message.id]: fullText.slice(0, Math.min(index, fullText.length))
        }));
      } else {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setStreamedTexts(prev => ({ ...prev, [message.id]: fullText }));
        if (currentStreamIndex + 1 < chatMessages.length) {
          setCurrentStreamIndex(prev => prev + 1);
        } else {
          setCurrentStreamIndex(-1);
        }
      }
    }, 12);

    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, [currentStreamIndex, chatMessages, streamedTexts]);

  const handleNewReading = useCallback(() => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    streamIntervalRef.current = null;
    setCurrentStreamIndex(-1);
    setStreamedTexts({});
    resetReading();
  }, [resetReading]);

  const handleQuickAction = useCallback((action) => {
    setInputValue(action.label);
  }, []);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    addChatMessage({
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: inputValue.trim()
    });
    setInputValue("");
  }, [inputValue, addChatMessage]);

  if (!selectedQuestion) {
    return (
      <div className="w-full lg:w-96 bg-deepSlate/80 border-l border-gold/10 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-20">💬</div>
            <h3 className="text-lg font-bold text-gold">Chat with Ginni</h3>
            <p className="text-muted-foreground text-sm">Select a question to begin your reading</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-deepSlate/80 border-l border-gold/10 flex flex-col h-full">
      <div className="shrink-0 p-4 border-b border-gold/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-xl">
                🔮
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-deepSlate" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gold">Ginni</h3>
              <p className="text-xs text-muted-foreground">Your Tarot Guide</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-card rounded-xl border border-gold/10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`
                flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${language === lang.code
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
                }
              `}
            >
              <span className="mr-1">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {readingResult && chatMessages.length === 0 && (
          <div className="flex justify-center py-8">
            <TypingIndicator />
          </div>
        )}
        {isReading && !readingResult && chatMessages.length === 0 && (
          <div className="flex justify-center py-8">
            <TypingIndicator />
          </div>
        )}

        {chatMessages.map((msg, idx) => {
          if (msg.cardData) {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-gold/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔮</span>
                    <span className="text-xs font-medium text-gold">Ginni</span>
                  </div>
                  <CardVisual card={msg.cardData} />
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    <span dangerouslySetInnerHTML={{
                      __html: (streamedTexts[msg.id] || "")
                        .replace(/\n/g, "<br/>")
                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    }} />
                    {currentStreamIndex === idx && (
                      <span className="inline-block w-2 h-4 bg-gold/60 ml-1 animate-pulse" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <ChatMessage
              key={msg.id}
              message={msg}
              streamedText={streamedTexts[msg.id]}
              isStreaming={currentStreamIndex === idx}
            />
          );
        })}

        {readingResult && !isReading && chatMessages.length > 0 && (
          <div className="text-center pt-4">
            <button
              onClick={handleNewReading}
              className="px-6 py-2.5 bg-gold text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all shadow-gold text-sm"
            >
              🔄 New Reading
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-gold/10">
        <div className="p-3 overflow-x-auto flex gap-2 no-scrollbar">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              className="shrink-0 px-3 py-1.5 bg-card border border-gold/20 rounded-full text-xs text-muted-foreground hover:text-gold hover:border-gold/40 transition-all flex items-center gap-1"
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Apna sawaal likhiye..."
              className="flex-1 px-4 py-3 bg-card border border-gold/20 rounded-xl text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/40 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="px-4 py-3 bg-gold text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all shadow-gold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Draw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
