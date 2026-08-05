import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const LANGUAGES = [
  { code: "hindi", label: "Hindi", flag: "🇮🇳" },
  { code: "english", label: "English", flag: "🇬🇧" },
  { code: "hinglish", label: "Hinglish", flag: "🇮🇳" }
];

const Onboarding = () => {
  const { setUserName, setLanguage } = useApp();
  const [name, setName] = useState("");
  const [selectedLang, setSelectedLang] = useState("hinglish");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      setLanguage(selectedLang);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] animate-gx-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mystic/10 rounded-full blur-[120px] animate-gx-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] animate-gx-spin-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative z-10 max-w-lg w-full mx-4"
      >
        <div className="card-frame p-8 md:p-12 text-center gx-fade-up">
          <div className="mb-8">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-7xl mb-6 inline-block"
            >
              🌙
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gold mb-4 drop-shadow-[0_0_20px_rgba(218,165,32,0.4)]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, Times, serif" }}
            >
              Ginni Ki Baatein
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              Aapka apna private tarot counsel.
              <br />
              Cards ka raaz, aapke liye.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative"
            >
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Your name"
                maxLength={30}
                className="w-full px-6 py-4 bg-card border-2 rounded-2xl text-foreground text-lg placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300"
                style={{
                  borderColor: isFocused ? "hsl(var(--gold) / 0.6)" : "hsl(var(--border))",
                  boxShadow: isFocused ? "0 0 30px hsl(45 90% 65% / 0.2)" : "none"
                }}
              />
              <div className="absolute right-4 top-1/2 -translate-x-1/2 text-2xl opacity-30 pointer-events-none">
                ✨
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-center gap-2"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLang(lang.code)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
                    ${selectedLang === lang.code
                      ? "bg-gold/20 text-gold border-gold/40 shadow-[0_0_15px_rgba(218,165,32,0.2)]"
                      : "bg-card text-muted-foreground border-border hover:border-gold/30 hover:text-foreground"
                    }
                  `}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              type="submit"
              disabled={!name.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-gold via-amber-400 to-gold text-primary-foreground font-bold text-lg rounded-2xl hover:brightness-110 transition-all duration-300 shadow-gold transform hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                boxShadow: name.trim() ? "0 0 30px hsl(45 90% 65% / 0.3)" : "none"
              }}
            >
              Enter the Reading
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 text-muted-foreground/60 text-sm"
          >
            Your reading is private and sacred
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
