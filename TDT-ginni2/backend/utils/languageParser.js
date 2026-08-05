const fs = require("fs");
const path = require("path");

const KB_DIR = path.join(__dirname, "..", "..", "ginni-kb");

function parseInterpretation(rawText, language = "hinglish") {
  if (!rawText) return rawText;

  const text = String(rawText).trim();

  const languageMarkers = {
    english: ["English:", "ENGLISH:"],
    hindi: ["HINDI:", "Hindi:"],
    hinglish: ["Hinglish:", "HINGLISH:"]
  };

  const markers = languageMarkers[language] || languageMarkers.hinglish;

  for (const marker of markers) {
    const idx = text.indexOf(marker);
    if (idx !== -1) {
      let start = idx + marker.length;
      let end = text.length;

      const nextMarkerPatterns = [
        "Hinglish:", "HINGLISH:", "English:", "ENGLISH:", "Hindi:", "HINDI:"
      ];

      for (const nextMarker of nextMarkerPatterns) {
        const nextIdx = text.indexOf(nextMarker, start);
        if (nextIdx !== -1) {
          end = Math.min(end, nextIdx);
        }
      }

      const extracted = text.substring(start, end).trim();
      if (extracted.length > 5) {
        return extracted;
      }
    }
  }

  const yesNoPattern = /(YES|NO|MAYBE)\s*GUIDANCE\s*-\s*/i;
  if (yesNoPattern.test(text)) {
    const lines = text.split("\n");
    const filtered = lines.filter(line => {
      const lower = line.toLowerCase();
      if (lower.includes("wands:-") || lower.includes("cups:-")) return false;
      if (lower.includes("swords:-") || lower.includes("pentacles:-")) return false;
      if (/^(ace|two|three|four|five|six|seven|eight|nine|ten|page|knight|queen|king)\s+of/.test(lower.trim())) return false;
      return true;
    });
    const cleaned = filtered.join("\n").replace(/\n\s*\n/g, "\n\n").trim();
    if (cleaned.length > 5) return cleaned;
  }

  return text;
}

function getTopicFile(topicKey) {
  const indexPath = path.join(KB_DIR, "index.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  const topic = index.topics.find((t) => t.key === topicKey);
  return topic || null;
}

function getCardInterpretation(cardName, topicKey) {
  const topic = getTopicFile(topicKey);
  if (!topic) return null;
  const filePath = path.join(KB_DIR, topic.file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data[cardName] || null;
}

function getAllTopics() {
  const indexPath = path.join(KB_DIR, "index.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  return index.topics;
}

module.exports = {
  KB_DIR,
  parseInterpretation,
  getTopicFile,
  getCardInterpretation,
  getAllTopics
};
