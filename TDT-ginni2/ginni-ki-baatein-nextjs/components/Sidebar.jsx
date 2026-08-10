"use client";

import { TOPICS, LANG_LABEL } from "@/lib/topics";

export default function Sidebar({ name, lang, activeTopicId, onSelectTopic, onRestart }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="The Divine Tarot" className="sidebar-glyph" />
        <span className="brand">Ginni Ki Baatein</span>
      </div>
      <div className="sidebar-user">
        Reading for <b>{name}</b> · {LANG_LABEL[lang]}
      </div>

      <ul className="topic-list">
        {TOPICS.map((t) => (
          <li
            key={t.id}
            className={"topic-item" + (activeTopicId === t.id ? " selected" : "")}
            style={{ animationDelay: `${t.id * 40}ms` }}
            onClick={() => onSelectTopic(t)}
          >
            <span className="topic-num">{String(t.id).padStart(2, "0")}</span>
            <span className="topic-text">
              <span className="topic-title">{t.title}</span>
              <span className="topic-meta">
                {t.cards} card{t.cards > 1 ? "s" : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        Each spread is shuffled fresh. Pick with an open mind — the card that calls to you is the
        one meant for you.
        <button onClick={onRestart}>Start over</button>
      </div>
    </aside>
  );
}
