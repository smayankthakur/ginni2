"use client";

export default function TarotCard({ cardName, flipped, disabledOther, onPick, style }) {
  return (
    <button
      className={
        "tarot-card spread-item" +
        (flipped ? " flipped" : "") +
        (disabledOther ? " picked-elsewhere" : "")
      }
      style={style}
      disabled={flipped || disabledOther}
      aria-label={flipped ? cardName : "Draw a card"}
      onClick={() => onPick(cardName)}
    >
      <span className="face back">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="#E8CDA0" />
        </svg>
      </span>
      <span className="face front">
        <span className="fn">{flipped ? cardName : ""}</span>
      </span>
    </button>
  );
}
