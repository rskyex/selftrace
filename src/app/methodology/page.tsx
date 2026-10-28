import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { TAXONOMY, TAXONOMY_SOURCE } from '@/lib/analysis/text/taxonomy';
import { DefinitionsTable, RecoveryPanel } from './RecoveryPanel';

const METHODS = [
  {
    name: 'Temporal Aggregation',
    plain: 'Posts are grouped by calendar month or quarter. Counts, averages, and distributions are computed per period to show how patterns change over time.',
    technical: 'Monthly and quarterly bucketing by ISO 8601 date. Per-period computation of post counts, topic frequency distributions, vocabulary term frequencies, and tone marker averages.',
  },
  {
    name: 'Topic Classification',
    plain: 'Each post is assigned every topic whose keywords appear in its text. Topics are concepts from the IPTC Media Topics vocabulary, a published news taxonomy; the keyword lists are SelfTrace\'s own and are listed at the end of this page. This is transparent keyword matching, not machine learning — every assignment can be audited. Posts that match no keyword are left unclassified and out of topic counts.',
    technical: 'Lower-cased text, punctuation stripped. A keyword is a word, a word prefix ending in *, or a phrase. A post carries every concept with at least one matching keyword (multi-label); confidence is the concept\'s share of matched keywords. IPTC Media Topics, CC BY 4.0, release 2026-09-30.',
  },
  {
    name: 'Topic Entropy',
    plain: 'Shannon entropy measures how evenly distributed your topics are. Higher entropy means more diverse topics; lower entropy means concentration. "Narrowed" compares the first and last six months, not single quarters, and only when each window has enough posts. Declining entropy is common in any sustained activity and may be entirely intentional.',
    technical: 'H = -Σ p(topic) · log₂(p(topic)). The quarterly chart shows plain H per quarter. Narrowing uses H with the Miller–Madow correction, H + (K − 1) / (2N ln 2), over the first and last windows of equal length, with a bootstrap 95% interval of the relative change.',
  },
  {
    name: 'Vocabulary Drift',
    plain: 'Compares which words you use more or less frequently between the first and second halves of the posting history. This captures lexical change but cannot determine its cause.',
    technical: 'Per-post vocabulary fingerprinting (significant terms after stopword removal). Term frequency per 100 posts, compared between dataset halves. Jensen-Shannon divergence for overall drift quantification.',
  },
  {
    name: 'Tone Heuristics',
    plain: 'Approximate measures of assertiveness, emotionality, formality, and urgency, computed from the words of each post. These are rough directional signals, not precise measurements, and are culturally dependent. The recovery test below shows they do not reproduce the tone curves planted in the demo profiles.',
    technical: 'Assertiveness: 0.5 + 0.5 · (boosters − hedges) / (boosters + hedges + 1), Hyland\'s booster and hedge lists. Emotionality: |VADER compound| (VADER lexicon, MIT licence). Formality: 1 − informal markers per 10 words. Urgency: urgency markers per 10 words, capped at 1. Vulnerability is not measured (always 0).',
  },
  {
    name: 'Time-Adjusted Engagement',
    plain: 'Engagement is compared with the typical post of the same month, so growth or decline that affects every post (a growing audience, a platform change) does not make later topics look rewarded. A topic is rewarded when its posts typically got more than their month\'s typical engagement.',
    technical: 'Engagement = likes + 2 × shares. Ratio = post engagement ÷ median engagement of its UTC month (quarter if the month has fewer than 10 posts). A topic\'s reward ratio is the median ratio over its posts. Limitation: when one group of topics makes up most of a month, the month median moves with it and part of a real reward is absorbed (see the recovery test).',
  },
  {
    name: 'Equal-Time Halves',
    plain: 'Changes over time compare two halves of equal duration, split at the midpoint between the first and last post, rather than two halves with the same number of posts. A trend is only reported when both halves have enough posts.',
    technical: 'Rising: later share ≥ 1.3 × earlier share, change ≥ 2 percentage points, and the bootstrap 95% interval of the change above 0 (1000 resamples within each half, fixed seed). Falling is the mirror image; otherwise stable. Fewer than 20 posts in either half: insufficient.',
  },
  {
    name: 'Engagement–Frequency Correlation',
    plain: 'Measures whether topics that received higher engagement in one quarter appear more frequently in the next quarter. This is a correlation — it cannot establish that engagement caused the change in posting behavior. Quarters with too few posts or topics are left blank rather than drawn as zero.',
    technical: 'Pearson correlation between topic-level mean time-adjusted engagement in quarter N and topic share in quarter N+1, over topics with at least 3 posts in quarter N. Plotted only with at least 5 topics and 30 posts; n (topics compared) is shown in the data table. Labeled "speculative" regardless of statistical significance because of the causal ambiguity inherent in the measure.',
  },
  {
    name: 'Phrase Recurrence',
    plain: 'Identifies 3–5 word phrases that appear in three or more posts, filtered to remove very common expressions. Recurrence is observed directly in the data.',
    technical: 'N-gram extraction (n=3,4,5) with stopword-heavy phrase filtering. Minimum occurrence threshold of 3. Temporal spread classification based on date distribution across dataset halves.',
  },
  {
    name: 'Self-Description Detection',
    plain: 'Identifies instances where the user describes themselves using specific linguistic patterns ("as a...", "in my experience...", "I am a..."). These are detected through regular expression matching and may miss non-standard forms or misclassify rhetorical uses.',
    technical: 'Regex pattern matching for role claims, identity statements, expertise signals, vulnerability disclosures, and origin narratives. Classified as "inferred" because pattern matching involves interpretive assumptions about what constitutes a self-description.',
  },
];

