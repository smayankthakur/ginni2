// Parses the raw stored text for one card into its language segments.
//
// The source documents use several different ways of marking a language
// section, inconsistently across files and even within the same file:
//   - inline colon labels: "Hinglish:", "English:", "HINDI:", and even
//     "Hinglish (Latin Script):" in a handful of cards
//   - whole-line labels with no colon: "ENGLISH", "ENGLISH VERSION",
//     "English", "English Version", and "हिंदी" (Hindi, in Devanagari)
//   - no label at all — the whole card is a single, single-language block
//
// This parser finds every marker it recognises (of either style), splits
// the text on them, and treats anything before the first marker as the
// (implicit) Hinglish section, since that's the convention every source
// file follows.
function normalizeLabel(raw) {
  if (raw === "हिंदी") return "hindi";
  const s = raw.toLowerCase();
  if (s.startsWith("hinglish")) return "hinglish";
  if (s.startsWith("english")) return "english";
  if (s.startsWith("hindi")) return "hindi";
  return null;
}

const MARKER_RE =
  /(?:^|\n)[ \t]*(Hinglish(?:\s*\([^)]*\))?|English(?:\s*\([^)]*\))?|HINDI|Hindi)\s*:[ \t]*|(?:^|\n)[ \t]*(ENGLISH(?:[ \t]+VERSION)?|English(?:[ \t]+Version)?|हिंदी)[ \t]*(?=\n|$)/gim;

const DEVANAGARI_RE = /[\u0900-\u097F]/;
const SEPARATOR_LINE_RE = /^-+$/;

// Shape D: no labels anywhere, but the languages are still separated by
// line — one or more English sentences, then one or more Hindi sentences
// (identifiable by Devanagari script), then one or more Hinglish sentences
// covering the same ground again. Used by files like partner-action.json.
// Returns null if the text doesn't actually contain a Hindi block to anchor
// the split on (e.g. genuinely single-language files).
function splitByScript(body) {
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !SEPARATOR_LINE_RE.test(l));
  if (lines.length < 2) return null;

  let hindiStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (DEVANAGARI_RE.test(lines[i])) {
      hindiStart = i;
      break;
    }
  }
  if (hindiStart <= 0) return null; // no Hindi block, or Hindi is the very first line (unexpected shape)

  let hindiEnd = hindiStart;
  while (hindiEnd < lines.length && DEVANAGARI_RE.test(lines[hindiEnd])) hindiEnd++;

  const english = lines.slice(0, hindiStart);
  const hindi = lines.slice(hindiStart, hindiEnd);
  const hinglish = lines.slice(hindiEnd);
  if (english.length === 0 || hindi.length === 0 || hinglish.length === 0) return null;

  return {
    english: english.join(" "),
    hindi: hindi.join(" "),
    hinglish: hinglish.join(" "),
  };
}

export function parseCardText(raw) {
  const firstBreak = raw.indexOf("\n");
  const header = firstBreak === -1 ? raw : raw.slice(0, firstBreak);
  const body = firstBreak === -1 ? "" : raw.slice(firstBreak + 1);

  const matches = [...body.matchAll(MARKER_RE)];

  if (matches.length === 0) {
    const byScript = splitByScript(body);
    if (byScript) {
      return { header, ...byScript, hasMarkers: true };
    }
    return { header, hinglish: body.trim() || null, english: null, hindi: null, hasMarkers: false };
  }

  const segments = { hinglish: null, english: null, hindi: null };

  const preamble = body.slice(0, matches[0].index).trim();
  if (preamble) segments.hinglish = preamble;

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const label = normalizeLabel(m[1] || m[2]);
    const start = m.index + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
    const text = body.slice(start, end).trim();
    if (label && text) {
      segments[label] = segments[label] ? segments[label] + "\n\n" + text : text;
    }
  }

  return { header, ...segments, hasMarkers: true };
}

// Returns the reading strictly in the requested language.
//   - available: true  -> text is the genuine reading in that language
//   - available: false -> that language section doesn't exist for this card
//     (only possible when the source *does* distinguish languages for this
//     card but is simply missing this one)
//   - singleLanguageSource: true -> the source never labelled languages at
//     all for this card, so the same text is shown regardless of which
//     language was picked, since there's nothing else to show
export function getReadingFor(raw, lang) {
  const p = parseCardText(raw);
  const byLang = { hinglish: p.hinglish, english: p.english, hindi: p.hindi };

  if (byLang[lang]) {
    return { text: byLang[lang], available: true, singleLanguageSource: false };
  }

  if (!p.hasMarkers) {
    const fallback = p.hinglish || p.english || p.hindi;
    if (fallback) {
      return { text: fallback, available: true, singleLanguageSource: true };
    }
  }

  return { text: null, available: false, singleLanguageSource: false };
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
