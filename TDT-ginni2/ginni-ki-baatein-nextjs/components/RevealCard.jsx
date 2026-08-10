"use client";

import { useState } from "react";
import { cardSlug, cardEmoji, UNAVAILABLE_MESSAGE } from "@/lib/topics";
import { getReadingFor } from "@/lib/parseReading";

export default function RevealCard({ pick, raw, lang, monthLabel }) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = `/cards/${cardSlug(pick.card)}.png`;

  if (!raw) {
    return (
      <div className="month-entry">
        <div className="reveal-body">
          <div className="reveal-card-name">
            <span className="card-label">{pick.card}</span>
            {monthLabel && <span className="month-tag">{monthLabel}</span>}
          </div>
          <p className="reveal-text unavailable">{UNAVAILABLE_MESSAGE[lang]}</p>
        </div>
      </div>
    );
  }

  const { text, available, singleLanguageSource } = getReadingFor(raw, lang);

  return (
    <div className="month-entry">
      <div className="reveal-frame">
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={pick.card} onError={() => setImgFailed(true)} />
        ) : (
          <span className="reveal-frame-fallback">{pick.card}</span>
        )}
        <span className="reveal-badge">{cardEmoji(pick.card)}</span>
      </div>
      <div className="reveal-body">
        <div className="reveal-card-name">
          <span className="card-label">{pick.card}</span>
          {monthLabel && <span className="month-tag">{monthLabel}</span>}
        </div>
        {available ? (
          <p className="reveal-text">
            {text}
            {singleLanguageSource && (
              <span className="note">
                This reading only exists in one language in the source — shown as written.
              </span>
            )}
          </p>
        ) : (
          <p className="reveal-text unavailable">{UNAVAILABLE_MESSAGE[lang]}</p>
        )}
      </div>
    </div>
  );
}