const ASSUMPTIONS = [
  {
    claim: 'The provided dataset represents a meaningful portion of the user\'s posting history on the given platform.',
    justification: 'Partial datasets may produce misleading patterns. The tool reports dataset completeness but cannot verify it.',
  },
  {
    claim: 'Posts in the dataset are attributed to a single author.',
    justification: 'Shared accounts or ghostwritten content would invalidate self-presentation analysis.',
  },
  {
    claim: 'Timestamps are accurate and in chronological order.',
    justification: 'Temporal analysis depends on correct ordering. Platform exports generally provide reliable timestamps.',
  },
  {
    claim: 'Engagement metrics, where present, reflect genuine audience response.',
    justification: 'Purchased engagement or bot activity would distort reinforcement analysis. The tool cannot detect inauthentic engagement.',
  },
  {
    claim: 'Keyword-based topic classification captures the dominant theme of most posts.',
    justification: 'This is the weakest assumption. Keyword matching is approximate, cannot detect irony or subtext, and is limited to topics in the taxonomy.',
  },
];

const LIMITATIONS = [
  {
    title: 'Cannot distinguish platform influence from life change.',
    detail: 'If posting patterns shift over time, this tool can detect the shift but cannot determine whether it was caused by platform reinforcement, personal growth, career changes, relationship changes, world events, or any other factor. All "influence" language in this tool refers to correlation, never causation.',
  },
  {
    title: 'Cannot observe recommendation algorithms.',
    detail: 'This tool analyzes only user-provided data. It has no access to platform recommendation systems, ranking algorithms, or personalization engines. All statements about platform influence are inferential, based on what patterns in user data are consistent with known platform design features.',
  },
  {
    title: 'Topic classification is approximate and auditable but imprecise.',
    detail: 'Keyword-based topic assignment may miscategorize posts with ambiguous content, ironic usage, mixed topics, or subjects not in the taxonomy. It cannot detect nuance, subtext, or evolving terminology.',
  },
  {
    title: 'Tone measurement is culturally limited and heuristic.',
    detail: 'Linguistic proxies for assertiveness, emotionality, and other tone markers are calibrated to English-language norms and may not translate across cultures, dialects, code-switching patterns, or communication styles. They measure word patterns, not intent or emotional state.',
  },
  {
    title: 'Engagement metrics are an incomplete picture of audience response.',
    detail: 'Likes, shares, and replies capture only visible engagement. They do not measure who read the post without interacting, who was influenced by it, who was repelled by it, or whether the engagement was meaningful. Engagement is a platform construct, not a measure of communicative success.',
  },
  {
    title: 'This tool is a research prototype, not a validated instrument.',
    detail: 'It has not been peer-reviewed, tested for reliability across diverse datasets, or validated against external measures of self-presentation change. Its methods are documented for transparency, not as claims of rigor. It is a lens for reflection, not a source of findings.',
  },
];

