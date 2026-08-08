"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { DECK, MONTH_NAMES, UNAVAILABLE_MESSAGE } from "@/lib/topics";
import { READINGS } from "@/lib/readings";
import { getReadingFor, shuffle } from "@/lib/parseReading";
import { getGreeting, getClosing } from "@/lib/ginni";
import TarotCard from "./TarotCard";

export default function ReadingPanel({ topic, lang, name, onAnotherQuestion }) {
  const [picks, setPicks] = useState([]); // [{card, monthIndex}]
  const [flippingCard, setFlippingCard] = useState(null);
  const [drawSeed, setDrawSeed] = useState(0);
  const revealEndRef = useRef(null);

  const data = topic ? READINGS[topic.dataKey] : null;

  // Always spread the full 78-card deck, freshly shuffled per topic/redraw.
  const spreadCards = useMemo(() => {
    if (!topic) return [];
    return shuffle(DECK);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, drawSeed]);

  useEffect(() => {
    if (revealEndRef.current) {
      revealEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [picks.length]);

  if (!topic) {
    return (
      <div className="state-empty">
        <svg className="glyph-big" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="21" stroke="#9C97C2" strokeWidth="1" />
          <path
            d="M23 12 L25.5 20.5 L34 23 L25.5 25.5 L23 34 L20.5 25.5 L12 23 L20.5 20.5 Z"
            fill="#9C97C2"
            opacity="0.6"
          />
        </svg>
        <h2>Choose a question to begin</h2>
        <p>Pick one of the ten questions on the left. I&rsquo;ll lay out a spread — draw the card that draws you.</p>
      </div>
    );
  }

  const total = topic.cards;
  const doneCount = picks.length;
  // For a single-card topic, reveal right after the pick. For a multi-card
  // topic (the 12-month spread), hold every reading back until all cards
  // are drawn, then show the full spread of readings together.
  const showReveal = total === 1 ? doneCount > 0 : doneCount === total;
  const remainingSpread = spreadCards.filter(
    (c) => !picks.some((p) => p.card === c) && c !== flippingCard
  );

  function handlePick(cardName) {
    if (flippingCard) return;
    setFlippingCard(cardName);
    setTimeout(() => {
      setPicks((prev) => [...prev, { card: cardName, monthIndex: prev.length + 1 }]);
      setFlippingCard(null);
    }, 620);
  }

  return (
    <>
      <div className="reading-header">
        <div className="eyebrow topic-eyebrow">QUESTION {String(topic.id).padStart(2, "0")}</div>
        <h2>{topic.title}</h2>
        <p className="prompt">{topic.prompt}</p>
      </div>

      {topic.placeholder && (
        <p className="prompt" style={{ color: "var(--rose)" }}>
          Note: this question&rsquo;s own reading set wasn&rsquo;t available, so it&rsquo;s
          temporarily drawing from the universe-guidance deck as a placeholder.
        </p>
      )}

      {doneCount === 0 && (
        <p className="ginni-msg">
          <span className="ginni-mark">✦</span>
          {getGreeting(name, lang, topic, drawSeed)}
        </p>
      )}

      {total > 1 && (
        <div className="progress-track">
          {Array.from({ length: total }, (_, i) => {
            const cls = i < doneCount ? "done" : i === doneCount ? "current" : "";
            return (
              <span key={i} className={"progress-dot " + cls} title={MONTH_NAMES[i]}>
                {i < doneCount ? "✓" : i + 1}
              </span>
            );
          })}
        </div>
      )}

      {doneCount < total && (
        <>
          {total > 1 && (
            <p className="spread-hint" style={{ marginTop: 0 }}>
              Drawing for <b style={{ color: "var(--gold-soft)" }}>{MONTH_NAMES[doneCount]}</b> —
              card {doneCount + 1} of {total}.
            </p>
          )}
          <div className="spread" key={topic.id + "-" + drawSeed}>
            {flippingCard && (
              <TarotCard key={flippingCard} cardName={flippingCard} flipped onPick={() => {}} />
            )}
            {remainingSpread.map((c, i) => (
              <TarotCard
                key={c}
                cardName={c}
                flipped={false}
                disabledOther={!!flippingCard}
                onPick={handlePick}
                style={{ animationDelay: `${Math.min(i * 9, 550)}ms` }}
              />
            ))}
          </div>
          <p className="spread-hint">
            {total > 1
              ? `✨ 78 cards, freshly shuffled. ${doneCount} of ${total} picked — keep going.`
              : "✨ 78 cards, freshly shuffled. Tap the one that calls to you."}
          </p>
        </>
      )}

      {showReveal && (
        <div className="reveal">
          {picks.map((pick) => {
            const raw = data[pick.card];
            const monthLabel = total > 1 ? MONTH_NAMES[pick.monthIndex - 1] : null;

            if (!raw) {
              return (
                <div className="month-entry" key={pick.card + pick.monthIndex}>
                  <div className="reveal-card-name">
                    <span className="card-label">{pick.card}</span>
                    {monthLabel && <span className="month-tag">{monthLabel}</span>}
                  </div>
                  <p className="reveal-text">No reading text found for this card in the source file.</p>
                </div>
              );
            }

            const { text, available, singleLanguageSource } = getReadingFor(raw, lang);
            return (
              <div className="month-entry" key={pick.card + pick.monthIndex}>
                <div className="reveal-card-name">
                  <span className="card-label">{pick.card}</span>
                  {monthLabel && <span className="month-tag">{monthLabel}</span>}
                </div>
                {available ? (
                  <p className="reveal-text">
                    {text}
                    {singleLanguageSource && (
                      <span className="note">
                        This reading only exists in one language in the source — shown as
                        written.
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="reveal-text unavailable">{UNAVAILABLE_MESSAGE[lang]}</p>
                )}
              </div>
            );
          })}

          <p className="ginni-msg ginni-msg--closing">
            <span className="ginni-mark">✦</span>
            {getClosing(name, lang, drawSeed)}
          </p>

          <div ref={revealEndRef} />
        </div>
      )}

      {doneCount === total && total > 0 && (
        <div className="actions-row">
          <button
            className="btn-ghost"
            onClick={() => {
              setPicks([]);
              setDrawSeed((s) => s + 1);
            }}
          >
            Draw again
          </button>
          <button className="btn-ghost" onClick={onAnotherQuestion}>
            Ask another question
          </button>
        </div>
      )}
    </>
  );
}
