// Guards for the demo build: headline numbers, time-zone independence, the
// vocabulary card condition and the social-connect flag default.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getDemoProfiles, getDemoProfile } from "@/data/demo/profiles";
import { runAnalysis } from "@/lib/analysis/pipeline";
import { summarizeResults } from "@/lib/export/gth-result";
import { computeAlgorithmInfluence } from "@/lib/data/context";

test("demo headline numbers are unchanged", () => {
  const p = getDemoProfile("demo-intellectual");
  const s = summarizeResults(p, runAnalysis(p));
  assert.equal(p.posts.length, 548);
  const counts = Object.fromEntries(s.topTopics);
  assert.equal(counts["AI-governance"], 101);
  assert.equal(counts["tech-ethics"], 96);
  assert.equal(counts["platform-accountability"], 63);
});

test("demo dates are built in UTC (midnight UTC in every time zone)", () => {
  for (const p of getDemoProfiles()) {
    for (const post of p.posts) assert.match(post.createdAt, /T00:00:00\.000Z$/, `${post.id} ${post.createdAt}`);
    for (const period of p.timePeriods) assert.match(period.start, /-01T00:00:00\.000Z$/, period.label);
  }
});

test("vocabulary card appears only when more words faded than emerged", () => {
  for (const p of getDemoProfiles()) {
    const a = runAnalysis(p);
    const ai = computeAlgorithmInfluence(p, a);
    const fading = a.vocabularyDrift.value.filter(t => t.direction === "fading").length;
    const emerging = a.vocabularyDrift.value.filter(t => t.direction === "emerging").length;
    const shown = ai.patterns.some(x => x.name === "Vocabulary convergence");
    assert.equal(shown, fading > emerging, `${p.id}: ${fading} fading vs ${emerging} emerging`);
  }
});

test("influence index equals its published formula", () => {
  for (const p of getDemoProfiles()) {
    const { sensitivityScore, indexComponents: c } = computeAlgorithmInfluence(p, runAnalysis(p));
    const expected = Math.min(1, 0.3 * c.engagementShift + 0.3 * c.topicConcentration + 0.2 * c.vocabularyConvergence + 0.2 * c.toneNarrowing);
    assert.equal(sensitivityScore, expected, p.id);
  }
});

test("social connect is off unless NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT=true", async () => {
  const { SOCIAL_CONNECT_ENABLED } = await import("@/lib/features");
  assert.equal(SOCIAL_CONNECT_ENABLED, process.env.NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT === "true");
  if (!process.env.NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT) assert.equal(SOCIAL_CONNECT_ENABLED, false);
});
