// Recovery test and sensitivity table, computed from the demo profiles at build
// time. See src/lib/analysis/recovery.ts.

import { getDemoProfiles } from '@/data/demo/profiles';
import { runAnalysis } from '@/lib/analysis/pipeline';
import { DEFINITIONS } from '@/lib/analysis/definitions';
import {
  boostRecovery, growthRecovery, keptRecovery, selfDescRecovery, sensitivity, toneRecovery, topicRecovery,
} from '@/lib/analysis/recovery';

const PLANTED_KEPT = ['running-club'];

const th = 'text-left font-sans text-[11px] text-ink-400 font-normal py-1.5 pr-3 align-bottom';
const td = 'py-1.5 pr-3 align-top text-[13px] text-ink-700';
const num = `${td} font-mono text-[12px] whitespace-nowrap`;

function Table({ head, rows, caption }: { head: string[]; rows: (string | number)[][]; caption: string }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1 mb-6">
      <table className="w-full border-collapse">
        <caption className="text-left font-sans text-[12px] text-ink-500 mb-2">{caption}</caption>
        <thead><tr className="border-b border-linen-200">{head.map(h => <th key={h} scope="col" className={th}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-linen-100">
              {r.map((c, j) => <td key={j} className={typeof c === 'number' ? num : td}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const pair = ([a, b]: [number, number]) => `${a} → ${b}`;

export function RecoveryPanel() {
  const profiles = getDemoProfiles().map(p => ({ p, a: runAnalysis(p) }));

  return (
    <div>
      <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
        The demo profiles are generated. The generator plants topic labels, engagement boosts,
        an engagement growth curve, a persistently low-reward topic, tone curves and
        self-descriptions, and keeps them on each post. The analysis never sees them: it works
        from the post text and engagement counts only. These tables compare the two. Where the
        analysis does not recover what was planted, that is shown, not tuned away.
      </p>

      {profiles.map(({ p, a }) => {
        const topics = topicRecovery(p);
        const boosts = boostRecovery(p, a);
        const growth = growthRecovery(p, a);
        const kept = keptRecovery(p, a, PLANTED_KEPT);
        const tone = toneRecovery(p);
        const selves = selfDescRecovery(p);
        const unclassified = topics.reduce((s, t) => s + t.unclassified, 0);
        return (
          <section key={p.id} className="mb-12">
            <h3 className="text-[17px] italic text-ink-900 mb-3">{p.label}</h3>

            <Table
              caption={`Topics: planted label → IPTC concepts found in the text (share of that label's posts). ${unclassified} of ${p.posts.length} posts matched no keyword.`}
              head={['Planted', 'Posts', 'Recovered as', 'No match']}
              rows={topics.map(t => [t.planted, t.posts, t.recovered.map(r => `${r.topic} ${Math.round(r.share * 100)}%`).join(', '), t.unclassified])}
            />

            <Table
              caption={`Engagement boosts: does a planted multiplier come back as a rewarded topic (time-adjusted ratio ≥ ${DEFINITIONS.rewardedRatio})?`}
              head={['Planted', 'Multiplier', 'Ratio by planted label', 'Main concept', 'Concept ratio', 'Rewarded']}
              rows={boosts.map(b => [b.planted, `${b.boost}×`, `${b.ratioByPlantedLabel.toFixed(2)}×`, b.mainConcept ?? '—', b.conceptRatio === null ? '—' : `${b.conceptRatio.toFixed(2)}×`, b.conceptRewarded ? 'yes' : 'no'])}
            />

            <p className="text-[13px] text-ink-500 leading-relaxed mb-2">
              Engagement growth planted: {growth.planted ?? 'none'}. Median raw engagement in the last three months is{' '}
              {growth.rawGrowth}× the first three.
              {growth.rawOnly.length > 0
                ? ` On raw engagement these topics would count as rewarded but not once each post is compared with its own month: ${growth.rawOnly.map(r => `${r.topic} (raw ${r.rawRatio}×, adjusted ${r.rewardRatio}×)`).join('; ')}.`
                : ' No topic changes class between raw and time-adjusted engagement.'}
            </p>
            {growth.planted === null && growth.rawOnly.length > 0 && (
              <p className="text-[13px] text-ink-500 leading-relaxed mb-6">
                Here no growth was planted: the raw rise comes from the topic boosts themselves, which switch on
                partway through and then make up most posts in a month. The month baseline then absorbs part of
                the boost, so time adjustment can hide a real reward as well as remove growth.
              </p>
            )}

            {kept.length > 0 && (
              <Table
                caption="Kept: a planted topic posted steadily throughout at 0.6× engagement."
                head={['Planted', 'Posts', 'Main concept', 'Classed as kept', 'All kept topics']}
                rows={kept.map(k => [k.planted, k.posts, k.mainConcept ?? '—', k.conceptKept ? 'yes' : 'no', k.detectedKept.join(', ') || 'none'])}
              />
            )}

            <Table
              caption="Tone: planted mean vs mean measured from the text, earlier half → later half."
              head={['Marker', 'Planted', 'From text', 'Same direction']}
              rows={tone.map(t => [t.marker, pair(t.planted), pair(t.derived), t.agrees ? 'yes' : 'no'])}
            />

            <Table
              caption="Self-descriptions: planted count vs count found in the text, earlier half → later half."
              head={['Pattern', 'Planted', 'From text']}
              rows={selves.map(s => [s.pattern.replace('_', ' '), pair(s.planted), pair(s.derived)])}
            />
          </section>
        );
      })}

      <h3 className="text-[17px] italic text-ink-900 mb-3">Sensitivity</h3>
      <p className="text-[14px] text-ink-500 leading-relaxed mb-4">
        The same counts with every threshold scaled. ×1.2 is stricter: a higher reward ratio, a larger
        rise, more posts, a lower engagement ceiling for kept topics and a larger drop for narrowing.
        Results that appear only at ×0.8 are weak.
      </p>
      <Table
        caption="Topic counts by threshold scale"
        head={['Profile', 'Scale', 'Rewarded', 'Rising', 'Rewarded and rising', 'Kept', 'Narrowed']}
        rows={profiles.flatMap(({ p, a }) => sensitivity(a).map(s => [p.label, `×${s.factor}`, s.rewarded, s.rising, s.rewardedRising, s.kept, s.narrowed ? 'yes' : 'no']))}
      />
    </div>
  );
}

/** Every threshold, as used by the pages and the export. */
export function DefinitionsTable() {
  const d = DEFINITIONS;
  const rows: [string, string][] = [
    ['Engagement', `${d.engagementFormula}`],
    ['Time-adjusted engagement', `Post engagement ÷ median engagement of its UTC month (its quarter if the month has fewer than ${d.baselineMinPostsPerMonth} posts). A topic's ratio is the median over its posts.`],
    ['Halves', `Split at the midpoint in time between the first and last post. Trends need at least ${d.minPostsPerHalf} posts in each half.`],
    ['Rewarded', `Ratio at least ${d.rewardedRatio}×, at least ${d.rewardedMinPosts} posts.`],
    ['Rising', `Later share at least ${d.risingRatio}× the earlier, up at least ${d.risingMinChangePp} points, bootstrap 95% interval above 0. Falling is the mirror image.`],
    ['Kept', `At least ${d.keptMinPostsPerHalf} posts in each half, later share at least ${d.keptMinShareRatio * 100}% of the earlier, ratio below ${d.keptMaxRewardRatio}× in both halves.`],
    ['Resisted reward', 'Rewarded, and stable or falling.'],
    ['Faded', 'Falling, and ratio below 1×.'],
    ['Narrowed', `Miller–Madow topic entropy of the last ${d.narrowingWindowMonths} months at least ${d.narrowedDrop * 100}% below the first ${d.narrowingWindowMonths} months, bootstrap 95% interval below 0, at least ${d.narrowingMinPostsPerWindow} posts per window.`],
    ['Bootstrap', `${d.bootstrapResamples} resamples of posts within each half or window, fixed seed ${d.bootstrapSeed}.`],
    ['Engagement-driven shift', `At least ${d.engagementShiftMinShare * 100}% of topics rewarded and rising.`],
    ['Quarterly correlation', `Per quarter, topics with at least ${d.correlationMinTopicPosts} posts in the previous quarter; plotted with at least ${d.correlationMinTopics} topics and ${d.correlationMinPosts} posts, otherwise left blank.`],
  ];
  return (
    <Table caption="Defined in src/lib/analysis/definitions.ts" head={['Term', 'Definition']} rows={rows} />
  );
}
