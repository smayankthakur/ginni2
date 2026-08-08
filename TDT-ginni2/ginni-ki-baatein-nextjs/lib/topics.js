// The 78-card deck, spelled exactly as the reading JSON keys.
export const DECK = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune",
  "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star",
  "The Moon", "The Sun", "Judgement", "The World",
  ...["Cups", "Pentacles", "Swords", "Wands"].flatMap((suit) =>
    ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"].map(
      (rank) => `${rank} of ${suit}`
    )
  ),
];

// Each topic: id, title, number of cards drawn, and which JSON module powers it.
// Topics 1&3 and 2&4 intentionally share one data source (only one "partner"
// style reading set exists; the crush framing reuses it). Topic 7 temporarily
// reuses the universe-guidance deck as a placeholder — its own source document
// uploaded empty and needs to be re-supplied.
export const TOPICS = [
  { id: 1, title: "Unki Current Feelings For You", cards: 1, dataKey: "partnerFeelings", prompt: "Ek card draw karo aur dekho abhi unke dil mein kya chal raha hai." },
  { id: 2, title: "Unke Next Actions", cards: 1, dataKey: "partnerAction", prompt: "Ek card draw karo — wo aage kya kadam lene wale hain." },
  { id: 3, title: "Aapke Crush Ki Current Feelings For You", cards: 1, dataKey: "partnerFeelings", prompt: "Ek card draw karo aur dekho abhi unke dil mein kya chal raha hai." },
  { id: 4, title: "Aapke Crush Ka Next Actions", cards: 1, dataKey: "partnerAction", prompt: "Ek card draw karo — wo aage kya kadam lene wale hain." },
  { id: 5, title: "Yes or No", cards: 1, dataKey: "yesNo", prompt: "Apna sawaal mann mein socho, phir ek card draw karo." },
  { id: 6, title: "Third Party Ya Unke Beech Kya Chal Raha Hai", cards: 1, dataKey: "thirdParty", prompt: "Ek card draw karo aur dekho situation kab tak clear hogi." },
  { id: 7, title: "Aapka Aaj Ka Din Kaisa Rahega", cards: 1, dataKey: "dailyPlaceholder", prompt: "Ek card draw karo — aaj universe ka message kya hai.", placeholder: true },
  { id: 8, title: "Aapki Spiritual Journey Kaunsi Hai", cards: 1, dataKey: "spiritualJourney", prompt: "Ek card draw karo aur apni spiritual journey ka naam jaano." },
  { id: 9, title: "Aapka Mahina Kaisa Rahega", cards: 1, dataKey: "monthly", prompt: "Ek card draw karo — is mahine ka overview." },
  { id: 10, title: "Aapka Pura Saal Kaisa Rahega", cards: 12, dataKey: "monthly", prompt: "Apne 12 cards choose karo — ek-ek karke, sabhi 12 mahino ke liye. Jab 12 ho jayenge, tumhara pura saal ka reading ek saath dikhega." },
];

export const LANG_LABEL = { hinglish: "Hinglish", english: "English", hindi: "Hindi" };

// Turns a card name into its image filename, e.g. "The Fool" -> "the-fool",
// "Ace of Cups" -> "ace-of-cups". Matches every file in public/cards/.
export function cardSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const UNAVAILABLE_MESSAGE = {
  hinglish: "Yeh reading abhi Hinglish mein available nahi hai.",
  english: "This reading isn't available in English yet.",
  hindi: "यह रीडिंग अभी हिंदी में उपलब्ध नहीं है।",
};
