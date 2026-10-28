// Guards for the demo build: planted data, text-derived topics, the shared
// definitions, time-zone independence, the vocabulary card condition and the
// social-connect flag default.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getDemoProfiles, getDemoProfile } from "@/data/demo/profiles";
import { runAnalysis } from "@/lib/analysis/pipeline";
import { summarizeResults, buildGthResult } from "@/lib/export/gth-result";
import { DEFINITIONS, isRewardedAndRising } from "@/lib/analysis/definitions";
import { sensitivity } from "@/lib/analysis/recovery";
import { TAXONOMY, UNCLASSIFIED, classifyTopics } from "@/lib/analysis/text/taxonomy";
import { computeAlgorithmInfluence } from "@/lib/data/context";

test("demo posts and planted topics are unchanged", () => {
  const p = getDemoProfile("demo-intellectual");
  assert.equal(p.posts.length, 548);
  const planted = {};
  for (const post of p.posts) planted[post.planted.topic] = (planted[post.planted.topic] ?? 0) + 1;
  assert.equal(planted["AI-governance"], 101);
  assert.equal(planted["tech-ethics"], 96);
  assert.equal(planted["platform-accountability"], 63);
});

test("topics come from the text, as IPTC concepts", () => {
  const labels = new Set(TAXONOMY.map(c => c.label));
  for (const p of getDemoProfiles()) {
    for (const post of p.posts) {
      assert.deepEqual(post.derived.topics, classifyTopics(post.content.text), post.id);
      for (const t of post.derived.topics) assert.ok(t.topic === UNCLASSIFIED || labels.has(t.topic), t.topic);
    }
  }
});

test("planted running-club stream is classed as kept", () => {
  const p = getDemoProfile("demo-political");
  const sport = runAnalysis(p).engagementSensitivity.value.find(t => t.topic === "sport");
  assert.ok(sport, "sport topic present");
  assert.equal(sport.kept, true);
  assert.equal(sport.rewarded, false);
});

test("narrowing uses equal windows and its bootstrap interval", () => {
  for (const p of getDemoProfiles()) {
    const n = runAnalysis(p).narrowing.value;
    assert.equal(n.windowMonths, DEFINITIONS.narrowingWindowMonths);
    const expected = n.sufficient && n.relativeChange <= -DEFINITIONS.narrowedDrop && n.ci[1] < 0;
    assert.equal(n.narrowed, expected, p.id);
    assert.ok(n.ci[0] <= n.ci[1], p.id);
  }
  assert.equal(runAnalysis(getDemoProfile("demo-intellectual")).narrowing.value.narrowed, true);
});

test("pages, export and influence index share one set of definitions", () => {
  for (const p of getDemoProfiles()) {
    const a = runAnalysis(p);
    const s = summarizeResults(p, a);
    const doc = buildGthResult(p, a);
    const eng = a.engagementSensitivity.value;
    assert.deepEqual(s.reinforced.map(t => t.topic), eng.filter(isRewardedAndRising).map(t => t.topic));
    assert.deepEqual(doc.outputs.rewarded_rising.map(r => r.topic), s.reinforced.map(t => t.topic));
    assert.deepEqual(doc.outputs.kept_without_encouragement, doc.outputs.kept);
    assert.equal(doc.outputs.topic_range.narrowed, a.narrowing.value.narrowed);
    for (const t of eng) {
      assert.equal(t.rewarded, t.postCount >= DEFINITIONS.rewardedMinPosts && t.rewardRatio >= DEFINITIONS.rewardedRatio, t.topic);
    }
    const ai = computeAlgorithmInfluence(p, a);
    const share = eng.length ? eng.filter(isRewardedAndRising).length / eng.length : 0;
    assert.equal(ai.indexComponents.engagementShift, share >= DEFINITIONS.engagementShiftMinShare ? 1 : 0, p.id);
  }
});

test("sparse quarters are left blank in the correlation chart", () => {
  for (const p of getDemoProfiles()) {
    for (const q of runAnalysis(p).reinforcementCorrelation.value) {
      if (q.missing) continue;
      assert.ok(q.n >= DEFINITIONS.correlationMinTopics, `${p.id} ${q.date} n=${q.n}`);
    }
  }
});

test("stricter thresholds never find more rewarded or kept topics", () => {
  for (const p of getDemoProfiles()) {
    const [lo, mid, hi] = sensitivity(runAnalysis(p));
    assert.ok(lo.rewarded >= mid.rewarded && mid.rewarded >= hi.rewarded, p.id);
    assert.ok(lo.kept >= mid.kept && mid.kept >= hi.kept, p.id);
  }
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
