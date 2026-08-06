import React from "react";
import { useApp } from "../context/AppContext";
import { QUESTIONS } from "../data/questions";

const QuestionSidebar = ({ isOpen, onClose }) => {
  const { state, selectQuestion } = useApp();
  const { selectedQuestion } = state;

  const handleSelect = (q) => {
    selectQuestion(q);
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-72 bg-deepSlate/95 backdrop-blur-xl
          border-r border-gold/20
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gold/10">
            <div className="flex items-center justify-between lg:justify-start gap-3">
              <span className="text-3xl">🔮</span>
              <div>
                <h2 className="text-lg font-bold text-gold">Questions</h2>
                <p className="text-xs text-muted-foreground">Choose your reading</p>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-muted-foreground hover:text-gold transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            {QUESTIONS.map((q) => {
              const isActive = selectedQuestion?.number === q.number;
              return (
                <button
                  key={q.number}
                  onClick={() => handleSelect(q)}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all duration-300 group
                    ${isActive
                      ? "bg-gold/15 border border-gold/40 shadow-[0_0_20px_rgba(218,165,32,0.15)]"
                      : "border border-transparent hover:border-gold/20 hover:bg-gold/5"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{q.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          text-xs font-medium px-2 py-0.5 rounded-full
                          ${isActive
                            ? "bg-gold/20 text-gold"
                            : "bg-muted text-muted-foreground"
                          }
                        `}>
                          {q.cardCount > 1 ? `${q.cardCount} cards` : "1 card"}
                        </span>
                      </div>
                      <h3 className={`
                        text-sm font-semibold leading-snug
                        ${isActive ? "text-gold" : "text-foreground group-hover:text-gold"}
                        transition-colors
                      `}>
                        {q.title}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-gold/10">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>✨</span>
              <span>78-Card RWS Deck</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default QuestionSidebar;
