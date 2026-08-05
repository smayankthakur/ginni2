import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { QUESTIONS } from "../data/questions";

function QuestionSelection() {
  const navigate = useNavigate();

  const handleSelect = (question) => {
    navigate(`/reading/${question.number}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center gx-fade-up">
        <h2 className="text-4xl font-bold text-gold mb-3 drop-shadow-[0_0_15px_rgba(218,165,32,0.3)]">
          Choose Your Reading
        </h2>
        <p className="text-muted-foreground text-lg">
          Select a question to begin your tarot reading journey
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUESTIONS.map((q) => (
          <button
            key={q.number}
            onClick={() => handleSelect(q)}
            className="group relative p-6 rounded-2xl border border-border hover:border-gold/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
              bg-card/80 hover:shadow-gold
              flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-4 group-hover:animate-gx-float">
              {q.icon}
            </div>

            <span className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Option {q.number}
            </span>
            <h3 className="text-xl font-bold text-foreground group-hover:text-gold transition-colors mb-2">
              {q.title}
            </h3>
            <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/70 transition-colors line-clamp-2">
              {q.description}
            </p>

            {q.cardCount > 1 && (
              <span className="mt-3 px-3 py-1 bg-gold/10 text-gold text-xs rounded-full border border-gold/30">
                {q.cardCount} cards
              </span>
            )}

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/"
          className="inline-block px-10 py-4 bg-gold text-primary-foreground font-bold rounded-full hover:brightness-110 transition-all duration-300 shadow-gold transform hover:scale-105"
        >
          Begin Reading
        </Link>
      </div>
    </div>
  );
}

export default QuestionSelection;
