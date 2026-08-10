"use client";

import { useState } from "react";
import { cardSlug, cardEmoji, UNAVAILABLE_MESSAGE } from "@/lib/topics";
import { getReadingFor } from "@/lib/parseReading";

const SINGLE_LANG_NOTE = {
  hinglish: "Yeh reading abhi sirf Hinglish mein hi likhi gayi hai — jald hi baaki languages mein bhi aayegi 💜",
  english: "This one's currently written in Hinglish only in the source — an English version isn't ready yet, so it's shown as-is.",
  hindi: "यह रीडिंग अभी सिर्फ हिंग्लिश में लिखी गई है — हिंदी वर्शन जल्द आएगा।",
};

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
            {singleLanguageSource && lang !== "hinglish" && (
              <span className="note">{SINGLE_LANG_NOTE[lang]}</span>
            )}
          </p>
        ) : (
          <p className="reveal-text unavailable">{UNAVAILABLE_MESSAGE[lang]}</p>
        )}
      </div>
    </div>
  );
}
