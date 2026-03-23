import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { SectionDivider } from '@/components/shared/SectionDivider';

const METHODS = [
  {
    name: 'Temporal Aggregation',
    plain: 'Posts are grouped by calendar month or quarter. Counts, averages, and distributions are computed per period to show how patterns change over time.',
    technical: 'Monthly and quarterly bucketing by ISO 8601 date. Per-period computation of post counts, topic frequency distributions, vocabulary term frequencies, and tone marker averages.',
  },
  {
    name: 'Topic Classification',
    plain: 'Each post is assigned one or more topics based on keyword matching against a predefined taxonomy. This is transparent keyword matching, not machine learning — every assignment can be audited by examining the taxonomy and the post text.',
    technical: 'Tokenization with stopword removal. Keyword hit counting against a topic taxonomy. Co-occurrence boosting (multiple keywords from the same topic increase confidence). Threshold filtering at confidence > 0.3.',
  },
  {
    name: 'Topic Entropy',
    plain: 'Shannon entropy measures how evenly distributed your topics are. Higher entropy means more diverse topics; lower entropy means concentration. Declining entropy is common in any sustained activity and may be entirely intentional.',
    technical: 'H = -Σ p(topic) · log₂(p(topic)), computed per quarter. Bounded between 0 (single topic) and log₂(n) (uniform distribution over n topics).',
  },
  {
    name: 'Vocabulary Drift',
    plain: 'Compares which words you use more or less frequently between the first and second halves of the posting history. This captures lexical change but cannot determine its cause.',
    technical: 'Per-post vocabulary fingerprinting (significant terms after stopword removal). Term frequency per 100 posts, compared between dataset halves. Jensen-Shannon divergence for overall drift quantification.',
  },
  {
    name: 'Tone Heuristics',
    plain: 'Approximate measures of assertiveness, emotionality, formality, and urgency based on linguistic markers. These are rough directional signals, not precise measurements, and are culturally dependent.',
    technical: 'Assertiveness: imperative sentence ratio + modal verb density. Emotionality: exclamation density + intensifier ratio + all-caps word ratio. Formality: avg sentence length × contraction inverse ratio. Urgency: temporal marker density + imperative density.',
  },
  {
    name: 'Engagement–Frequency Correlation',
    plain: 'Measures whether topics that received higher engagement in one quarter appear more frequently in the next quarter. This is a correlation — it cannot establish that engagement caused the change in posting behavior.',
    technical: 'Pearson correlation between topic-level average engagement in quarter N and topic-level posting frequency in quarter N+1. Computed per consecutive quarter pair. Labeled "speculative" regardless of statistical significance because of the causal ambiguity inherent in the measure.',
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
        <div className="prose-body text-[15px] leading-[1.8] text-charcoal-700 mt-8 mb-12">
          <p>
            This page is the methods section of the project. It describes
            every analytical technique, every assumption, and every known
            limitation. If you are evaluating this tool for research use,
            policy analysis, or academic review, this page is where to start.
          </p>
        </div>

        {/* Epistemic Framework */}
        <h2 className="text-[22px] text-charcoal-900 mb-6">
          Epistemic Framework
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
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
            <div key={status} className="border-l border-cream-300 pl-5 py-2">
              <div className="mb-2">
                <EpistemicBadge status={status} />
              </div>
              <p className="text-[14px] text-charcoal-500 leading-relaxed mb-1">{meaning}</p>
              <p className="text-[13px] text-charcoal-700 italic">{example}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Analytical Methods */}
        <h2 className="text-[22px] text-charcoal-900 mb-6">
          Analytical Methods
        </h2>

        <div className="space-y-8">
          {METHODS.map((method) => (
            <div key={method.name} className="border-b border-cream-200 pb-6">
              <h3 className="text-[17px] italic text-charcoal-900 mb-2">{method.name}</h3>
              <p className="text-[14px] text-charcoal-700 leading-relaxed mb-3">{method.plain}</p>
              <details className="group">
                <summary className="font-interface text-[11px] text-teal-700 cursor-pointer hover:text-teal-500 transition-colors duration-200 tracking-wide">
                  Technical detail
                </summary>
                <p className="text-[13px] text-charcoal-500 leading-relaxed mt-3 pl-5 border-l border-cream-200">
                  {method.technical}
                </p>
              </details>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Assumptions */}
        <h2 className="text-[22px] text-charcoal-900 mb-6">
          Assumptions
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          These are the conditions the tool assumes to be true. Where an
          assumption is weak, this is noted.
        </p>
        <div className="space-y-4">
          {ASSUMPTIONS.map((a, i) => (
            <div key={i} className="border-b border-cream-200 pb-4">
              <p className="text-[14px] text-charcoal-700 leading-relaxed">
                <span className="font-mono text-charcoal-400 mr-2">{i + 1}.</span>
                {a.claim}
              </p>
              <p className="text-[13px] text-charcoal-500 leading-relaxed mt-1 pl-6">
                {a.justification}
              </p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Limitations — prominent, not buried */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Limitations
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          This section carries equal weight to the methods section above.
          A tool that hides its limitations is not a serious tool.
        </p>
        <div className="border-l-2 border-amber-500 bg-amber-100/40 pl-6 pr-6 py-6 space-y-5">
          {LIMITATIONS.map((lim) => (
            <div key={lim.title}>
              <h4 className="text-[15px] text-charcoal-900 mb-1">{lim.title}</h4>
              <p className="text-[14px] text-charcoal-700 leading-relaxed">{lim.detail}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* What This Tool Is Not */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          What This Tool Is Not
        </h2>
        <div className="prose-body text-[15px] text-charcoal-700 leading-[1.8]">
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
