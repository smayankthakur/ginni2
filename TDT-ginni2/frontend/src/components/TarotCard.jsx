import React from "react";
import { TRUMPS } from "../utils/tarotDeck";

const SUIT_SYMBOLS = {
  Wands: "🔥",
  Cups: "💧",
  Swords: "🗡️",
  Pentacles: "⛏️"
};

const TRUMP_IMAGES = {
  "The Fool": "🃏",
  "The Magician": "🧙",
  "The High Priestess": "🔮",
  "The Empress": "👑",
  "The Emperor": "♔",
  "The Hierophant": "❦",
  "The Lovers": "💕",
  "The Chariot": "🏰",
  "Strength": "🦁",
  "The Hermit": "🕯️",
  "Wheel of Fortune": "🎡",
  "Justice": "⚖️",
  "The Hanged Man": "†",
  "Death": "💀",
  "Temperance": "🕊️",
  "The Devil": "😈",
  "The Tower": "🗼",
  "The Star": "⭐",
  "The Moon": "🌙",
  "The Sun": "☀️",
  "Judgement": "📯",
  "The World": "🌍"
};

const SUIT_COLORS = {
  Wands: "from-orange-900/40 via-orange-800/40 to-red-900/40",
  Cups: "from-blue-900/40 via-blue-800/40 to-cyan-900/40",
  Swords: "from-gray-700/40 via-gray-600/40 to-gray-500/40",
  Pentacles: "from-green-900/40 via-green-800/40 to-emerald-900/40"
};

const SUIT_BORDERS = {
  Wands: "border-orange-400/50",
  Cups: "border-blue-400/50",
  Swords: "border-gray-400/50",
  Pentacles: "border-green-400/50"
};

function TarotCard({ card, isRevealed, isDrawing, flipDelay }) {
  if (!card) return null;

  const { name, type, suit, rank, reversed } = card;

  let suitSymbol = "";
  let borderColor = "border-gold/35";
  let arcaneNumber = "";

  if (type === "trump") {
    suitSymbol = TRUMP_IMAGES[name] || "🔮";
    arcaneNumber = TRUMPS.indexOf(name) + 1;
    borderColor = "border-gold/35";
  } else if (suit) {
    suitSymbol = SUIT_SYMBOLS[suit] || suit;
    borderColor = SUIT_BORDERS[suit] || "border-gold/35";
  }

  const rotateY = isRevealed ? 180 : 0;
  const extraRotation = reversed && isRevealed ? 180 : 0;

  return (
    <div
      className="relative w-40 h-60 sm:w-48 sm:h-72"
      style={{
        animationDelay: isDrawing ? `${flipDelay}ms` : "0ms"
      }}
    >
      <div
        className="relative w-full h-full transition-all duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotateY}deg) rotate(${extraRotation}deg)`
        }}
      >
        <div
          className="absolute inset-0 w-full h-full card-back flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute top-3 left-3">
            <div className="w-10 h-14 border border-gold/30 rounded"></div>
          </div>
          <div className="text-5xl opacity-15">{suitSymbol || "🃏"}</div>
          <div className="absolute bottom-3 right-3">
            <div className="w-10 h-14 border border-gold/30 rounded rotate-180"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent" />
        </div>

        <div
          className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center ${borderColor}`}
          style={{
            background: "hsl(0 0% 7%)",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            border: "1px solid hsl(var(--gold) / 0.35)"
          }}
        >
          <div className="absolute top-2 left-3 text-base font-bold text-gold/60">
            {arcaneNumber || rank || ""}
          </div>

          <div className="text-5xl mb-3 drop-shadow-[0_0_10px_rgba(218,165,32,0.5)]">
            {suitSymbol}
          </div>

          <div className="text-center px-3">
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {name}
            </h3>
            {type === "minor" && suit && (
              <p className="text-sm text-muted-foreground/70 mt-1">
                {suit}
              </p>
            )}
          </div>

          <div
            className={`absolute bottom-2 right-3 text-xs font-semibold ${
              reversed ? "text-rose" : "text-muted-foreground/60"
            }`}
          >
            {reversed ? "REV" : "UPR"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarotCard;
