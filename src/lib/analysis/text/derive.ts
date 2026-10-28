// ── Text-derived post features ────────────────────────────────────────────────
// Everything here is computed from the post text alone, so the same code works
// on demo posts and on real archives. Each measure is a documented heuristic,
// not a validated psychological scale.
//
//   topics            IPTC Media Topics via SelfTrace's keyword list (taxonomy.ts)
//   emotionality      |VADER compound score| (Hutto & Gilbert 2014): the sum of
//                     word valences s, normalised as s / sqrt(s² + 15), absolute value
//   assertiveness     boosters vs hedges (word lists after Hyland 2005,
//                     "Metadiscourse"): 0.5 + 0.5·(B − H)/(B + H + 1)
//   urgency           urgency words and exclamation marks per 10 words, capped at 1
//   formality         1 − informal markers (contractions, first-person singular,
//                     exclamation marks, line-break lists) per 10 words, floored at 0
//   self-descriptions first-person role, identity and expertise phrases (regex)

import type { DerivedPostData, SelfDescriptionMarker, ToneMarkers } from '@/lib/data/types';
import { classifyTopics } from './taxonomy';
import { VADER_LEXICON } from './vader-lexicon';

const BOOSTERS = new Set(['actually', 'always', 'certainly', 'clearly', 'completely', 'conclusively', 'definitely', 'demonstrate', 'demonstrates', 'evident', 'evidently', 'indeed', 'inevitably', 'never', 'obviously', 'overwhelming', 'really', 'surely', 'undeniably', 'undoubtedly', 'must', 'everything', 'cannot', "can't", 'fundamentally', 'single', 'every']);
const HEDGES = new Set(['about', 'almost', 'apparently', 'appear', 'appears', 'approximately', 'could', 'likely', 'may', 'maybe', 'might', 'perhaps', 'possibly', 'probably', 'seem', 'seems', 'somewhat', 'somewhere', 'suggest', 'suggests', 'tend', 'tends', 'wondering', 'wonder', 'unclear', 'potential', 'sometimes']);
const URGENCY = new Set(['now', 'today', 'tonight', 'urgent', 'urgently', 'immediately', 'drill', 'weeks', 'deadline', 'verify', 'register', 'staggering', 'failing', 'crisis', 'emergency', 'must']);
const FIRST_SINGULAR = new Set(['i', 'me', 'my', 'mine', "i'm", "i've", "i'd", "i'll"]);

function words(text: string): string[] {
  return text.toLowerCase().replace(/[’]/g, "'").split(/[^a-z0-9']+/).filter(Boolean);
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function deriveTone(text: string): ToneMarkers {
  const ws = words(text);
  const n = Math.max(ws.length, 1);
  const valence = ws.reduce((s, w) => s + (VADER_LEXICON[w] ?? 0), 0);
  const compound = valence / Math.sqrt(valence * valence + 15);
  const boosters = ws.filter(w => BOOSTERS.has(w)).length;
  const hedges = ws.filter(w => HEDGES.has(w)).length;
  const exclaims = (text.match(/!/g) ?? []).length;
  const urgent = ws.filter(w => URGENCY.has(w)).length + exclaims;
  const contractions = ws.filter(w => w.includes("'")).length;
  const firstPerson = ws.filter(w => FIRST_SINGULAR.has(w)).length;
  const listBreaks = (text.match(/\n\s*\d+\./g) ?? []).length;
  const informal = contractions + firstPerson + exclaims + listBreaks;
  return {
    assertiveness: round2(0.5 + 0.5 * (boosters - hedges) / (boosters + hedges + 1)),
    emotionality: round2(Math.abs(compound)),
    formality: round2(Math.max(0, 1 - informal / (n / 10))),
    urgency: round2(Math.min(1, urgent / (n / 10))),
    vulnerability: 0,
  };
}

const SELF_PATTERNS: { re: RegExp; pattern: SelfDescriptionMarker['pattern'] }[] = [
  { re: /\bas (?:a|an) ([a-z][a-z\-]*(?: [a-z][a-z\-]*){0,2}?)(?=[,.;:!?]| i\b| we\b)/g, pattern: 'role_claim' },
  { re: /\bas someone who [^,.;:!?]{3,60}/g, pattern: 'expertise_signal' },
  { re: /\bin my (?:\d+|ten|twenty) years(?: of [a-z ]{2,30}?)?(?=[,.;:!?]|$)/g, pattern: 'expertise_signal' },
  { re: /\b(?:in|from) my experience(?: [a-z ]{2,30}?)?(?=[,.;:!?]|$)/g, pattern: 'expertise_signal' },
  { re: /\bi(?:'ve| have) been (?:saying|building|working)[^,.;:!?]{0,40}/g, pattern: 'expertise_signal' },
  { re: /\bsomeone who won't stay silent\b/g, pattern: 'identity_statement' },
  { re: /\bi(?:'m| am) (?:a|an) ([a-z][a-z\-]*(?: [a-z][a-z\-]*){0,2})/g, pattern: 'identity_statement' },
];

export function deriveSelfDescriptions(text: string, postId: string): SelfDescriptionMarker[] {
  const t = text.toLowerCase().replace(/[’]/g, "'");
  const out: SelfDescriptionMarker[] = [];
  for (const { re, pattern } of SELF_PATTERNS) {
    for (const m of t.matchAll(re)) out.push({ phrase: m[0].trim(), pattern, postId });
  }
  return out;
}

/** Topics, tone and self-descriptions from the text; other fields are passed through. */
export function deriveFromText(
  text: string,
  postId: string,
  rest: Pick<DerivedPostData, 'civicMarkers' | 'memoryReferences'>,
): DerivedPostData {
  return {
    topics: classifyTopics(text),
    tone: deriveTone(text),
    selfDescriptions: deriveSelfDescriptions(text, postId),
    civicMarkers: rest.civicMarkers,
    memoryReferences: rest.memoryReferences,
    vocabularyFingerprint: text.toLowerCase().split(/\s+/).filter(w => w.length > 4).slice(0, 5),
  };
}
