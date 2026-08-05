import { TRUMPS, SUITS, COURT_CARDS, NUMBERED_CARDS } from "../utils/tarotDeck";

export const QUESTIONS = [
  {
    number: 1,
    title: "Unki Current Feelings For You",
    description: "Discover what your partner is feeling right now",
    cardCount: 1,
    topicKey: "partner_feelings",
    icon: "💖",
    color: "from-gold/20 via-gold/20 to-mystic/20"
  },
  {
    number: 2,
    title: "Unke Next Actions",
    description: "See what steps your partner will take next",
    cardCount: 1,
    topicKey: "partner_action",
    icon: "⚡",
    color: "from-mystic/20 via-mystic/20 to-gold/20"
  },
  {
    number: 3,
    title: "Aapke Crush Ki Current Feelings For You",
    description: "Understand your crush's current emotions",
    cardCount: 1,
    topicKey: "partner_feelings",
    icon: "💌",
    color: "from-gold/20 via-gold/20 to-rose/20"
  },
  {
    number: 4,
    title: "Aapke Crush ka Next actions",
    description: "What will your crush do next?",
    cardCount: 1,
    topicKey: "partner_action",
    icon: "🎯",
    color: "from-rose/20 via-rose/20 to-gold/20"
  },
  {
    number: 5,
    title: "Yes or No",
    description: "Get a clear yes or no answer with guidance",
    cardCount: 1,
    topicKey: "yes_no",
    icon: "❓",
    color: "from-amber-500/20 via-amber-500/20 to-gold/20"
  },
  {
    number: 6,
    title: "Third Party or Unke Bich kya chal raha hai",
    description: "Discover what's happening between them",
    cardCount: 1,
    topicKey: "third_party_end",
    icon: "🔮",
    color: "from-mystic/20 via-mystic/20 to-gold/20"
  },
  {
    number: 7,
    title: "Aapka aaj ka din kaisa rahega",
    description: "How will your day unfold today?",
    cardCount: 1,
    topicKey: "daily",
    icon: "☀️",
    color: "from-gold/20 via-gold/20 to-amber-500/20"
  },
  {
    number: 8,
    title: "Aapki spritual journey kaunsi hai",
    description: "Learn about your spiritual path ahead",
    cardCount: 1,
    topicKey: "universe_guidance",
    icon: "🌟",
    color: "from-rose/20 via-rose/20 to-gold/20"
  },
  {
    number: 9,
    title: "Aapka mahina kaisa rahega",
    description: "What does the coming month hold for you?",
    cardCount: 1,
    topicKey: "monthly",
    icon: "📅",
    color: "from-green-500/20 via-green-500/20 to-gold/20"
  },
  {
    number: 10,
    title: "Aapka pura saal kaisa rahega",
    description: "12-card yearly forecast for all 12 months",
    cardCount: 12,
    topicKey: "monthly",
    icon: "🗓️",
    color: "from-gold/20 via-gold/20 to-mystic/20"
  }
];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function buildFullDeck() {
  const deck = [];
  for (const trump of TRUMPS) {
    deck.push({ name: trump, type: "trump", suit: null, rank: null });
  }
  for (const suit of SUITS) {
    for (const rank of NUMBERED_CARDS) {
      deck.push({ name: `${rank} of ${suit}`, type: "minor", suit, rank });
    }
    for (const rank of COURT_CARDS) {
      deck.push({ name: `${rank} of ${suit}`, type: "minor", suit, rank });
    }
  }
  return deck;
}

export function shuffleAndDraw(count) {
  const deck = buildFullDeck();
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const drawn = shuffled.slice(0, count).map((card) => ({
    ...card,
    reversed: Math.random() < 0.5
  }));
  return drawn;
}
