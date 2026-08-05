/**
 * Generates KB JSON files with the new card-ID-based, multi-language,
 * orientation-aware structure.
 *
 * Run: node ginni-kb/generate-kb.js
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

function buildDeck() {
  const deck = [];
  for (const t of TRUMPS) deck.push(t);
  for (const s of SUITS) {
    for (const r of NUMBERED) deck.push(`${r} of ${s}`);
    for (const r of COURT) deck.push(`${r} of ${s}`);
  }
  return deck;
}

const DECK = buildDeck();

// Base meanings per card — used as seed content.
// Each card has upright/reversed in english, hindi, hinglish.
const BASE_MEANINGS = {
  "The Fool": {
    upright: {
      english: "New beginnings, spontaneity, and a leap of faith. Embrace the unknown with an open heart.",
      hindi: "नई शुरुआत, स्वाभाविकता और विश्वास की झलक। अपने दिल से अज्ञात की ओर बढ़ें।",
      hinglish: "Nayi shuruaat, spontaneity, aur ek leap of faith. Apne dil se unknown ki taraf badhein."
    },
    reversed: {
      english: "Hold off on new ventures. Reckless decisions may lead to setbacks.",
      hindi: "नई शुरुआतों को थोड़ा टाल दें। बेपरवाह फैसलों से बाधा आ सकती है।",
      hinglish: "Naye projects ko thoda taal do. Reckless decisions se baaadhiya issues ho sakti hain."
    }
  },
  "The Magician": {
    upright: {
      english: "You have the power and resources to manifest your desires right now.",
      hindi: "आपके पास अपनी इच्छाएँ पूरे करने की शक्ति और संसाधन हैं।",
      hinglish: "Tumhare paas power aur resources hain to manifest karne ke liye."
    },
    reversed: {
      english: "Misused power or untapped potential. Reassess your tools and intentions.",
      hindi: "गलत उपयोग की गई शक्ति या अनस्टेम्ड संभावना। अपने उपकरण और इरादों को दोबारा मूल्यांकन करें।",
      hinglish: "Galat tarah se power ka upyog ho raha hai ya potential wasted ho raha hai. Wapas dhundho."
    }
  },
  "The High Priestess": {
    upright: {
      english: "Trust your intuition and listen to what your subconscious reveals.",
      hindi: "अपनी अंतर्ज्ञान पर भरोसा करें और यह सुनें कि आपका अंतःकरण क्या प्रकाशित करता है।",
      hinglish: "Apni intuition par bharosa rakho aur suno ki andar ka kya keh raha hai."
    },
    reversed: {
      english: "Hidden truths may surface. Be open to messages from within.",
      hindi: "छिपी सत्यें सामने आ सकती हैं। अंदर से संदेशों के लिए तैयार रहें।",
      hinglish: "Chhupi baatein surface ho sakti hain. Andar ke signals suno."
    }
  },
  "The Empress": {
    upright: {
      english: "Abundance, nurturing, and nature's bounty surround you.",
      hindi: "पर्यावरणीय उपलब्धता, संरक्षण और प्रकृति की धन-धान्य से घिरे हुए हैं।",
      hinglish: "Abundance, nurturing, aur nature ki kampani aapke saath hai."
    },
    reversed: {
      english: "Neglect of self-care or creative blocks ahead.",
      hindi: "स्वयं-देखास्ती के अधिकार या रचनात्मक अवरोध।",
      hinglish: "Self-care ka dhyaan nahi dena ya creativity block hone wali hai."
    }
  },
  "The Emperor": {
    upright: {
      english: "Structure, authority, and disciplined leadership guide your path.",
      hindi: "संरचना, प्राधिकार और अनुशासित नेतृत्व आपके मार्ग की दिशा निर्धारित करता है।",
      hinglish: "Structure, authority, aur disciplined leadership tumhare raaste ko lead karti hai."
    },
    reversed: {
      english: "Domination or misuse of power. Seek balance over control.",
      hindi: "प्रतिपश्चर या शक्ति के दुरुपयोग। नियंत्रण के बजाय संतुलन ढूंढें।",
      hinglish: "Domination ya power ka galat istemaal ho raha hai. Control se bhi balance dhundho."
    }
  },
  "The Hierophant": {
    upright: {
      english: "Tradition, spiritual wisdom, and mentorship bring clarity.",
      hindi: "परंपरा, आध्यात्मिक ज्ञान और मार्गदर्शन स्पष्टता लाता है।",
      hinglish: "Tradition, spiritual wisdom, aur mentorship se clarity milti hai."
    },
    reversed: {
      english: "Question old beliefs. Personal truth may diverge from doctrine.",
      hindi: "पुराने विश्वासों के सवाल उठाएं। व्यक्तिगत सत्य धर्म से भिन्न हो सकता है।",
      hinglish: "Purane beliefs ko question karo. Personal truth doctrine se alag ho sakta hai."
    }
  },
  "The Lovers": {
    upright: {
      english: "Harmony, partnership, and heartfelt choices align your path.",
      hindi: "सद्भावना, साझेदारी और दिल से चुने गए विकल्प आपके मार्ग को संरेखित करते हैं।",
      hinglish: "Harmony, partnership, aur heartfelt choices tumhare liye theek ho jayein."
    },
    reversed: {
      english: "Misalignment or difficult choices in relationships. Reassess priorities.",
      hindi: "रिश्तों में असंरेखण या कठिन विकल्प। प्राथमिकताओं का फिर से मूल्यांकन करें।",
      hinglish: "Relationship mein misalignment ya mushkil choices. Priorities dobara dekho."
    }
  },
  "The Chariot": {
    upright: {
      english: "Willpower, determination, and victory through focused effort.",
      hindi: "ज़िद, दृढ़ संकल्प और केंद्रित प्रयास से जीत मिलती है।",
      hinglish: "Willpower, determination, aur focus se jeet milegi."
    },
    reversed: {
      english: "Lack of direction. Channel your energy more strategically.",
      hindi: "दिशा की कमी। अपनी ऊर्जा को अधिक रणणीतिक रूप से इस्तेमाल करें।",
      hinglish: "Direction nahi hai. Energy ko thoda strategically use karo."
    }
  },
  "Strength": {
    upright: {
      english: "Inner courage, compassion, and gentle resilience prevail.",
      hindi: "अंतःकरण का साहस, करुणा और कोमल ढ़ैली प्रबल होती है।",
      hinglish: "Inner courage, compassion, aur gentle resilience jeet jayegi."
    },
    reversed: {
      english: "Self-doubt or inner weakness. Tap into your quiet strength.",
      hindi: "आत्मविश्वास की कमी या आंतरिक कमजोरी। अपनी शांत शक्ति का उपयोग करें।",
      hinglish: "Self-doubt ya inner weakness ho sakta hai. apni quiet strength yaad karo."
    }
  },
  "The Hermit": {
    upright: {
      english: "Solitude and introspection light the way forward.",
      hindi: "एकांत और आत्म-चिंतन आगे बढ़ने के रास्ते को रोशन करता है।",
      hinglish: "Solitude aur introspection aage badhne ka raasta dikhayein."
    },
    reversed: {
      english: "Isolation or loneliness. Seek connection and guidance.",
      hindi: "एकांत या अकेलापन। सेहो बढ़न और मार्गदर्शन खोजें।",
      hinglish: "Isolation ya loneliness ho sakta hai. Connection aur guidance dhundho."
    }
  },
  "Wheel of Fortune": {
    upright: {
      english: "Cycles turn in your favor. Embrace the changing tides.",
      hindi: "चक्र आपके पक्ष में घूम रहे हैं। बदलती धारा को अपनाएं।",
      hinglish: "Cycles aapke favour mein badal rahe hain. Changes ko embrace karo."
    },
    reversed: {
      english: "Resistance to change. Luck may feel blocked temporarily.",
      hindi: "बदलाव का विरोध। खुशी अस्थायी रूप से ब्लॉक्ड महसूस हो सकती है।",
      hinglish: "Change se problem ho raha hai. Luck thoda temporarily block ho sakti hai."
    }
  },
  "Justice": {
    upright: {
      english: "Truth, fairness, and karmic balance bring resolution.",
      hindi: "सत्य, न्याय और कार्मिक संतुलन से समाधान मिलता है।",
      hinglish: "Truth, fairness, aur karma se sab theek ho jayega."
    },
    reversed: {
      english: "Injustice or bias. Strive for clarity and accountability.",
      hindi: "अन्याय या पक्षपात। स्पष्टता और जिम्मेदारी के लिए प्रयास करें।",
      hinglish: "Injustice ya bias ho sakta hai. Clarity aur accountability dhundho."
    }
  },
  "The Hanged Man": {
    upright: {
      english: "Voluntary pause and new perspective reveal hidden truths.",
      hindi: "स्वैच्छिक विराम और नई दृष्टि से छिपी सत्यें प्रकट होती हैं।",
      hinglish: "Volunteer pause aur new perspective se hidden truths milti hain."
    },
    reversed: {
      english: "Forced delay or stubbornness. Let go and move forward.",
      hindi: "बाध्यकारी देरी या ज़िद। छोड़ दें और आगे बढ़ें।",
      hinglish: "Forced delay ya stubbornness ho sakta hai. Let go karo aur aage badho."
    }
  },
  "Death": {
    upright: {
      english: "Endings make space for powerful new beginnings.",
      hindi: "समाप्ति शक्तिशाली नई शुरुआत के लिए जगह बनाती है।",
      hinglish: "Endings se bhi better nayi shuruaat hoti hai."
    },
    reversed: {
      english: "Resistance to necessary change. Accept the transformation.",
      hindi: "आवश्यक बदलाव का विरोध। ट्रांसफॉर्मेशन स्वीकार करें।",
      hinglish: "Necessary change se darr mat lage. Transformation accept karo."
    }
  },
  "Temperance": {
    upright: {
      english: "Balance, moderation, and healing guide this phase.",
      hindi: "संतुलन, मध्यस्थता और स्वास्थ्य इस चरण की दिशा निर्धारित करता है।",
      hinglish: "Balance, moderation, aur healing is phase ko guide karte hain."
    },
    reversed: {
      english: "Imbalance or excess. Restore harmony within yourself.",
      hindi: "असंतुलन या अत्यधिक। अपने भीतर सद्भावना बहती है।",
      hinglish: "Imbalance ya excess ho sakta hai. Apne andar harmony le aao."
    }
  },
  "The Devil": {
    upright: {
      english: "Acknowledge shadow patterns and attachments holding you back.",
      hindi: "उन बंधनों को मानें जो आपको पीछे धकेल रहे हैं।",
      hinglish: "Shadow patterns aur attachments ko pehchaano jo tumhe peeche dhakel rahe hain."
    },
    reversed: {
      english: "Breaking free from bondage and harmful dependencies.",
      hindi: "हानीकारक निर्भरता से मुक्ति पाना।",
      hinglish: "Bondage aur harmful dependencies se free ho jao."
    }
  },
  "The Tower": {
    upright: {
      english: "Sudden upheaval clears the way for authentic rebuilding.",
      hindi: "अचानक बिगड़ोहल ईमानदार रीबिल्डिंग के रास्ते को साफ करती है।",
      hinglish: "Sudden upheaval se clear hota hai ki kya sachcha banana hai."
    },
    reversed: {
      english: "Avoid or delay the inevitable crash. Prepare wisely.",
      hindi: "अनिवार्य दुर्घटन से बचें या इसे टालें। समझदारी से तैयार रहें।",
      hinglish: "Inevitable crash se bachna pad sakta hai. Smartly prepare karo."
    }
  },
  "The Star": {
    upright: {
      english: "Hope, healing, and renewed faith illuminate your path.",
      hindi: "उम्मीद, ठीय और नवीन विश्वास आपके मार्ग को रोशन करता है।",
      hinglish: "Hope, healing, aur faith se tumhara raasta ujal manega."
    },
    reversed: {
      english: "Momentary loss of hope. Reconnect with inner light.",
      hindi: "उम्मीद की अस्थायी कमी। आंतरिक प्रकाश के साथ फिर से जुड़ें।",
      hinglish: "Thoda sa hope lose ho gaya ho sakta hai. Apne inner light se judo."
    }
  },
  "The Moon": {
    upright: {
      english: "Illusions and subconscious fears rise to the surface.",
      hindi: "भावना और अंतःकरण के डर सतह पर उठते हैं।",
      hinglish: "Illusions aur subconscious fears surface ho rahe hain."
    },
    reversed: {
      english: "Confusion lifts. Trust your inner truth to guide you.",
      hindi: "उलझन दूर होती है। आपकी आंतरिक सत्य का विश्वास करें।",
      hinglish: "Confusion door ho jati hai. Apni inner truth par bharosa karo."
    }
  },
  "The Sun": {
    upright: {
      english: "Joy, success, and radiant clarity brighten everything.",
      hindi: "खुशी, सफलता और उज्ज्वल स्पष्टता सब कुछ को रोशन करती है।",
      hinglish: "Joy, success, aur clarity sab kuchh bright karte hain."
    },
    reversed: {
      english: "Overconfidence or burnout. Stay grounded and balanced.",
      hindi: "अत्यधिक आत्मविश्वास या थकान। नींह पड़े और संतुलित रहें।",
      hinglish: "Overconfidence ya burnout ho sakta hai. Ground pe raho aur balanced baitho."
    }
  },
  "Judgement": {
    upright: {
      english: "Awakening and inner calling bring renewal and redemption.",
      hindi: "जागरण और आंतरिक आवाज़ नवीनीकरण और पुनर्मुक्ति लाती है।",
      hinglish: "Awakening aur inner calling se renewal milta hai."
    },
    reversed: {
      english: "Avoid self-judgment. Forgive past choices and move on.",
      hindi: "स्वयं का निर्णय न करें। गुस्सा आत्म-निर्णय और आगे बढ़ें।",
      hinglish: "Self-judgment se bachna. Past choices ko forgive karo aur aage badho."
    }
  },
  "The World": {
    upright: {
      english: "Completion, wholeness, and fulfillment close this cycle.",
      hindi: " समाप्ति, पूर्णता और परिपूर्णता इस चक्र को समाप्त करती है।",
      hinglish: "Completion, wholeness, aur fulfillment is cycle ko khatam karti hain."
    },
    reversed: {
      english: "Feeling incomplete. Reassess what true success means.",
      hindi: "अधूरा महसूस होना। सच्चे सफलता का मतलब फिर से जांचें।",
      hinglish: "Feeling incomplete ho sakta hai. True success ka matlab dobara socho."
    }
  },
  "Ace of Wands": {
    upright: {
      english: "A spark of inspiration and creative energy ignites action.",
      hindi: "प्रेरणा और रचनात्मक ऊर्जा से कार्रवाई जलती है।",
      hinglish: "Nayi shurwaah aur zyaada energy se action shuru karo."
    },
    reversed: {
      english: "Delayed energy or lack of inspiration. Wait for the right spark.",
      hindi: " विलंबित ऊर्जा या प्रेरणा की कमी। सही प्रज्वलन का इंतजार करें।",
      hinglish: "Energy thodi late hone wali hai ya inspiration kam ho sakti hai. Sahi waqt ka intezaar karo."
    }
  }
};

const FALLBACK_MEANING = {
  upright: {
    english: "This card signals positive movement and clarity in your situation.",
    hindi: "यह कार्ड आपकी स्थिति में सकारात्मक गति और स्पष्टता दर्शाता है।",
    hinglish: "Yeh card positive movement aur clarity dikhata hai."
  },
  reversed: {
    english: "Take caution. Reflection and adjustment will bring better outcomes.",
    hindi: "सावधानी अपनाएं। परिचर्चन और समायोजन बेहतर परिणाम लाएंगे।",
    hinglish: "Dhyaan rakho. Reflection aur adjustment se achhe results milega."
  }
};

function getMeaning(cardName, orientation) {
  const base = BASE_MEANINGS[cardName];
  if (base && base[orientation]) return base[orientation];
  const fb = FALLBACK_MEANING[orientation];
  return {
    english: fb.english,
    hindi: fb.hindi,
    hinglish: fb.hinglish
  };
}

function buildTopicFile(topicName, prefixEn, prefixHi, prefixHiEn) {
  const result = {};
  for (let i = 0; i < DECK.length; i++) {
    const cardId = i + 1;
    const cardName = DECK[i];
    const upright = getMeaning(cardName, "upright");
    const reversed = getMeaning(cardName, "reversed");
    result[String(cardId)] = {
      cardName,
      upright: {
        english: `${prefixEn}\n\n${upright.english}`,
        hindi: `${prefixHi}\n\n${upright.hindi}`,
        hinglish: `${prefixHiEn}\n\n${upright.hinglish}`
      },
      reversed: {
        english: `${prefixEn}\n\n${reversed.english}`,
        hindi: `${prefixHi}\n\n${reversed.hindi}`,
        hinglish: `${prefixHiEn}\n\n${reversed.hinglish}`
      }
    };
  }
  return result;
}

const TOPICS = {
  "feelings_current.json": {
    prefixEn: "Your partner's current feelings toward you",
    prefixHi: "आपके साथ आपके साथी की वर्तमान भावनाएं",
    prefixHiEn: "Aapke saath tumhare partner ki maujuda feelings"
  },
  "actions_next.json": {
    prefixEn: "What your partner will do next",
    prefixHi: "आपके साथी क्या करेंगे अगले कदम",
    prefixHiEn: "Tumhare partner ke agle actions kya honge"
  },
  "crush_feelings.json": {
    prefixEn: "Your crush's current feelings for you",
    prefixHi: "आपके क्रश की आपके लिए वर्तमान भावनाएं",
    prefixHiEn: "Tumhare crush ki tumse current feelings"
  },
  "crush_actions.json": {
    prefixEn: "What your crush will do next",
    prefixHi: "आपके क्रश क्या करेंगे अगले कदम",
    prefixHiEn: "Tumhare crush ke agle actions kya honge"
  },
  "yes_or_no.json": {
    prefixEn: "Yes or No guidance",
    prefixHi: "हाँ या ना मार्गदर्शन",
    prefixHiEn: "Yes ya No guidance"
  },
  "third_party.json": {
    prefixEn: "Third-party situation and resolution",
    prefixHi: "तीस-पक्ष की स्थिति और समाधान",
    prefixHiEn: "Third-party situation aur uska hal"
  },
  "daily_reading.json": {
    prefixEn: "Today's guidance",
    prefixHi: "आज का मार्गदर्शन",
    prefixHiEn: "Aaj ka din kaisa rahega"
  },
  "spiritual_journey.json": {
    prefixEn: "Spiritual journey guidance",
    prefixHi: "आध्यात्मिक यात्रा मार्गदर्शन",
    prefixHiEn: "Spiritual journey guidance"
  },
  "monthly_reading.json": {
    prefixEn: "Monthly forecast",
    prefixHi: "मासिक पूर्वानुमान",
    prefixHiEn: "Mahina kaisa rahega"
  },
  "yearly_reading.json": {
    prefixEn: "Yearly month-by-month forecast",
    prefixHi: "वार्षिक मास-दर-माह पूर्वानुमान",
    prefixHiEn: "Pura saal ka monthly forecast"
  }
};

for (const [filename, { prefixEn, prefixHi, prefixHiEn }] of Object.entries(TOPICS)) {
  const data = buildTopicFile(filename, prefixEn, prefixHi, prefixHiEn);
  const outputPath = path.join(KB_DIR, filename);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Generated: ${filename} (${DECK.length} cards)`);
}

console.log("\nAll KB files generated successfully.");
