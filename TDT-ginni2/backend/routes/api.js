const express = require("express");
const router = express.Router();
const { drawCards } = require("../utils/tarotDeck");
const kbReader = require("../utils/kbReader");
const { parseInterpretation } = require("../utils/languageParser");

router.get("/questions", (req, res) => {
  const questions = Object.entries(kbReader.QUESTION_MAP).map(
    ([num, q]) => ({ number: parseInt(num), title: q.title, cardCount: q.cardCount })
  );
  res.json({ questions });
});

router.get("/deck", (req, res) => {
  const info = kbReader.getDeckInfo();
  res.json(info);
});

router.get("/topics", (req, res) => {
  const topics = kbReader.getAllTopics();
  res.json({ topics });
});

router.get("/card/:name/:topic", (req, res) => {
  const { name, topic } = req.params;
  const interpretation = kbReader.getCardInterpretation(name, topic);
  if (!interpretation) {
    const topicInfo = kbReader.getTopicFile(topic);
    if (!topicInfo) {
      return res.status(404).json({ error: `Topic "${topic}" not found` });
    }
    return res.status(404).json({ error: `Card "${name}" not found in topic "${topic}"` });
  }
  res.json({ card: name, topic, interpretation });
});

router.post("/reading", (req, res) => {
  const { questionNumber, language } = req.body;

  if (questionNumber === undefined || questionNumber === null) {
    return res.status(400).json({ error: "questionNumber is required" });
  }

  const question = kbReader.getQuestion(parseInt(questionNumber));
  if (!question) {
    return res.status(400).json({ error: `Invalid question number: ${questionNumber}` });
  }

  const { topicKey, cardCount, title } = question;
  const topicInfo = kbReader.getTopicFile(topicKey);

  if (!topicInfo) {
    return res.status(404).json({ error: `Topic "${topicKey}" not found in KB` });
  }

  const cards = drawCards(cardCount);
  const lang = language || "hinglish";

  const reading = cards.map((card, idx) => {
    const rawInterpretation = kbReader.getCardInterpretation(card.name, topicKey);
    const parsedInterpretation = parseInterpretation(rawInterpretation, lang);
    if (questionNumber === 10) {
      return {
        month: kbReader.MONTHS[idx],
        monthIndex: idx + 1,
        card: card.name,
        type: card.type,
        suit: card.suit,
        rank: card.rank,
        reversed: card.reversed,
        interpretation: parsedInterpretation || "No specific interpretation available in the knowledge base for this card.",
        kbFound: !!rawInterpretation
      };
    }
    return {
      card: card.name,
      type: card.type,
      suit: card.suit,
      rank: card.rank,
      reversed: card.reversed,
      interpretation: parsedInterpretation || "No specific interpretation available in the knowledge base for this card.",
      kbFound: !!rawInterpretation
    };
  });

  res.json({
    questionNumber: parseInt(questionNumber),
    questionTitle: title,
    topicKey,
    topicLabel: topicInfo.label,
    topicFile: topicInfo.file,
    totalCards: cardCount,
    language: lang,
    reading
  });
});

module.exports = router;
