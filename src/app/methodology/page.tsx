import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { SectionDivider } from '@/components/shared/SectionDivider';

const METHODS = [
  {
    name: 'Temporal Aggregation',
    plain: 'Posts are grouped by calendar month or quarter. Counts, averages, and distributions are computed per period to show how patterns change over time.',
    technical: 'Monthly and quarterly bucketing by ISO date. Per-period computation of post counts, topic frequency distributions, vocabulary term frequencies, and tone marker averages.',
  },
  {
    name: 'Topic Classification',
    plain: 'Each post is assigned one or more topics based on keyword matching against a predefined taxonomy. This is not machine learning — it is transparent keyword matching.',
    technical: 'Tokenization with stopword removal. Keyword hit counting against a topic taxonomy. Co-occurrence boosting (multiple keywords from the same topic increase confidence). Threshold filtering at confidence > 0.3.',
  },
  {
    name: 'Topic Entropy',
    plain: 'Shannon entropy measures how evenly distributed your topics are. Higher entropy means more diverse topics; lower entropy means concentration around fewer topics.',
    technical: 'H = -Σ p(topic) · log₂(p(topic)), computed per quarter over topic frequency distribution. Bounded between 0 (single topic) and log₂(n) (uniform distribution over n topics).',
  },
  {
    name: 'Vocabulary Drift',
    plain: 'Compares which words you use more or less frequently between the first half and second half of your posting history.',
    technical: 'Per-post vocabulary fingerprinting (significant terms after stopword removal). Term frequency per 100 posts, compared between dataset halves. Jensen-Shannon divergence for overall drift quantification.',
  },
  {
    name: 'Tone Heuristics',
    plain: 'Approximate measures of assertiveness, emotionality, formality, and urgency based on linguistic patterns like exclamation marks, hedge words, and intensifiers.',
    technical: 'Assertiveness: imperative sentence ratio + modal verb density ("should", "must"). Emotionality: exclamation density + intensifier ratio + all-caps word ratio. Formality: avg sentence length + contraction inverse ratio. Urgency: temporal marker density + imperative density.',
  },
  {
    name: 'Engagement-Frequency Correlation',
    plain: 'Measures whether topics that received higher engagement in one quarter appear more frequently in the next quarter. This is a correlation, not a causal claim.',
    technical: 'Pearson correlation between topic-level average engagement in quarter N and topic-level posting frequency in quarter N+1. Computed per consecutive quarter pair.',
  },
  {
    name: 'Phrase Recurrence',
    plain: 'Identifies 3-5 word phrases that appear in three or more posts, filtered to remove very common expressions.',
    technical: 'N-gram extraction (n=3,4,5) with stopword-heavy phrase filtering. Minimum occurrence threshold of 3. Temporal spread classification based on date distribution across dataset halves.',
  },
];

const ASSUMPTIONS = [
  'The provided dataset represents a meaningful sample of the user\'s posting history on the given platform.',
  'Posts in the dataset are attributed to a single author.',
  'Timestamps in the dataset are accurate and in chronological order.',
  'Engagement metrics, where present, reflect genuine audience response (not purchased or bot-generated engagement).',
  'The absence of a post in the dataset means it was not provided, not necessarily that it was deleted.',
  'Keyword-based topic classification, while imprecise, captures the dominant theme of most posts.',
  'Linguistic tone heuristics, while culturally limited, provide a directionally useful signal.',
];

