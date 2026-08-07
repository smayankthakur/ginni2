"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { DECK, LANG_LABEL } from "@/lib/topics";
import { READINGS } from "@/lib/readings";
import { getReadingFor, shuffle } from "@/lib/parseReading";
import TarotCard from "./TarotCard";

export default function ReadingPanel({ topic, lang, onAnotherQuestion }) {
  const [picks, setPicks] = useState([]); // [{card, monthIndex}]
  const [flippingCard, setFlippingCard] = useState(null);
  const [drawSeed, setDrawSeed] = useState(0);
  const revealEndRef = useRef(null);

  const data = topic ? READINGS[topic.dataKey] : null;

  const spreadCards = useMemo(() => {
    if (!topic) return [];
    const spreadSize = Math.min(DECK.length, Math.max(15, topic.cards + 12));
    return shuffle(DECK).slice(0, spreadSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, drawSeed]);

  // reset when the topic changes
  useEffect(() => {
    setPicks([]);
    setFlippingCard(null);
  }, [topic]);

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

      {total > 1 && (
        <div className="progress-track">
          {Array.from({ length: total }, (_, i) => {
            const cls = i < doneCount ? "done" : i === doneCount ? "current" : "";
            return (
              <span key={i} className={"progress-dot " + cls}>
                {i < doneCount ? "✓" : i + 1}
              </span>
            );
          })}
        </div>
      )}

      {doneCount < total && (
        <>
          <div className="spread">
            {flippingCard && (
              <TarotCard key={flippingCard} cardName={flippingCard} flipped onPick={() => {}} />
            )}
            {remainingSpread.map((c) => (
              <TarotCard
                key={c}
                cardName={c}
                flipped={false}
                disabledOther={!!flippingCard}
                onPick={handlePick}
              />
            ))}
          </div>
          <p className="spread-hint">Tap the card that calls to you.</p>
        </>
      )}

      {doneCount > 0 && (
        <div className="reveal">
          {picks.map((pick) => {
            const raw = data[pick.card];
            if (!raw) {
              return (
                <div className="month-entry" key={pick.card}>
                  <div className="reveal-card-name">
                    <span className="card-label">{pick.card}</span>
                  </div>
                  <p className="reveal-text">No reading text found for this card in the source file.</p>
                </div>
              );
            }
            const { text, short } = getReadingFor(raw, lang);
            return (
              <div className="month-entry" key={pick.card + pick.monthIndex}>
                <div className="reveal-card-name">
                  <span className="card-label">{pick.card}</span>
                  {total > 1 && (
                    <span className="month-tag">
                      Month {pick.monthIndex} of {total}
                    </span>
                  )}
                </div>
                <p className="reveal-text">
                  {text}
                  {short && (
                    <span className="note">
                      A {LANG_LABEL[lang]} version of this reading wasn&rsquo;t available in the
                      source — showing it in the language it was written.
                    </span>
                  )}
                </p>
              </div>
            );
          })}
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
