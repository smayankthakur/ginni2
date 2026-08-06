/**
 * Converts new-format KB JSON files (card-ID keyed) to old-format
 * (card-name keyed, single multi-language string) for backend compatibility.
 *
 * Run: node ginni-kb/convert-kb.js
 */
const fs = require("fs");
const path = require("path");

const KB_DIR = __dirname;

const TRUMPS = [
  "The Fool", "The Magician", "The High Priestess", "The Empress",
  "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
  "Strength", "The Hermit", "Wheel of Fortune", "Justice",
  "The Hanged Man", "Death", "Temperance", "The Devil",
  "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

const SUITS = ["Wands", "Cups", "Swords", "Pentacles"];
const NUMBERED = ["Ace", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten"];
const COURT = ["Page", "Knight", "Queen", "King"];

const DECK = [];
for (const t of TRUMPS) DECK.push(t);
for (const s of SUITS) {
  for (const r of NUMBERED) DECK.push(`${r} of ${s}`);
  for (const r of COURT) DECK.push(`${r} of ${s}`);
}

const CONVERSIONS = {
  "daily_reading.json": "daily.json",
  "third_party.json": "third_party_end.json"
};

for (const [newFile, oldFile] of Object.entries(CONVERSIONS)) {
  const newPath = path.join(KB_DIR, newFile);
  const oldPath = path.join(KB_DIR, oldFile);

  if (!fs.existsSync(newPath)) {
    console.log(`Skip ${newFile} — not found`);
    continue;
  }

  const newData = JSON.parse(fs.readFileSync(newPath, "utf-8"));
  const oldData = {};

  for (let i = 0; i < DECK.length; i++) {
    const cardId = String(i + 1);
    const cardName = DECK[i];
    const entry = newData[cardId];
    if (entry) {
      const en = entry.upright?.english || "";
      const hi = entry.upright?.hindi || "";
      const hin = entry.upright?.hinglish || "";
      oldData[cardName] = `English:\n${en}\nHINDI:\n${hi}\nHinglish:\n${hin}`;
    } else {
      oldData[cardName] = `English:\nNo specific interpretation available.\nHINDI:\nकोई विशिष्ट व्याख्या उपलब्ध नहीं है।\nHinglish:\nKoi specific interpretation available nahi hai.`;
    }
  }

  fs.writeFileSync(oldPath, JSON.stringify(oldData, null, 2), "utf-8");
  console.log(`Converted: ${newFile} → ${oldFile} (${DECK.length} cards)`);
}

console.log("\nConversion complete.");
