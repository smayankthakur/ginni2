"use client";

import { useState } from "react";
import { cardSlug } from "@/lib/topics";

export default function TarotCard({ cardName, flipped, disabledOther, onPick, style }) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = `/cards/${cardSlug(cardName)}.jpg`;

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
        {flipped && !imgFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={cardName}
            className="card-art"
            onError={() => setImgFailed(true)}
          />
        )}
        {flipped && imgFailed && <span className="fn">{cardName}</span>}
      </span>
    </button>
  );
}
