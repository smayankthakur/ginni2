import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TarotCard from "./TarotCard";
import { QUESTIONS, shuffleAndDraw } from "../data/questions";
import { fetchReadingFromKB } from "../utils/kbRouter";

const CardDrawing = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const question = QUESTIONS.find((q) => q.number === parseInt(questionId));
  const [phase, setPhase] = useState("initial");
  const [drawnCards, setDrawnCards] = useState([]);
  const [readingResult, setReadingResult] = useState(null);
  const [error, setError] = useState(null);
  const timeoutIdsRef = useRef([]);
  const mountedRef = useRef(true);
  const drawnCardsRef = useRef(drawnCards);

  useEffect(() => {
    drawnCardsRef.current = drawnCards;
  });

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (!question) {
      navigate("/");
      return;
    }
  }, [questionId, question, navigate]);

  const handleDraw = useCallback(() => {
    if (!question) return;

    setPhase("shuffling");

    const shuffleTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase("drawing");

      const localCards = shuffleAndDraw(question.cardCount);
      const cardsWithIds = localCards.map((card, i) => ({
        ...card,
        id: `${card.name}-${card.type}-${i}-${Date.now()}`
      }));

      const totalCards = cardsWithIds.length;
      const revealed = [];

      cardsWithIds.forEach((card, i) => {
        const drawTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          revealed.push(card);
          setDrawnCards([...revealed]);
        }, i * 350);
        timeoutIdsRef.current.push(drawTimer);
      });

      const revealTimer = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase("revealing");
        fetchReading();
      }, totalCards * 350 + 500);
      timeoutIdsRef.current.push(revealTimer);
    }, 1500);
    timeoutIdsRef.current.push(shuffleTimer);
  }, [question, fetchReading]);

  const fetchReading = useCallback(async () => {
    try {
      setPhase("loading");
      const result = await fetchReadingFromKB(parseInt(questionId), drawnCardsRef.current);
      if (!mountedRef.current) return;
      setReadingResult(result);
      setPhase("complete");
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || "Failed to fetch reading");
      setPhase("complete");
    }
  }, [questionId]);

  const formatInterpretation = (text) => {
    if (!text) return "No interpretation available in the knowledge base for this card.";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />")
      .replace(/(Hinglish:|English:|HINDI:)/g, "<strong>$1</strong><br />");
  };

  const renderInitialState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-10 gx-fade-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gold mb-3 drop-shadow-[0_0_15px_rgba(218,165,32,0.3)]">
          {question.title}
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {question.description}
        </p>
      </div>

      <div className="relative">
        <div className="w-64 h-96 card-back flex items-center justify-center">
          <div className="absolute top-3 left-3">
            <div className="w-10 h-14 border-2 border-gold/30 rounded transform rotate-12"></div>
          </div>
          <div className="absolute bottom-3 right-3">
            <div className="w-10 h-14 border-2 border-gold/30 rounded transform -rotate-12"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-15">
            🃏
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent animate-gx-glow"></div>
        </div>
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-gold/10 rounded-full blur-xl animate-gx-float"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gold/10 rounded-full blur-xl animate-gx-float"></div>
      </div>

      <button
        onClick={handleDraw}
        className="px-10 py-4 bg-gold text-primary-foreground font-bold rounded-full hover:brightness-110 transition-all duration-300 shadow-gold transform hover:scale-105 gx-glow"
      >
        Draw My Card{question.cardCount > 1 ? "s" : ""}
      </button>
    </div>
  );

  const renderShuffling = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-10">
      <h3 className="text-2xl text-gold font-bold">Shuffling the deck...</h3>
      <div className="relative">
        <div className="w-64 h-96 card-back animate-gx-glow"></div>
        <div className="absolute -inset-4 border-2 border-dashed border-gold/30 rounded-2xl animate-ping"></div>
      </div>
    </div>
  );

  const renderDrawing = (showRevealed = false) => (
    <div className="flex flex-col items-center min-h-[400px]">
      <h3 className="text-2xl text-gold font-bold mb-8">
        {showRevealed ? "Revealing your reading..." : `Drawing ${question.cardCount} card${question.cardCount > 1 ? "s" : ""}...`}
      </h3>
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
        {drawnCards.map((card, idx) => (
          <div key={`draw-${card.id || idx}`} className="relative">
            <TarotCard
              card={card}
              isRevealed={true}
              isDrawing={!showRevealed}
              flipDelay={idx * 200}
            />
            {question.cardCount === 12 && (
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground text-sm font-medium">
                Month {idx + 1}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="text-gold text-xl">Consulting the knowledge base...</div>
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-gx-spin-slow"></div>
    </div>
  );

  const renderComplete = () => {
    if (error) {
      return (
        <div className="text-center py-12 gx-fade-up">
          <p className="text-rose mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-card border border-gold/30 text-foreground rounded-full hover:border-gold transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!readingResult) {
      return renderLoading();
    }

    return (
      <div className="space-y-8" key="reading-complete">
        <div className="text-center">
           <h2 className="text-3xl font-bold text-gold mb-2 drop-shadow-[0_0_15px_rgba(218,165,32,0.3)]">
             Your Reading: {readingResult.questionTitle}
          </h2>
          <p className="text-muted-foreground">
            Drawn from the Rider-Waite-Smith 78-card deck
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {readingResult.reading.map((item, idx) => {
            const cardForComponent = {
              name: item.card,
              type: item.type,
              suit: item.suit,
              rank: item.rank,
              reversed: item.reversed
            };
            return (
              <div key={`result-card-${idx}`} className="flex flex-col items-center">
                <TarotCard
                  card={cardForComponent}
                  isRevealed={true}
                  isDrawing={false}
                />
                {item.month && (
                  <span className="mt-2 text-muted-foreground text-sm font-medium">
                    {item.month}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6 mt-8">
          {readingResult.reading.map((item, idx) => (
            <div
              key={`interp-${idx}`}
              className="bg-card border border-gold/35 card-frame p-6"
            >
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-bold text-gold">
                    Card {idx + 1}: {item.reversed ? `${item.card} (Reversed)` : item.card}
                    {item.month && (
                      <span className="text-sm text-muted-foreground ml-2">({item.month})</span>
                    )}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {item.type === "trump" ? "Major Arcana" : `Minor Arcana • ${item.suit || ""}`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.reversed
                    ? "bg-rose/10 text-rose border border-rose/30"
                    : "bg-gold/10 text-gold border border-gold/30"
                }`}>
                  {item.reversed ? "Reversed" : "Upright"}
                </span>
              </div>

              <div
                className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatInterpretation(item.interpretation)
                }}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 bg-gold text-primary-foreground font-bold rounded-full hover:brightness-110 transition-all duration-300 shadow-gold transform hover:scale-105"
          >
            New Reading
          </button>
        </div>
      </div>
    );
  };

  if (!question) {
    return null;
  }

  return (
    <div className="w-full" key={`q-${questionId}`}>
      {phase === "initial" && renderInitialState()}
      {phase === "shuffling" && renderShuffling()}
      {phase === "drawing" && renderDrawing(false)}
      {phase === "revealing" && renderDrawing(true)}
      {phase === "loading" && renderLoading()}
      {phase === "complete" && renderComplete()}
    </div>
  );
};

export default CardDrawing;
