import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { SectionDivider } from '@/components/shared/SectionDivider';

const DESIGN_PATTERNS = [
  {
    feature: 'Variable-Ratio Engagement Feedback',
    mechanism: 'Engagement metrics (likes, shares) arrive unpredictably — some posts receive many, others few, with no consistent pattern visible to the user.',
    effect: 'This mirrors variable-ratio reinforcement schedules, which behavioral research associates with persistent repetition of rewarded behaviors.',
    counter: 'Engagement feedback also helps users understand what their audience values, and can support genuine community connection.',
  },
  {
    feature: 'Algorithmic Feed Ranking',
    mechanism: 'Content is ordered by predicted engagement rather than chronology, creating differential visibility for different types of posts.',
    effect: 'Users may gradually learn what "works" in terms of visibility, potentially adapting self-presentation to match algorithmic preferences.',
    counter: 'Algorithmic ranking also surfaces content users are likely to find valuable, and reduces information overload compared to purely chronological feeds.',
  },
  {
    feature: 'Identity Legibility Incentives',
    mechanism: 'Platform features like profiles, bios, follower counts, and topic labels encourage users to present a consistent, categorizable identity.',
    effect: 'Over time, the incentive to be "known for something" may narrow the range of topics and personas a user expresses.',
    counter: 'Clear identity presentation also helps users find communities of shared interest and build professional networks.',
  },
  {
    feature: 'Memory and Recirculation Features',
    mechanism: 'Features like "On This Day" resurface past content on anniversaries, selecting which memories to present based on undisclosed criteria.',
    effect: 'This creates a curated relationship with one\'s own past, potentially reinforcing certain self-narratives while allowing others to fade.',
    counter: 'Memory features can also prompt genuine reflection and help users appreciate their personal history.',
  },
  {
    feature: 'Metrics Visibility',
    mechanism: 'Follower counts, like counts, and view counts are publicly visible on most platforms, creating a persistent awareness of audience reception.',
    effect: 'Visible metrics may create ongoing awareness of "performance" that subtly shapes self-expression toward audience expectations.',
    counter: 'Metrics transparency also enables accountability and helps users understand their reach and influence.',
  },
];

const TRANSPARENCY_GAPS = [
  'How recommendation algorithms weigh different engagement signals',
  'Whether content from certain topics or formats receives systematic amplification or suppression',
  'How "memory" features select which past content to resurface',
  'The precise relationship between user engagement metrics and content distribution',
  'Whether platform A/B testing has been conducted on features that affect self-expression patterns',
  'How content moderation decisions interact with algorithmic distribution',
];

export default function GovernancePage() {
  return (
    <div>
      <PageHeader
        title="Platform Governance"
        subtitle="Structural context for interpreting self-presentation patterns."
      />

      <div className="reading-column px-6 pb-24">
        <p className="text-[16px] leading-relaxed text-charcoal-700 mb-8">
          This page describes how platform design decisions create the conditions
          under which self-presentation occurs. It does not accuse platforms or
          exonerate them. It provides structural context that may inform how you
          interpret the patterns observed in your data.
        </p>

        {/* Definition */}
        <div className="bg-cream-100 border border-cream-200 rounded-sm p-6 mb-12">
          <h3 className="font-interface text-[12px] text-charcoal-500 uppercase tracking-wide mb-2">
            Definition
          </h3>
          <p className="text-[15px] text-charcoal-700 leading-relaxed">
            <strong>Platform governance</strong>, as used here, refers to the
            design choices, algorithmic systems, and policy decisions that structure
            how users create, share, and receive content. It encompasses not only
            content moderation but also the incentive architectures, feedback
            mechanisms, and behavioral environments that platforms construct.
          </p>
        </div>

        <SectionDivider />

        {/* Design Patterns */}
        <h2 className="text-[22px] text-charcoal-900 mb-6">
          Design Patterns of Concern
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-8">
          Each pattern below describes a platform feature, its mechanism, its
          possible effect on self-presentation, and an acknowledgment of its
          constructive uses. All characterizations of effects are structural
          observations, not claims about individual users.
        </p>

        <div className="space-y-6">
          {DESIGN_PATTERNS.map((pattern) => (
            <div key={pattern.feature} className="border-t-2 border-teal-700 bg-cream-100 border border-cream-200 rounded-sm p-6">
              <h3 className="text-[17px] text-charcoal-900 mb-3">{pattern.feature}</h3>

              <div className="space-y-3 text-[14px] leading-relaxed">
                <div>
                  <span className="font-interface text-[11px] text-charcoal-500 uppercase tracking-wide">Mechanism</span>
                  <p className="text-charcoal-700 mt-1">{pattern.mechanism}</p>
                </div>
                <div>
                  <span className="font-interface text-[11px] text-charcoal-500 uppercase tracking-wide">Possible Effect</span>
                  <p className="text-charcoal-700 mt-1">{pattern.effect}</p>
                </div>
                <div>
                  <span className="font-interface text-[11px] text-charcoal-500 uppercase tracking-wide">Also True</span>
                  <p className="text-charcoal-500 mt-1 italic">{pattern.counter}</p>
                </div>
              </div>

              <div className="mt-3">
                <EpistemicBadge status="governance_commentary" />
              </div>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Transparency Gaps */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Transparency Gaps
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          The following aspects of platform operation are not publicly disclosed
          by most major platforms. These are factual absences, not conspiracy
          claims — platforms may have valid business or security reasons for
          non-disclosure.
        </p>

        <ul className="space-y-3">
          {TRANSPARENCY_GAPS.map((gap) => (
            <li key={gap} className="text-[14px] text-charcoal-700 leading-relaxed pl-4 border-l-2 border-slate-200">
              {gap}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <EpistemicBadge status="observed" />
          <span className="font-interface text-[11px] text-charcoal-300 ml-2">
            Based on publicly available platform documentation as of 2024.
          </span>
        </div>

        <SectionDivider />

        {/* Governance Frameworks */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          What Current Governance Frameworks See
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-cream-100 border border-cream-200 rounded-sm">
            <h4 className="font-interface text-[12px] text-teal-700 uppercase tracking-wide mb-2">
              What they address well
            </h4>
            <p className="text-[14px] text-charcoal-700 leading-relaxed">
              Content moderation, hate speech, misinformation, data privacy
              (GDPR, CCPA), transparency reporting requirements, age-appropriate
              design codes.
            </p>
          </div>

          <div className="p-4 bg-cream-100 border border-cream-200 rounded-sm">
            <h4 className="font-interface text-[12px] text-amber-700 uppercase tracking-wide mb-2">
              What they partially address
            </h4>
            <p className="text-[14px] text-charcoal-700 leading-relaxed">
              Algorithmic transparency (EU AI Act, DSA), dark patterns regulation,
              platform market dominance, researcher access to data. These frameworks
              exist but implementation and enforcement remain uneven.
            </p>
          </div>

          <div className="p-4 bg-amber-100 border border-amber-200 rounded-sm">
            <h4 className="font-interface text-[12px] text-amber-700 uppercase tracking-wide mb-2">
              What they largely miss
            </h4>
            <p className="text-[14px] text-charcoal-700 leading-relaxed">
              Cumulative behavioral effects of platform design on self-expression.
              The gradual shaping of identity presentation through reinforcement
              dynamics. The structural conditions that may narrow civic discourse
              diversity. The long-term effects of algorithmic memory curation on
              personal narrative.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <EpistemicBadge status="governance_commentary" />
        </div>
      </div>
    </div>
  );
}
