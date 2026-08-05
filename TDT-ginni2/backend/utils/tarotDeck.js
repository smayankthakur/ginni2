const TRUMPS = [
  "The Fool", "The Magician", "The High Priestess", "The Empress",
  "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
  "Strength", "The Hermit", "Wheel of Fortune", "Justice",
  "The Hanged Man", "Death", "Temperance", "The Devil",
  "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

const SUITS = ["Wands", "Cups", "Swords", "Pentacles"];
const COURT_CARDS = ["Page", "Knight", "Queen", "King"];
const NUMBERED_CARDS = ["Ace", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten"];

function buildDeck() {
  const deck = [];
  for (const trump of TRUMPS) {
    deck.push({ name: trump, type: "trump", suit: null, rank: null });
  }
  for (const suit of SUITS) {
    for (const rank of NUMBERED_CARDS) {
      const name = `${rank} of ${suit}`;
      deck.push({ name, type: "minor", suit, rank });
    }
    for (const rank of COURT_CARDS) {
      const name = `${rank} of ${suit}`;
      deck.push({ name, type: "minor", suit, rank });
    }
  }
  return deck;
}

const FULL_DECK = buildDeck();

function shuffleDeck(deck = FULL_DECK) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function drawCards(count, allowReversals = true) {
  const shuffled = shuffleDeck();
  const drawn = [];
  for (let i = 0; i < count; i++) {
    const card = shuffled[i];
    const reversed = allowReversals ? Math.random() < 0.5 : false;
    drawn.push({ ...card, reversed });
  }
  return drawn;
}

const CARD_KEYWORDS = {
  "The Fool": ["new beginnings", "innocence", "spontaneity"],
  "The Magician": ["manifestation", "power", "skill"],
  "The High Priestess": ["intuition", "mystery", "subconscious"],
  "The Empress": ["nature", "abundance", "nurturing"],
  "The Emperor": ["authority", "structure", "stability"],
  "The Hierophant": ["tradition", "spirituality", "teaching"],
  "The Lovers": ["love", "partnership", "choice"],
  "The Chariot": ["willpower", "victory", "control"],
  "Strength": ["courage", "inner strength", "compassion"],
  "The Hermit": ["introspection", "solitude", "wisdom"],
  "Wheel of Fortune": ["change", "cycles", "fate"],
  "Justice": ["fairness", "truth", "karma"],
  "The Hanged Man": ["surrender", "perspective", "patience"],
  "Death": ["transformation", "ending", "rebirth"],
  "Temperance": ["balance", "healing", "moderation"],
  "The Devil": ["attachment", "shadow", "limitation"],
  "The Tower": ["upheaval", "revelation", "breakthrough"],
  "The Star": ["hope", "faith", "healing"],
  "The Moon": ["illusion", "subconscious", "emotions"],
  "The Sun": ["joy", "success", "clarity"],
  "Judgement": ["awakening", "judgment", "redemption"],
  "The World": ["completion", "fulfillment", "wholeness"]
};

const SUIT_KEYWORDS = {
  Wands: ["fire", "passion", "energy", "creativity", "action"],
  Cups: ["water", "emotions", "love", "relationships", "intuition"],
  Swords: ["air", "thoughts", "conflict", "communication", "truth"],
  Pentacles: ["earth", "material", "wealth", "work", "practicality"]
};

module.exports = {
  TRUMPS,
  SUITS,
  COURT_CARDS,
  NUMBERED_CARDS,
  FULL_DECK,
  CARD_KEYWORDS,
  SUIT_KEYWORDS,
  shuffleDeck,
  drawCards
};