const LIMITATIONS = [
  {
    title: 'Cannot distinguish platform influence from life change.',
    detail: 'If your posting patterns shift over time, this tool can detect the shift but cannot determine whether it was caused by platform reinforcement, personal growth, career changes, relationship changes, world events, or any other factor.',
  },
  {
    title: 'Cannot observe recommendation algorithms.',
    detail: 'This tool analyzes only user-provided data. It has no access to platform recommendation systems, algorithmic ranking, or personalization engines. All statements about platform influence are inferential.',
  },
  {
    title: 'Topic classification is approximate.',
    detail: 'Keyword-based topic assignment may miscategorize posts with ambiguous content, ironic usage, or topics not in the taxonomy. It cannot detect nuance, subtext, or evolving terminology.',
  },
  {
    title: 'Tone measurement is culturally limited.',
    detail: 'Linguistic heuristics for assertiveness, emotionality, etc. are calibrated to English-language norms and may not translate across cultures, dialects, or communication styles.',
  },
  {
    title: 'Engagement metrics are an incomplete picture.',
    detail: 'Likes, shares, and replies capture only visible engagement. They do not measure who read the post without interacting, who was influenced by it, or whether the engagement was meaningful.',
  },
  {
    title: 'This tool is a research prototype, not a scientific instrument.',
    detail: 'It has not been peer-reviewed, validated against ground truth, or tested for reliability across diverse datasets. It is a lens for reflection, not a source of findings.',
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
        {/* Epistemic Framework */}
        <h2 className="text-[22px] text-charcoal-900 mb-6">
          Epistemic Framework
        </h2>
        <p className="text-[14px] text-charcoal-700 leading-relaxed mb-6">
          Every claim in this tool is labeled with one of four epistemic statuses.
          These labels are structural, not decorative — they communicate what kind
          of knowledge each claim represents.
        </p>

        <div className="space-y-4 mb-12">
          {([
            { status: 'observed' as const, desc: 'Directly present in the user\'s data. No inference applied. Example: "You posted 847 times between January 2021 and February 2024."' },
            { status: 'inferred' as const, desc: 'Derived from pattern analysis. Plausible but not certain. Example: "Your topic diversity declined over the observed period."' },
            { status: 'speculative' as const, desc: 'A possible interpretation requiring the user\'s own judgment. Example: "The correlation between engagement and topic frequency may suggest sensitivity to audience feedback."' },
            { status: 'governance_commentary' as const, desc: 'Contextual information about platform design or policy. Not a claim about the user. Example: "Most platforms use engagement signals to rank content visibility."' },
          ]).map(({ status, desc }) => (
            <div key={status} className="flex gap-4 items-start p-4 bg-cream-100 border border-cream-200 rounded-sm">
              <EpistemicBadge status={status} />
              <p className="text-[14px] text-charcoal-700 leading-relaxed flex-1">{desc}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Analytical Methods */}
        <h2 className="text-[22px] text-charcoal-900 mb-6">
          Analytical Methods
        </h2>

        <div className="space-y-6">
          {METHODS.map((method) => (
            <div key={method.name} className="border-b border-cream-200 pb-6">
              <h3 className="text-[17px] italic text-charcoal-900 mb-2">{method.name}</h3>
              <p className="text-[14px] text-charcoal-700 leading-relaxed mb-2">{method.plain}</p>
              <details className="mt-2">
                <summary className="font-interface text-[12px] text-teal-700 cursor-pointer hover:text-teal-500">
                  Technical detail
                </summary>
                <p className="text-[13px] text-charcoal-500 leading-relaxed mt-2 pl-4 border-l-2 border-cream-200">
                  {method.technical}
                </p>
              </details>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Assumptions */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Assumptions
        </h2>
        <ol className="space-y-3 list-decimal list-inside">
          {ASSUMPTIONS.map((a, i) => (
            <li key={i} className="text-[14px] text-charcoal-700 leading-relaxed">{a}</li>
          ))}
        </ol>

        <SectionDivider />

        {/* Limitations */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Limitations
        </h2>
        <div className="bg-amber-100 border border-amber-200 rounded-sm p-6 space-y-4">
          {LIMITATIONS.map((lim) => (
            <div key={lim.title}>
              <h4 className="text-[15px] text-amber-700 mb-1">{lim.title}</h4>
              <p className="text-[14px] text-charcoal-700 leading-relaxed">{lim.detail}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* What This Tool Is Not */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          What This Tool Is Not
        </h2>
        <p className="text-[16px] text-charcoal-700 leading-relaxed">
          This is not a scientific instrument, not a diagnostic tool, not a
          replacement for rigorous research methodology, and not a basis for
          claims about any individual&apos;s psychological state. It is a
          prototype for reflective analysis — a lens, not a lab.
        </p>
      </div>
    </div>
  );
}
