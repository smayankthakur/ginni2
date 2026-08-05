import { TRUMPS, SUITS, NUMBERED_CARDS, COURT_CARDS } from "./tarotDeck";

const CARD_DECK = (() => {
  const deck = [];
  for (const trump of TRUMPS) {
    deck.push(trump);
  }
  for (const suit of SUITS) {
    for (const rank of NUMBERED_CARDS) {
      deck.push(`${rank} of ${suit}`);
    }
    for (const rank of COURT_CARDS) {
      deck.push(`${rank} of ${suit}`);
    }
  }
  return deck;
})();

const CARD_ID_MAP = {};
CARD_DECK.forEach((name, index) => {
  CARD_ID_MAP[name] = index + 1;
});

function getCardIdByName(name) {
  if (!name || typeof name !== "string") return null;
  return CARD_ID_MAP[name] || null;
}

function getCardNameById(id) {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  if (!numericId || numericId < 1 || numericId > 78) return null;
  return CARD_DECK[numericId - 1] || null;
}

function cardToId(card) {
  if (!card) return null;
  if (card.id != null && !isNaN(card.id)) {
    const id = parseInt(card.id, 10);
    if (id >= 1 && id <= 78) return id;
  }
  if (card.name) return getCardIdByName(card.name);
  return null;
}

function cardToName(card) {
  if (!card) return null;
  if (card.name) return card.name;
  const id = cardToId(card);
  return id ? getCardNameById(id) : null;
}

function cardToOrientation(card) {
  if (!card) return "upright";
  if (typeof card.orientation === "string") {
    return card.orientation.toLowerCase();
  }
  if (typeof card.reversed === "boolean") {
    return card.reversed ? "reversed" : "upright";
  }
  return "upright";
}

export { CARD_DECK, CARD_ID_MAP, getCardIdByName, getCardNameById, cardToId, cardToName, cardToOrientation };
