import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildFullDeck } from "../data/questions";
import { shuffleDeck } from "../utils/tarotDeck";

const CARD_WIDTH = 88;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const CardBack = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gold/35 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent" />
    <div className="text-3xl opacity-20 select-none">🔮</div>
    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gold/5 to-transparent" />
  </div>
);

const QuestionBasedCardSpread = ({ currentQuestion, onSelectionComplete }) => {
  const { text, requiredCardCount } = currentQuestion || {};
  const [deck, setDeck] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const shuffled = shuffleDeck(buildFullDeck());
    const withIds = shuffled.map((card, i) => ({
      ...card,
      id: `${card.name}-${i}-${Date.now()}`,
      reversed: Math.random() < 0.5
    }));
    setDeck(withIds);
    setSelectedCards([]);
    setIsFrozen(false);
  }, [text]);

  const cardsRemaining = useMemo(
    () => Math.max(0, requiredCardCount - selectedCards.length),
    [requiredCardCount, selectedCards.length]
  );

  const handleCardClick = useCallback(
    (card) => {
      if (isFrozen) return;
      if (selectedCards.find((c) => c.id === card.id)) return;
      if (selectedCards.length >= requiredCardCount) return;

      const newSelected = [...selectedCards, { ...card, selectedAt: Date.now() }];
      setSelectedCards(newSelected);

      if (newSelected.length >= requiredCardCount) {
        setIsFrozen(true);
        setTimeout(() => {
          onSelectionComplete?.(newSelected);
        }, 1500);
      }
    },
    [isFrozen, selectedCards, requiredCardCount, onSelectionComplete]
  );

  const isComplete = selectedCards.length === requiredCardCount;

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Area */}
      <div className="shrink-0 p-4 text-center border-b border-gold/10 space-y-2">
        <h2 className="text-lg font-bold text-gold leading-snug px-4">
          {text}
        </h2>
        <p className="text-muted-foreground text-sm">
          {isComplete
            ? "✦ Cards locked in — preparing your reading..."
            : `Select ${cardsRemaining} more card${cardsRemaining !== 1 ? "s" : ""} from the deck below.`}
        </p>
      </div>

      {/* Selected Tray */}
      <div className="shrink-0 p-3 flex items-center justify-center gap-3 min-h-[72px]">
        <AnimatePresence>
          {selectedCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ y: 60, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", damping: 14, stiffness: 180 }}
              className="relative"
            >
              <div className="w-12 h-[72px] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gold/50 rounded-lg flex items-center justify-center shadow-gold">
                <span className="text-gold text-xs font-bold">{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Deck Spread Area */}
      <div className="flex-1 flex items-center overflow-hidden p-2">
        <div
          ref={containerRef}
          className="overflow-x-auto overflow-y-hidden w-full scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex items-center py-4">
            {deck.map((card, index) => {
              const isSelected = selectedCards.some((c) => c.id === card.id);
              const isHovered = hoveredId === card.id && !isFrozen;
              const canSelect = !isSelected && !isFrozen;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{
                    opacity: isFrozen && !isSelected ? 0.4 : 1,
                    scale: isSelected ? 0.92 : 1,
                    zIndex: isSelected ? 30 : isHovered ? 100 : index
                  }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 120,
                    delay: index * 0.008
                  }}
                  className={`relative shrink-0 cursor-pointer select-none ${index === 0 ? "" : "-ml-8"} ${isFrozen && !isSelected ? "cursor-not-allowed" : ""} ${isSelected ? "ring-2 ring-gold/80 ring-offset-1 ring-offset-black" : ""}`}
                  style={{ width: CARD_WIDTH }}
                  onMouseEnter={() => canSelect && setHoveredId(card.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => canSelect && handleCardClick(card)}
                >
                  <motion.div
                    animate={{
                      y: isHovered ? -12 : 0,
                      filter: isSelected
                        ? "none"
                        : isHovered
                          ? "brightness(1.2) drop-shadow(0 0 12px hsl(45 90% 65% / 0.5)) drop-shadow(0 0 24px hsl(280 70% 65% / 0.3))"
                          : "none"
                    }}
                    transition={{ type: "spring", damping: 16, stiffness: 220 }}
                    className="relative"
                    style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                  >
                    <CardBack />

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold shadow-gold z-10"
                      >
                        {selectedCards.findIndex((c) => c.id === card.id) + 1}
                      </motion.div>
                    )}

                    {isFrozen && isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-xl border-2 border-gold/60 pointer-events-none"
                        style={{
                          boxShadow: "0 0 16px hsl(45 90% 65% / 0.35), inset 0 0 16px hsl(45 90% 65% / 0.08)"
                        }}
                      />
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Hint */}
      <div className="shrink-0 p-3 border-t border-gold/10 text-center">
        <p className="text-xs text-muted-foreground">
          Trust your intuition — the cards are face-down for a reason. 🌙
        </p>
      </div>
    </div>
  );
};

export default QuestionBasedCardSpread;