export default function MethodologyPage() {
  return (
    <div>
      <PageHeader
        title="Methodology"
        subtitle="How this tool works, what it assumes, and where it falls short."
      />

      <div className="reading-column px-6 pb-24">
        <div className="prose-body text-[15px] leading-[1.8] text-ink-700 mt-8 mb-12">
          <p>
            This page is the methods section of the project. It describes
            every analytical technique, every assumption, and every known
            limitation. If you are evaluating this tool for research use,
            policy analysis, or academic review, this page is where to start.
          </p>
        </div>

        {/* Epistemic Framework */}
        <h2 className="text-[22px] text-ink-900 mb-6">
          Epistemic Framework
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
          Every claim in this tool carries one of four epistemic labels. These
          labels are structural — they are enforced at the type level in the
          codebase, meaning no analytical output can be rendered without
          specifying its epistemic status. They are not decorative.
        </p>

        <div className="space-y-5 mb-12">
          {([
            {
              status: 'observed' as const,
              example: '"You posted 847 times between January 2021 and February 2024."',
              meaning: 'Directly present in the data. No inference applied.',
            },
            {
              status: 'inferred' as const,
              example: '"Your topic diversity declined over the observed period."',
              meaning: 'Derived from pattern analysis. Plausible but not certain.',
            },
            {
              status: 'speculative' as const,
              example: '"The correlation between engagement and topic frequency may suggest sensitivity to audience feedback."',
              meaning: 'A possible interpretation. You may read the same data differently.',
            },
            {
              status: 'governance_commentary' as const,
              example: '"Most platforms use engagement signals to rank content visibility."',
              meaning: 'Context about platform design. Not a claim about your behavior.',
            },
          ]).map(({ status, example, meaning }) => (
            <div key={status} className="border-l border-linen-300 pl-5 py-2">
              <div className="mb-2">
                <EpistemicBadge status={status} />
              </div>
              <p className="text-[14px] text-ink-500 leading-relaxed mb-1">{meaning}</p>
              <p className="text-[13px] text-ink-700 italic">{example}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Analytical Methods */}
        <h2 className="text-[22px] text-ink-900 mb-6">
          Analytical Methods
        </h2>

        <div className="space-y-8">
          {METHODS.map((method) => (
            <div key={method.name} className="border-b border-linen-200 pb-6">
              <h3 className="text-[17px] italic text-ink-900 mb-2">{method.name}</h3>
              <p className="text-[14px] text-ink-700 leading-relaxed mb-3">{method.plain}</p>
              <details className="group">
                <summary className="font-sans text-[11px] text-teal-700 cursor-pointer hover:text-teal-500 transition-colors duration-200 tracking-wide">
                  Technical detail
                </summary>
                <p className="text-[13px] text-ink-500 leading-relaxed mt-3 pl-5 border-l border-linen-200">
                  {method.technical}
                </p>
              </details>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Definitions */}
        <h2 className="text-[22px] text-ink-900 mb-6">
          Definitions
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
          Every page and the JSON export use these definitions. They are set in one file, so a
          change there changes every count shown.
        </p>
        <DefinitionsTable />

        <SectionDivider />

        {/* Recovery test */}
        <h2 className="text-[22px] text-ink-900 mb-6">
          Recovery Test
        </h2>
        <RecoveryPanel />

        <SectionDivider />

        {/* Assumptions */}
        <h2 className="text-[22px] text-ink-900 mb-6">
          Assumptions
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
          These are the conditions the tool assumes to be true. Where an
          assumption is weak, this is noted.
        </p>
        <div className="space-y-4">
          {ASSUMPTIONS.map((a, i) => (
            <div key={i} className="border-b border-linen-200 pb-4">
              <p className="text-[14px] text-ink-700 leading-relaxed">
                <span className="font-mono text-ink-400 mr-2">{i + 1}.</span>
                {a.claim}
              </p>
              <p className="text-[13px] text-ink-500 leading-relaxed mt-1 pl-6">
                {a.justification}
              </p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Limitations — prominent, not buried */}
        <h2 className="text-[22px] text-ink-900 mb-4">
          Limitations
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
          This section carries equal weight to the methods section above.
          A tool that hides its limitations is not a serious tool.
        </p>
        <div className="border-l-2 border-amber-500 bg-amber-100/40 pl-6 pr-6 py-6 space-y-5">
          {LIMITATIONS.map((lim) => (
            <div key={lim.title}>
              <h4 className="text-[15px] text-ink-900 mb-1">{lim.title}</h4>
              <p className="text-[14px] text-ink-700 leading-relaxed">{lim.detail}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Taxonomy */}
        <h2 className="text-[22px] text-ink-900 mb-4">
          Topic Keywords
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
          Concepts from <a className="underline" href={TAXONOMY_SOURCE.url}>{TAXONOMY_SOURCE.name}</a>{' '}
          ({TAXONOMY_SOURCE.licence}, release {TAXONOMY_SOURCE.release}). IPTC publishes the concepts;
          the keywords are SelfTrace&apos;s own.
        </p>
        <details className="mb-6">
          <summary className="font-sans text-[11px] text-teal-700 cursor-pointer tracking-wide">Show all {TAXONOMY.length} concepts and keywords</summary>
          <dl className="mt-4 space-y-3">
            {TAXONOMY.map(c => (
              <div key={c.id}>
                <dt className="text-[13px] text-ink-900">{c.label} <span className="font-mono text-[11px] text-ink-400">{c.id}</span></dt>
                <dd className="text-[12px] text-ink-500 leading-relaxed">{c.keywords.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </details>

        <SectionDivider />

        {/* What This Tool Is Not */}
        <h2 className="text-[22px] text-ink-900 mb-4">
          What This Tool Is Not
        </h2>
        <div className="prose-body text-[15px] text-ink-700 leading-[1.8]">
          <p>
            This is not a scientific instrument. It is not a diagnostic tool.
            It is not a replacement for rigorous research methodology. It is
            not a basis for claims about any individual&apos;s psychological
            state, authenticity, or self-knowledge.
          </p>
          <p>
            It is a prototype for reflective analysis — a structured way to
            look at patterns in posting history and consider what they might
            mean. The distance between &ldquo;here is a pattern&rdquo; and
            &ldquo;here is what it means&rdquo; is one this tool deliberately
            does not cross.
          </p>
        </div>
      </div>
    </div>
  );
}
