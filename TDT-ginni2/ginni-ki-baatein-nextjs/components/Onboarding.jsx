"use client";

import { useState } from "react";

const LANGS = [
  { key: "hinglish", native: "Hinglish", label: "मिली-जुली" },
  { key: "english", native: "English", label: "English" },
  { key: "hindi", native: "हिंदी", label: "Hindi" },
];

export default function Onboarding({ onBegin }) {
  const [name, setName] = useState("");
  const [lang, setLang] = useState("hinglish");

  return (
    <div id="onboard">
      <div className="onboard-card">
        <svg className="onboard-glyph" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="21" stroke="#D4AF6A" strokeWidth="1" opacity="0.5" />
          <path d="M23 8 L26 20 L38 23 L26 26 L23 38 L20 26 L8 23 L20 20 Z" fill="#E8CDA0" opacity="0.9" />
        </svg>
        <h1>Ginni Ki Baatein</h1>
        <p className="onboard-sub">
          A private tarot counsel. Tell me your name and the tongue
          <br />
          you&rsquo;d like your reading in.
        </p>

        <div className="field">
          <label htmlFor="nameInput">Your name</label>
          <input
            id="nameInput"
            type="text"
            placeholder="e.g. Priya"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Reading language</label>
          <div className="lang-options">
            {LANGS.map((l) => (
              <div
                key={l.key}
                className={"lang-opt" + (lang === l.key ? " active" : "")}
                onClick={() => setLang(l.key)}
              >
                <span className="lang-native">{l.native}</span>
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          disabled={name.trim().length === 0}
          onClick={() => onBegin(name.trim(), lang)}
        >
          Start your reading
        </button>
      </div>
    </div>
  );
}
