import React from "react";

function CardInterpretation({ reading, onNewReading }) {
  if (!reading) return null;

  const formatText = (text) => {
    if (!text) return "_";
    return text
      .replace(/\n/g, "<br/>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  };

  const getSuitSymbol = (suit) => {
    const symbols = {
      Wands: "🔥",
      Cups: "💧",
      Swords: "🗡️",
      Pentacles: "⛏️"
    };
    return symbols[suit] || "🔮";
  };

  return (
    <div className="space-y-8 gx-fade-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gold mb-2 drop-shadow-[0_0_15px_rgba(218,165,32,0.3)]">
          Your Reading: {reading.questionTitle}
        </h2>
        <p className="text-muted-foreground">
          Topic: {reading.topicLabel} • {reading.totalCards} card(s) drawn
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {reading.reading.map((item, idx) => (
          <div key={`card-${idx}-${item.card}`} className="flex flex-col items-center space-y-2">
            <div className="relative w-40 h-60 group">
              <div className="absolute inset-0 card-back flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <span className="text-4xl">
                  {item.type === "trump" ? "🃏" : getSuitSymbol(item.suit)}
                </span>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                {item.reversed ? "REV" : "UPR"}
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gold text-lg">{item.card}</h3>
              <p className={`text-sm ${item.reversed ? "text-rose" : "text-muted-foreground"}`}>
                {item.reversed ? "Reversed" : "Upright"}
                {item.month && <span className="text-muted-foreground/60"> • {item.month}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 mt-8">
        {reading.reading.map((item, idx) => (
          <div
            key={`interp-${idx}-${item.card}`}
            className="card-frame p-6 border-gold/35"
          >
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-bold text-gold">
                  {item.reversed ? `${item.card} (Reversed)` : item.card}
                  {item.month && (
                    <span className="text-sm text-muted-foreground ml-2">({item.month})</span>
                  )}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {item.type === "trump" ? "Major Arcana" : `Minor Arcana • ${item.suit || ""}`}
                </p>
              </div>
              <span className="px-3 py-1 bg-gold/10 text-gold text-xs rounded-full border border-gold/30">
                Card {idx + 1}
              </span>
            </div>

            <div
              className="text-muted-foreground/80 leading-relaxed text-sm whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: formatText(item.interpretation || "No interpretation available in the knowledge base for this card.")
              }}
            />
          </div>
        ))}
      </div>

      {onNewReading && (
        <div className="text-center mt-8">
          <button
            onClick={onNewReading}
            className="px-10 py-4 bg-gold text-primary-foreground font-bold rounded-full hover:brightness-110 transition-all duration-300 shadow-gold transform hover:scale-105"
          >
            New Reading
          </button>
        </div>
      )}
    </div>
  );
}

export default CardInterpretation;
