const fs = require("fs");
const path = require("path");

const KB_DIR = path.join(__dirname, "..", "ginni-kb");

async function run() {
  console.log("Testing KB Reader...\n");

  const index = JSON.parse(fs.readFileSync(path.join(KB_DIR, "index.json"), "utf-8"));
  console.log("Deck size:", index.deck.length);
  console.log("Topics:", index.topics.length);
  console.log("");

  for (const topic of index.topics.slice(0, 5)) {
    const file = path.join(KB_DIR, topic.file);
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    const keys = Object.keys(data);
    console.log(`Topic: ${topic.key} (${topic.file})`);
    console.log(`  Entries: ${keys.length}, Missing: ${topic.missing.length}`);
    if (keys.length > 0) {
      console.log(`  First card: ${keys[0]}`);
    }
    console.log("");
  }

  console.log("KB test passed!");
}

run();
