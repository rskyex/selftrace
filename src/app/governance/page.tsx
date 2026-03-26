import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { SectionDivider } from '@/components/shared/SectionDivider';

const DESIGN_PATTERNS = [
  {
    feature: 'Variable-Ratio Engagement Feedback',
    mechanism: 'Engagement metrics arrive unpredictably — some posts receive substantial response, others very little, with no pattern legible to the user.',
    effect: 'Behavioral research associates variable-ratio feedback with persistent repetition of rewarded behaviors. Whether this dynamic operates on self-expression through platform engagement is an open question.',
    counter: 'Engagement feedback also helps users understand what their audience finds valuable, and can support genuine community formation.',
  },
  {
    feature: 'Algorithmic Feed Ranking',
    mechanism: 'Content is ordered by predicted engagement rather than chronology. This creates differential visibility: some posts are seen by many, others by few, based on platform-determined criteria.',
    effect: 'Users may gradually learn — consciously or not — which types of self-presentation receive visibility. Over time, this may shape what feels worth posting.',
    counter: 'Algorithmic ranking also surfaces content users are likely to find relevant, and reduces the noise of purely chronological feeds.',
  },
  {
    feature: 'Identity Legibility Incentives',
    mechanism: 'Profiles, bios, follower counts, topic labels, and verification systems encourage users to present a consistent, categorizable identity.',
    effect: 'The incentive to be "known for something" may, over time, narrow the range of topics and registers a user expresses publicly.',
    counter: 'Clear identity presentation helps users find communities of shared interest and build professional networks.',
  },
  {
    feature: 'Memory and Recirculation Features',
    mechanism: '"On This Day" and similar features resurface past content on anniversaries, selecting which memories to present based on undisclosed criteria.',
    effect: 'This creates a platform-mediated relationship with one\'s own past, potentially reinforcing certain self-narratives while allowing others to fade from recall.',
    counter: 'Memory features can prompt genuine reflection and help users appreciate their personal history.',
  },
  {
    feature: 'Public Metrics Visibility',
    mechanism: 'Follower counts, like counts, and view counts are publicly visible, creating persistent awareness of audience reception.',
    effect: 'Persistent metrics visibility may create an ambient awareness of "performance" that subtly shapes self-expression toward audience expectations.',
    counter: 'Metrics transparency enables accountability, helps users understand their reach, and supports informed communication choices.',
  },
];

const TRANSPARENCY_GAPS = [
  'How recommendation algorithms weigh different engagement signals in content distribution',
  'Whether content from certain topics or formats receives systematic amplification or suppression',
  'The selection criteria used by "memory" features to choose which past content to resurface',
  'The precise relationship between user engagement behavior and subsequent content distribution',
  'Whether platform A/B testing has examined features that affect self-expression patterns',
  'How content moderation decisions interact with algorithmic distribution at scale',
];

