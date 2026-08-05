import {
  getReadingFromKB,
  getReadingFromKBForCards,
  QUESTION_TO_FILE,
  MONTHS,
  FALLBACK_TEXT,
  SUPPORTED_LANGUAGES,
  SUPPORTED_ORIENTATIONS,
  KB_BASE_URL
} from "./kbRouter";

const TOTAL_MONTHS = 12;

async function fetchCardReading(questionId, card, selectedLanguage) {
  if (questionId == null || QUESTION_TO_FILE[questionId] == null) {
    return FALLBACK_TEXT;
  }

  if (!card || typeof card !== "object") {
    return FALLBACK_TEXT;
  }

  return getReadingFromKB(questionId, card, selectedLanguage);
}

async function fetchYearlySpread(selectedCards, selectedLanguage) {
  const results = [];
  const readings = await getReadingFromKBForCards(10, selectedCards, selectedLanguage);

  for (let i = 0; i < readings.length; i++) {
    const r = readings[i];
    results.push({
      month: r.month,
      monthIndex: r.monthIndex,
      cardName: r.cardName,
      orientation: r.orientation,
      reading: r.reading
    });
  }

  while (results.length < TOTAL_MONTHS) {
    const idx = results.length;
    results.push({
      month: MONTHS[idx] || `Month ${idx + 1}`,
      monthIndex: idx + 1,
      cardName: "Not drawn",
      orientation: "upright",
      reading: `${MONTHS[idx] || `Month ${idx + 1}`}: Not drawn - ${FALLBACK_TEXT}`
    });
  }

  return results;
}

async function generateReading(questionId, selectedCards, selectedLanguage) {
  if (questionId === 10) {
    return fetchYearlySpread(selectedCards, selectedLanguage);
  }

  return getReadingFromKBForCards(questionId, selectedCards, selectedLanguage);
}

async function generateCombinedReading(questionId, selectedCards, selectedLanguage) {
  const results = await generateReading(questionId, selectedCards, selectedLanguage);

  if (Array.isArray(results)) {
    return results
      .map((r) => r.reading)
      .filter((r) => r && r !== FALLBACK_TEXT)
      .join("\n\n");
  }

  return String(results);
}

export {
  fetchCardReading,
  fetchYearlySpread,
  generateReading,
  generateCombinedReading,
  QUESTION_TO_FILE,
  MONTHS,
  FALLBACK_TEXT,
  SUPPORTED_LANGUAGES,
  SUPPORTED_ORIENTATIONS,
  KB_BASE_URL
};

export default {
  fetchCardReading,
  fetchYearlySpread,
  generateReading,
  generateCombinedReading,
  QUESTION_TO_FILE,
  MONTHS,
  FALLBACK_TEXT,
  SUPPORTED_LANGUAGES,
  SUPPORTED_ORIENTATIONS,
  KB_BASE_URL
};
