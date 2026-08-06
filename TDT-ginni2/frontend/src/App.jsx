import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "./context/AppContext";
import Onboarding from "./components/Onboarding";
import QuestionSidebar from "./components/QuestionSidebar";
import CardSpread from "./components/CardSpread";
import ReadingOutputChat from "./components/ReadingOutputChat";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchReadingFromKB } from "./utils/kbRouter";
import { Menu, MessageSquare } from "lucide-react";

function App() {
  const { state, setReadingResult, setDrawnCards, setReading, setCurrentQuestion, setAppStatus, addChatHistoryEntry, addChatMessage } = useApp();
  const { hasOnboarded, selectedQuestion, readingResult, isReading, language, currentAppStatus, currentQuestion, chatHistory, drawnCards } = state;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isReading || readingResult) return;

    const fetchReading = async () => {
      if (!selectedQuestion) return;
      try {
        const result = await fetchReadingFromKB(selectedQuestion.number, drawnCards, language);
        setReadingResult(result);
      } catch (err) {
        console.error("Failed to fetch reading:", err);
        setReadingResult({
          questionTitle: selectedQuestion.title,
          topicKey: selectedQuestion.topicKey,
          totalCards: selectedQuestion.cardCount,
          reading: []
        });
      }
    };

    const timer = setTimeout(fetchReading, 800);
    return () => clearTimeout(timer);
  }, [isReading, readingResult, selectedQuestion, language, drawnCards, setReadingResult]);

  const handleStartNewQuestion = useCallback((question) => {
    if (typeof question === "object" && question !== null) {
      setCurrentQuestion(question.label);
      setCurrentQuestionNumber(question.questionNumber || null);
    } else {
      setCurrentQuestion(question);
      setCurrentQuestionNumber(null);
    }
    setAppStatus("connecting");
    setIsConnecting(true);
    setDrawnCards([]);
    setReadingResult(null);

    const welcomeMsg = {
      id: Date.now(),
      type: "welcome",
      text: `I'm connecting to your energy to answer: ${typeof question === "object" ? question.label : question}...`,
      timestamp: Date.now()
    };
    addChatMessage(welcomeMsg);

    setTimeout(() => {
      setIsConnecting(false);
      setAppStatus("selecting_cards");
    }, 2000);
  }, [setCurrentQuestion, setAppStatus, setDrawnCards, setReadingResult, addChatMessage]);

  const handleCardsChosen = useCallback((cards) => {
    setDrawnCards(cards);
    setReading();

    const entry = {
      id: Date.now(),
      question: currentQuestion || selectedQuestion?.title || "",
      questionNumber: currentQuestionNumber || selectedQuestion?.number || null,
      cards,
      reading: null,
      language,
      isReading: true
    };
    addChatHistoryEntry(entry);
    setAppStatus("chatting");
  }, [currentQuestion, selectedQuestion, currentQuestionNumber, language, setDrawnCards, setReading, addChatHistoryEntry, setAppStatus]);

  const handleReadingComplete = useCallback((reading) => {
    setReadingResult(reading);
    setAppStatus("chatting");
  }, [setReadingResult, setAppStatus]);

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  const showCardSpread = currentAppStatus === "selecting_cards" || currentAppStatus === "connecting" || (!selectedQuestion && currentAppStatus === "idle");
  const showChat = currentAppStatus === "chatting" || !!readingResult || chatHistory.length > 0 || isConnecting;

  return (
    <div className="h-screen flex flex-col bg-cosmic overflow-hidden">
      <div
        className="fixed inset-0 opacity-[.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, hsla(45, 100%, 75%, 0.4) 0%, transparent 20%),
            radial-gradient(circle at 90% 30%, hsla(280, 100%, 65%, 0.3) 0%, transparent 20%),
            radial-gradient(circle at 50% 80%, hsla(45, 100%, 65%, 0.35) 0%, transparent 20%)
          `
        }}
      />

      <header className="lg:hidden shrink-0 z-30 bg-deepSlate/90 backdrop-blur-xl border-b border-gold/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="p-2 text-gold hover:bg-gold/10 rounded-xl transition-colors relative"
          >
            <MessageSquare size={24} />
          </button>
          <span className="text-xl">🔮</span>
          <span className="text-gold font-bold">Ginni Ki Baatein</span>
        </div>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="p-2 text-gold hover:bg-gold/10 rounded-xl transition-colors relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {readingResult && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-deepSlate" />
          )}
        </button>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        <QuestionSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 flex flex-col min-w-0 relative">
          <div className="hidden lg:flex shrink-0 px-8 py-4 border-b border-gold/10 items-center gap-3">
            <span className="text-2xl">🔮</span>
            <div>
              <h1 className="text-xl font-bold text-gold">Ginni Ki Baatein</h1>
              <p className="text-xs text-muted-foreground">Rider-Waite-Smith • 78-Card Deck</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isConnecting ? (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center p-8"
              >
                <div className="text-center space-y-4">
                  <div className="text-6xl animate-gx-float">🔮</div>
                  <p className="text-gold text-lg font-medium">I'm connecting to your energy...</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="card-spread"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex-1 flex flex-col min-w-0 ${showCardSpread ? "flex-1" : "hidden lg:flex"}`}
              >
                <ErrorBoundary>
                  <CardSpread
                    requiredCards={selectedQuestion?.cardCount || 1}
                    onCardsChosen={handleCardsChosen}
                  />
                </ErrorBoundary>
              </motion.div>
            )}
          </AnimatePresence>

          {showCardSpread && showChat && (
            <div className="hidden lg:block shrink-0 p-4 border-t border-gold/10">
              <button
                onClick={() => setAppStatus("chatting")}
                className="w-full py-2 bg-card border border-gold/20 rounded-xl text-sm text-gold hover:bg-gold/10 transition-colors"
              >
                View Chat History ↓
              </button>
            </div>
          )}
        </main>

        <ErrorBoundary>
          {isMobile ? (
            <motion.div
              initial={false}
              animate={{ x: chatOpen ? 0 : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-40 w-full"
            >
              <div className="lg:hidden flex items-center justify-between p-3 bg-deepSlate border-b border-gold/20">
                <span className="text-sm font-medium text-gold">Reading Chat</span>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 text-muted-foreground hover:text-gold"
                >
                  ✕
                </button>
              </div>
              {showChat && (
                <ReadingOutputChat
                  userName={state.userName}
                  selectedLanguage={language}
                  chatHistory={chatHistory}
                  readingResult={readingResult}
                  isReading={isReading}
                  onStartNewQuestion={handleStartNewQuestion}
                />
              )}
            </motion.div>
          ) : (
            <div className={`w-96 bg-deepSlate/80 border-l border-gold/10 flex flex-col h-full transition-all duration-500 ${showChat ? "w-96" : "w-0 overflow-hidden"}`}>
              {showChat && (
                <ReadingOutputChat
                  userName={state.userName}
                  selectedLanguage={language}
                  chatHistory={chatHistory}
                  readingResult={readingResult}
                  isReading={isReading}
                  onStartNewQuestion={handleStartNewQuestion}
                />
              )}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;