export default function GovernancePage() {
  return (
    <div>
      <PageHeader
        title="Platform Governance"
        subtitle="Structural context for the conditions under which self-presentation occurs."
      />

      <div className="reading-column px-6 pb-24">
        {/* Framing essay */}
        <div className="prose-body text-[15px] leading-[1.8] text-ink-700 mt-8">
          <p>
            This page provides structural context. It describes design choices —
            algorithmic, economic, and architectural — that shape the environment
            in which platform users create and share content. It does not accuse
            platforms of manipulation, nor does it exonerate them of influence.
            It describes conditions and leaves interpretation to the reader.
          </p>
          <p>
            The distinction matters. This tool examines patterns in a single
            person&apos;s posting history and asks whether those patterns are
            consistent with what platform incentive structures would predict.
            That consistency, even when observed, does not constitute proof. Many
            factors produce the same patterns. Governance context helps the
            reader consider which structural explanations are plausible — and
            which questions remain open.
          </p>
        </div>

        <SectionDivider />

        {/* Definition */}
        <div className="border-l border-charcoal-300 pl-6 mb-12">
          <h3 className="font-sans text-[11px] text-ink-400 uppercase tracking-widest mb-3">
            Key Term
          </h3>
          <p className="text-[15px] text-ink-700 leading-relaxed">
            <em>Platform governance</em>, as used here, refers to the design
            choices, algorithmic systems, economic models, and policy decisions
            that structure how users create, distribute, and receive content.
            It encompasses not only content moderation but also the incentive
            architectures, feedback mechanisms, and behavioral environments
            that platforms construct — often without explicit disclosure of
            their operation.
          </p>
        </div>

        {/* Design Patterns */}
        <h2 className="text-[22px] text-ink-900 mb-4">
          Design Patterns of Concern
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-8">
          Each pattern describes a platform feature, how it operates, what
          effects it may have on self-presentation, and what constructive
          purposes it also serves. The &ldquo;Also true&rdquo; section is not
          false balance — it is intellectual honesty about the dual nature of
          platform design.
        </p>

        <div className="space-y-8">
          {DESIGN_PATTERNS.map((pattern) => (
            <div key={pattern.feature} className="border-t border-linen-200 pt-6">
              <h3 className="text-[17px] text-ink-900 mb-4 italic">
                {pattern.feature}
              </h3>

              <div className="space-y-4 text-[14px] leading-relaxed">
                <div>
                  <span className="font-sans text-[10px] text-ink-400 uppercase tracking-widest">
                    Mechanism
                  </span>
                  <p className="text-ink-700 mt-1">{pattern.mechanism}</p>
                </div>
                <div>
                  <span className="font-sans text-[10px] text-ink-400 uppercase tracking-widest">
                    Possible Effect on Self-Presentation
                  </span>
                  <p className="text-ink-700 mt-1">{pattern.effect}</p>
                </div>
                <div>
                  <span className="font-sans text-[10px] text-ink-400 uppercase tracking-widest">
                    Also True
                  </span>
                  <p className="text-ink-500 mt-1 italic">{pattern.counter}</p>
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
        <h2 className="text-[22px] text-ink-900 mb-4">
          What Is Not Publicly Known
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
          The following aspects of platform operation are not publicly disclosed
          by most major platforms. These are factual absences in public
          knowledge, not conspiracy claims. Platforms may have legitimate
          business, security, or competitive reasons for non-disclosure — but
          the gaps constrain what researchers and users can know about the
          environments shaping their self-expression.
        </p>

        <ul className="space-y-3">
          {TRANSPARENCY_GAPS.map((gap) => (
            <li key={gap} className="text-[14px] text-ink-700 leading-relaxed pl-5 border-l border-slate-200">
              {gap}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-2">
          <EpistemicBadge status="observed" />
          <span className="font-sans text-[10px] text-ink-300">
            Based on publicly available platform documentation
          </span>
        </div>

        <SectionDivider />

        {/* Governance Framework Tiers */}
        <h2 className="text-[22px] text-ink-900 mb-4">
          What Current Governance Frameworks Address
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-8">
          Existing regulatory and self-governance frameworks address different
          layers of platform impact. The third tier — cumulative behavioral
          effects on self-expression — is the layer this tool attempts to make
          visible.
        </p>

        <div className="space-y-5">
          <div className="border-l-2 border-teal-200 pl-5 py-3">
            <h4 className="font-sans text-[11px] text-ink-500 uppercase tracking-widest mb-2">
              Well Addressed
            </h4>
            <p className="text-[14px] text-ink-700 leading-relaxed">
              Content moderation. Hate speech and misinformation. Data privacy
              protections (GDPR, CCPA). Transparency reporting requirements.
              Age-appropriate design codes.
            </p>
          </div>

          <div className="border-l-2 border-amber-200 pl-5 py-3">
            <h4 className="font-sans text-[11px] text-amber-700 uppercase tracking-widest mb-2">
              Partially Addressed
            </h4>
            <p className="text-[14px] text-ink-700 leading-relaxed">
              Algorithmic transparency (EU AI Act, DSA). Dark pattern
              regulation. Platform market concentration. Researcher access to
              platform data. These frameworks exist but implementation and
              enforcement remain uneven.
            </p>
          </div>

          <div className="border-l-2 border-amber-500 pl-5 py-3 bg-amber-100/30">
            <h4 className="font-sans text-[11px] text-amber-700 uppercase tracking-widest mb-2">
              Largely Unaddressed
            </h4>
            <p className="text-[14px] text-ink-700 leading-relaxed">
              Cumulative behavioral effects of platform design on
              self-expression. The gradual shaping of identity presentation
              through reinforcement dynamics. Structural conditions that may
              narrow civic discourse diversity. Long-term effects of
              algorithmic memory curation on personal narrative. This is the
              domain this tool attempts to make examinable.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <EpistemicBadge status="governance_commentary" />
        </div>
      </div>
    </div>
  );
}
