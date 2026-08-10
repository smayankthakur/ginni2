"use client";

import { useState } from "react";
import { TOPICS, LANG_LABEL } from "@/lib/topics";

const LANGS = [
  { key: "hinglish", label: "मिली" },
  { key: "english", label: "EN" },
  { key: "hindi", label: "हिं" },
];

export default function Sidebar({ name, lang, activeTopicId, onSelectTopic, onChangeLang, onRestart }) {
  const [open, setOpen] = useState(false);

  function pick(t) {
    onSelectTopic(t);
    setOpen(false);
  }

  return (
    <>
      {/* Mobile top bar — only visible under 820px, controls the drawer */}
      <div className="mobile-topbar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="The Divine Tarot" className="mobile-topbar-glyph" />
        <span className="brand">Ginni Ki Baatein</span>
        <button
          className="hamburger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={"sidebar" + (open ? " open" : "")}>
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
              onClick={() => pick(t)}
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

        {onChangeLang && (
          <div className="lang-switch">
            <span className="lang-switch-label">Reading language</span>
            <div className="lang-switch-row">
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  className={"lang-chip" + (lang === l.key ? " active" : "")}
                  onClick={() => onChangeLang(l.key)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          Each spread is shuffled fresh. Pick with an open mind — the card that calls to you is the
          one meant for you.
          <button onClick={onRestart}>Start over</button>
        </div>
      </aside>
    </>
  );
}
