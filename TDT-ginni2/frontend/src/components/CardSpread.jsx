import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { buildFullDeck } from "../data/questions";
import { shuffleDeck } from "../utils/tarotDeck";
import TarotCard from "./TarotCard";

const CARD_WIDTH = 88;
const CARD_HEIGHT = CARD_WIDTH * 1.4;
const OVERLAP = 28;

const CardBack = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gold/35 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent" />
    <div className="text-3xl opacity-20 select-none">🔮</div>
    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gold/5 to-transparent" />
  </div>
);

const CardSpread = ({ requiredCards = 1, deck: deckProp, onCardsChosen }) => {
  const [deck, setDeck] = useState([]);
  const [flippedIds, setFlippedIds] = useState(new Set());
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
    setFlippedIds(new Set());
    setIsFrozen(false);
  }, [deckProp]);

  const flippedCount = flippedIds.size;
  const remaining = Math.max(0, requiredCards - flippedCount);
  const isComplete = flippedCount >= requiredCards;

  const handleCardClick = useCallback(
    (card) => {
      if (isFrozen) return;
      if (flippedIds.has(card.id)) return;

      const newFlipped = new Set(flippedIds);
      newFlipped.add(card.id);
      setFlippedIds(newFlipped);

      if (newFlipped.size >= requiredCards) {
        setIsFrozen(true);
        const chosenCards = deck.filter((c) => newFlipped.has(c.id));
        setTimeout(() => {
          onCardsChosen?.(chosenCards);
        }, 800);
      }
    },
    [flippedIds, isFrozen, requiredCards, deck, onCardsChosen]
  );

  const totalWidth = deck.length * (CARD_WIDTH - OVERLAP);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 p-4 text-center border-b border-gold/10 space-y-1">
        <h3 className="text-xl font-bold text-gold">
          Apne cards chuniye — Choose {requiredCards} card{requiredCards > 1 ? "s" : ""} that call to you
        </h3>
        <p className="text-muted-foreground text-sm">
          {isComplete
            ? "✦ Cards locked in — preparing your reading..."
            : `${flippedCount} flipped — ${remaining} remaining`}
        </p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <div
          ref={containerRef}
          className="flex-1 flex flex-row items-center overflow-x-auto scrollbar-hide min-h-[250px] relative z-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            className="relative shrink-0"
            style={{
              width: `${Math.max(containerRef.current?.offsetWidth || 0, totalWidth)}px`,
              padding: "0 16px"
            }}
          >
            {deck.map((card, index) => {
              const isFlipped = flippedIds.has(card.id);
              const isHovered = hoveredId === card.id && !isFrozen;
              const canFlip = !isFlipped && !isFrozen;
              const waveOffset = Math.sin(index * 0.22) * 14;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{
                    opacity: isFrozen && !isFlipped ? 0.45 : 1,
                    y: waveOffset,
                    scale: isFlipped ? 1.08 : 1,
                    zIndex: isFlipped ? 30 : isHovered ? 100 : index
                  }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 120,
                    delay: index * 0.012
                  }}
                  className="absolute top-1/2 shrink-0"
                  style={{
                    left: index * (CARD_WIDTH - OVERLAP),
                    marginTop: -CARD_HEIGHT / 2,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT
                  }}
                  onMouseEnter={() => canFlip && setHoveredId(card.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => canFlip && handleCardClick(card)}
                >
                  <motion.div
                    animate={{
                      y: isHovered ? -15 : 0,
                      filter: isFlipped
                        ? "none"
                        : isHovered
                          ? "brightness(1.25) drop-shadow(0 0 16px rgba(246, 206, 85, 0.6)) drop-shadow(0 0 32px rgba(187, 103, 228, 0.4))"
                          : "none"
                    }}
                    transition={{ type: "spring", damping: 16, stiffness: 220 }}
                    className={`
                      relative rounded-xl cursor-pointer select-none
                      ${isFrozen && !isFlipped ? "cursor-not-allowed" : ""}
                      ${isFlipped ? "ring-2 ring-gold/80 ring-offset-2 ring-offset-black" : ""}
                    `}
                    style={{
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT
                    }}
                  >
                    {isFlipped ? (
                      <TarotCard card={card} isRevealed={true} />
                    ) : (
                      <CardBack />
                    )}

                    {isFlipped && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-gold z-10"
                      >
                        {flippedIds.size}
                      </motion.div>
                    )}

                    {isFrozen && isFlipped && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-xl border-2 border-gold/60 pointer-events-none"
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
  );
};

export default CardSpread;