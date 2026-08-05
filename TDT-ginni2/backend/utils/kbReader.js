const fs = require("fs");
const path = require("path");

const KB_DIR = path.join(__dirname, "..", "..", "ginni-kb");

let indexCache = null;
let fileCache = {};

function loadIndex() {
  if (!indexCache) {
    const raw = fs.readFileSync(path.join(KB_DIR, "index.json"), "utf-8");
    indexCache = JSON.parse(raw);
  }
  return indexCache;
}

function loadTopicFile(filename) {
  if (fileCache[filename]) return fileCache[filename];
  const fullPath = path.join(KB_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const data = JSON.parse(raw);
  fileCache[filename] = data;
  return data;
}

const QUESTION_MAP = {
  1: {
    title: "Unki Current Feelings For You",
    topicKey: "partner_feelings",
    cardCount: 1
  },
  2: {
    title: "Unke Next Actions",
    topicKey: "partner_action",
    cardCount: 1
  },
  3: {
    title: "Aapke Crush Ki Current Feelings For You",
    topicKey: "partner_feelings",
    cardCount: 1
  },
  4: {
    title: "Aapke Crush ka Next actions",
    topicKey: "partner_action",
    cardCount: 1
  },
  5: {
    title: "Yes or No",
    topicKey: "yes_no",
    cardCount: 1
  },
  6: {
    title: "Third Party or Unke Bich kya chal raha hai",
    topicKey: "third_party_end",
    cardCount: 1
  },
  7: {
    title: "Aapka aaj ka din kaisa rahega",
    topicKey: "daily",
    cardCount: 1
  },
  8: {
    title: "Aapki spritual journey kaunsi hai",
    topicKey: "universe_guidance",
    cardCount: 1
  },
  9: {
    title: "Aapka mahina kaisa rahega",
    topicKey: "monthly",
    cardCount: 1
  },
  10: {
    title: "Aapka pura saal kaisa rahega",
    topicKey: "monthly",
    cardCount: 12
  }
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getQuestion(questionNumber) {
  return QUESTION_MAP[questionNumber] || null;
}

function getTopicFile(topicKey) {
  const index = loadIndex();
  const topic = index.topics.find((t) => t.key === topicKey);
  if (!topic) return null;
  return topic;
}

function getCardInterpretation(cardName, topicKey) {
  const topic = getTopicFile(topicKey);
  if (!topic) return null;
  const data = loadTopicFile(topic.file);
  return data[cardName] || null;
}

function getDeckInfo() {
  const index = loadIndex();
  return {
    deck: index.deck,
    topics: index.topics.map((t) => ({
      key: t.key,
      label: t.label,
      file: t.file,
      cards: t.cards,
      missing: t.missing
    })),
    generated: index.generated
  };
}

function getAllTopics() {
  const index = loadIndex();
  return index.topics;
}

module.exports = {
  KB_DIR,
  QUESTION_MAP,
  MONTHS,
  loadIndex,
  loadTopicFile,
  getQuestion,
  getTopicFile,
  getCardInterpretation,
  getDeckInfo,
  getAllTopics
};
