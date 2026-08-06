import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildFullDeck } from "../data/questions";
import { shuffleDeck } from "../utils/tarotDeck";

const CardBack = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gold/35 rounded-md flex items-center justify-center relative overflow-hidden shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent" />
    <div className="text-2xl opacity-20 select-none">🔮</div>
    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gold/5 to-transparent" />
  </div>
);

const CARD_WIDTH = 88;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const CardSelectionSpread = ({ requiredCards = 1, deck: deckProp, onComplete, onCancel }) => {
  const [deck, setDeck] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const source = deckProp && deckProp.length > 0 ? deckProp : buildFullDeck();
    const shuffled = shuffleDeck(source);
    const withIds = shuffled.map((card, i) => ({
      ...card,
      id: `${card.name}-${i}-${Date.now()}`,
      reversed: Math.random() < 0.5
    }));
    setDeck(withIds);
    setSelectedCards([]);
    setIsFrozen(false);
  }, [deckProp]);

  const remaining = useMemo(() => Math.max(0, requiredCards - selectedCards.length), [requiredCards, selectedCards.length]);

  const handleCardClick = useCallback((card) => {
    if (isFrozen) return;
    if (selectedCards.find((c) => c.id === card.id)) return;
    if (selectedCards.length >= requiredCards) return;

    const newSelected = [...selectedCards, { ...card, selectedAt: Date.now() }];
    setSelectedCards(newSelected);

    if (newSelected.length >= requiredCards) {
      setIsFrozen(true);
      setTimeout(() => {
        onComplete?.(newSelected);
      }, 1000);
    }
  }, [isFrozen, selectedCards, requiredCards, onComplete]);

  const handleCancel = useCallback(() => {
    if (isFrozen) return;
    onCancel?.();
  }, [isFrozen, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, hsla(45, 100%, 75%, 0.4) 0%, transparent 20%),
            radial-gradient(circle at 90% 30%, hsla(280, 100%, 65%, 0.3) 0%, transparent 20%),
            radial-gradient(circle at 50% 80%, hsla(45, 100%, 65%, 0.35) 0%, transparent 20%)
          `
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="shrink-0 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gold" style={{ fontFamily: "ui-serif, Georgia, Cambria, Times, serif" }}>
              Apne cards chuniye
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose {requiredCards} card{requiredCards > 1 ? "s" : ""} that calls to you — <span className="text-gold font-medium">{remaining} remaining</span>
            </p>
          </div>

          <button
            onClick={handleCancel}
            disabled={isFrozen}
            className="px-4 py-1.5 rounded-full border border-gold/30 text-gold text-sm font-medium hover:bg-gold/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ✕ Cancel
          </button>
        </div>

        <div className="flex-1 flex items-center overflow-hidden p-4">
          <div
            ref={containerRef}
            className="overflow-x-auto overflow-y-hidden w-full no-scrollbar"
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
                      y: isSelected ? -12 : 0,
                      scale: isSelected ? 1.05 : 1,
                      zIndex: isSelected ? 30 : isHovered ? 100 : index
                    }}
                    transition={{
                      type: "spring",
                      damping: 18,
                      stiffness: 120,
                      delay: index * 0.01
                    }}
                    className={`
                      relative shrink-0 cursor-pointer select-none
                      ${index === 0 ? "" : "-ml-10"}
                      ${isFrozen && !isSelected ? "cursor-not-allowed" : ""}
                      ${isSelected ? "ring-2 ring-gold/80 ring-offset-2 ring-offset-black" : ""}
                    `}
                    style={{ width: CARD_WIDTH }}
                    onMouseEnter={() => canSelect && setHoveredId(card.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => canSelect && handleCardClick(card)}
                  >
                    <motion.div
                      animate={{
                        y: isHovered ? -15 : 0,
                      filter: isSelected
                        ? "none"
                        : isHovered
                          ? "brightness(1.25) drop-shadow(0 0 16px rgba(246, 206, 85, 0.6)) drop-shadow(0 0 32px rgba(187, 103, 228, 0.4))"
                          : "none"
                      }}
                      transition={{ type: "spring", damping: 16, stiffness: 220 }}
                      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                    >
                      <CardBack />

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-gold z-10"
                        >
                          {selectedCards.findIndex((c) => c.id === card.id) + 1}
                        </motion.div>
                      )}

                      {isFrozen && isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 rounded-md border-2 border-gold/60 pointer-events-none"
                          style={{
                            boxShadow: "0 0 20px hsl(45 90% 65% / 0.4), inset 0 0 20px hsl(45 90% 65% / 0.1)"
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

        <div className="shrink-0 p-4 border-t border-gold/10 text-center">
          <p className="text-sm text-muted-foreground">
            Trust your intuition — the cards are face-down for a reason. 🌙
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardSelectionSpread;
