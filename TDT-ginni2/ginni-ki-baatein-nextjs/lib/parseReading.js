// Parses the raw stored text for one card into its language segments.
// Handles the three shapes found across the source documents:
//   A) "Hinglish:...\nEnglish:...\nHINDI:..." explicit labels
//   B) "...\nENGLISH VERSION\n..." a Hinglish block followed by an English block
//   C) no language markers at all — single block, shown regardless of language chosen
export function parseCardText(raw) {
  const firstBreak = raw.indexOf("\n");
  const header = firstBreak === -1 ? raw : raw.slice(0, firstBreak);
  const body = firstBreak === -1 ? "" : raw.slice(firstBreak + 1);

  if (/(^|\n)\s*(Hinglish|English|HINDI|Hindi)\s*:/.test(body)) {
    const parts = body.split(/(Hinglish:|English:|HINDI:|Hindi:)/);
    const out = {};
    let cur = null;
    for (const p of parts) {
      const m = p.match(/^(Hinglish|English|HINDI|Hindi):$/);
      if (m) {
        cur = m[1].toLowerCase() === "hindi" ? "hindi" : m[1].toLowerCase();
      } else if (cur) {
        out[cur] = (out[cur] || "") + p;
      }
    }
    return {
      header,
      hinglish: out.hinglish ? out.hinglish.trim() : null,
      english: out.english ? out.english.trim() : null,
      hindi: out.hindi ? out.hindi.trim() : null,
    };
  }

  if (body.includes("ENGLISH VERSION")) {
    const idx = body.indexOf("ENGLISH VERSION");
    const hinglishPart = body.slice(0, idx).trim();
    const englishPart = body.slice(idx + "ENGLISH VERSION".length).trim();
    return { header, hinglish: hinglishPart, english: englishPart, hindi: null };
  }

  return { header, hinglish: body.trim(), english: null, hindi: null };
}

export function getReadingFor(raw, lang) {
  const p = parseCardText(raw);
  const byLang = { hinglish: p.hinglish, english: p.english, hindi: p.hindi };
  if (byLang[lang]) return { text: byLang[lang], short: false };
  const fallback = p.hinglish || p.english || p.hindi || "";
  return { text: fallback, short: true };
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
