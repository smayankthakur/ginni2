import { cardToId, cardToName, cardToOrientation } from "./cardIds";

const QUESTION_TO_FILE = {
  1: "feelings_current.json",
  2: "actions_next.json",
  3: "crush_feelings.json",
  4: "crush_actions.json",
  5: "yes_or_no.json",
  6: "third_party.json",
  7: "daily_reading.json",
  8: "spiritual_journey.json",
  9: "monthly_reading.json",
  10: "yearly_reading.json"
};

const KB_BASE_URL = import.meta.env.VITE_KB_BASE_URL || "/ginni-kb/";
const SUPPORTED_LANGUAGES = ["english", "hindi", "hinglish"];
const SUPPORTED_ORIENTATIONS = ["upright", "reversed"];
const FALLBACK_TEXT = "The cards are clouded right now. Please try your reading again.";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function resolveLanguage(language) {
  const normalized = (language || "hinglish").toLowerCase();
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : "hinglish";
}

function resolveOrientation(orientation) {
  const normalized = (orientation || "upright").toLowerCase();
  if (SUPPORTED_ORIENTATIONS.includes(normalized)) return normalized;
  return orientation === "reversed" ? "reversed" : "upright";
}

async function loadKBFile(filename) {
  const response = await fetch(`${KB_BASE_URL}${filename}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load KB file: ${filename} (HTTP ${response.status})`);
  }
  return response.json();
}

function getCardEntry(data, cardId) {
  if (!data || cardId == null) return null;
  const id = typeof cardId === "string" ? cardId : String(cardId);
  return data[id] || null;
}

function extractText(cardEntry, orientation, language) {
  if (!cardEntry) return null;

  const orient = resolveOrientation(orientation);
  const lang = resolveLanguage(language);

  const orientationData = cardEntry[orient];
  if (orientationData && orientationData[lang]) {
    return orientationData[lang];
  }

  const otherOrient = orient === "reversed" ? "upright" : "reversed";
  const otherOrientationData = cardEntry[otherOrient];
  if (otherOrientationData && otherOrientationData[lang]) {
    return otherOrientationData[lang];
  }

  if (orientationData) {
    const fallbackLang = Object.keys(orientationData).find((l) => orientationData[l]);
    if (fallbackLang) return orientationData[fallbackLang];
  }

  return null;
}

async function getReadingFromKB(questionId, selectedCard, language) {
  if (questionId == null || QUESTION_TO_FILE[questionId] == null) {
    throw new Error("Invalid Question ID: No mapping found.");
  }

  if (!selectedCard || typeof selectedCard !== "object") {
    return FALLBACK_TEXT;
  }

  const cardId = cardToId(selectedCard);
  if (!cardId || cardId < 1 || cardId > 78) {
    return FALLBACK_TEXT;
  }

  const orientation = cardToOrientation(selectedCard);
  const lang = resolveLanguage(language);

  try {
    const filename = QUESTION_TO_FILE[questionId];
    const data = await loadKBFile(filename);
    const cardEntry = getCardEntry(data, cardId);

    if (!cardEntry) {
      return FALLBACK_TEXT;
    }

    const text = extractText(cardEntry, orientation, lang);
    return text || FALLBACK_TEXT;
  } catch (error) {
    console.error(
      `[kbRouter] Q${questionId}, card ID ${cardId}, orientation: ${orientation}:`,
      error
    );
    return FALLBACK_TEXT;
  }
}

async function getReadingFromKBForCards(questionId, selectedCards, language) {
  if (!Array.isArray(selectedCards)) {
    return [await getReadingFromKB(questionId, selectedCards, language)];
  }

  const results = await Promise.all(
    selectedCards.map((card) => getReadingFromKB(questionId, card, language))
  );

  if (questionId === 10) {
    return results.map((reading, idx) => ({
      month: MONTHS[idx] || `Month ${idx + 1}`,
      monthIndex: idx + 1,
      cardName: cardToName(selectedCards[idx]) || (cardToId(selectedCards[idx]) ? `#${cardToId(selectedCards[idx])}` : "Unknown Card"),
      orientation: cardToOrientation(selectedCards[idx]),
      reading
    }));
  }

  return results.map((reading, idx) => ({
    cardId: cardToId(selectedCards[idx]),
    cardName: cardToName(selectedCards[idx]),
    orientation: cardToOrientation(selectedCards[idx]),
    reading
  }));
}

export {
  getReadingFromKB,
  getReadingFromKBForCards,
  QUESTION_TO_FILE,
  KB_BASE_URL,
  SUPPORTED_LANGUAGES,
  SUPPORTED_ORIENTATIONS,
  FALLBACK_TEXT,
  MONTHS
};

export default {
  getReadingFromKB,
  getReadingFromKBForCards,
  QUESTION_TO_FILE,
  KB_BASE_URL,
  SUPPORTED_LANGUAGES,
  SUPPORTED_ORIENTATIONS,
  FALLBACK_TEXT,
  MONTHS
};
