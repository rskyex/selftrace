import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { SectionDivider } from '@/components/shared/SectionDivider';

const METHODS = [
  { name: 'Topic analysis', desc: 'Posts are categorized by topic using keyword matching. This is transparent and auditable — not a black-box AI.' },
  { name: 'Topic diversity', desc: 'We measure how spread out your topics are each quarter. A declining score means you\'re focusing on fewer subjects.' },
  { name: 'Vocabulary tracking', desc: 'We compare which words you use more or less between the first and second half of your posting history.' },
  { name: 'Tone heuristics', desc: 'Approximate measures of assertiveness, emotionality, and formality based on word patterns. Directional signals, not precise measurements.' },
  { name: 'Engagement correlation', desc: 'We check whether topics that got higher engagement in one period appear more frequently in the next. Correlation only.' },
  { name: 'Phrase recurrence', desc: 'We find phrases of 3-5 words that appear in 3+ posts. This shows verbal patterns without interpreting why they recur.' },
  { name: 'Self-description detection', desc: 'We identify when you describe yourself ("as a...", "in my experience...") to track how your self-presentation evolves.' },
  { name: 'Memory detection', desc: 'We find phrasing that reappears in posts separated by 30+ days. These "echoes" may be habitual, deliberate, or coincidental.' },
];

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeader
        title="How SelfTrace works"
        subtitle="Our methods, our limits, and what we can't tell you."
      />

      <div className="wide-column px-6 pb-24">
        {/* Philosophy */}
        <div className="max-w-xl text-[16px] text-charcoal-600 leading-relaxed mt-4 mb-16">
          <p className="mb-4">
            SelfTrace analyzes patterns in your posting history. It doesn&apos;t
            access any platform&apos;s algorithms. It can&apos;t see what was shown to you
            or how your content was ranked. It works entirely with what you posted.
          </p>
          <p>
            Every finding is labeled by confidence level. We&apos;re upfront about
            what we can observe, what we&apos;re inferring, and where we&apos;re
            speculating. You&apos;re always the final interpreter of your own data.
          </p>
        </div>

        {/* Confidence levels */}
        <h2 className="text-[24px] font-semibold text-charcoal-900 mb-6">
          Confidence levels
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {([
            { status: 'observed' as const, label: 'Observed', desc: 'Directly in the data. "You posted 847 times."' },
            { status: 'inferred' as const, label: 'Inferred', desc: 'Derived from patterns. "Your topic diversity declined."' },
            { status: 'speculative' as const, label: 'Speculative', desc: 'A possible reading. "This may suggest engagement sensitivity."' },
            { status: 'governance_commentary' as const, label: 'Platform context', desc: 'About platform design. Not about your behavior.' },
          ]).map(({ status, label, desc }) => (
            <div key={status} className="card p-5">
              <div className="mb-2">
                <EpistemicBadge status={status} />
              </div>
              <p className="text-[14px] text-charcoal-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Methods */}
        <h2 className="text-[24px] font-semibold text-charcoal-900 mb-6">
          What we analyze
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {METHODS.map(method => (
            <div key={method.name} className="card p-5">
              <h3 className="text-[15px] font-semibold text-charcoal-900 mb-2">{method.name}</h3>
              <p className="text-[14px] text-charcoal-500 leading-relaxed">{method.desc}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Limitations */}
        <h2 className="text-[24px] font-semibold text-charcoal-900 mb-6">
          What we can&apos;t tell you
        </h2>
        <p className="text-[15px] text-charcoal-500 leading-relaxed mb-8 max-w-lg">
          These aren&apos;t footnotes. They&apos;re central to understanding
          what SelfTrace shows.
        </p>

        <div className="space-y-4 mb-16">
          {[
            { title: 'We can\'t tell correlation from causation', detail: 'If your topics shifted toward what gets engagement, we can show the pattern but not prove the engagement caused it.' },
            { title: 'We can\'t see algorithms', detail: 'We analyze your posts, not the systems that ranked or distributed them. We don\'t know what you were shown.' },
            { title: 'Our tone measurements are approximate', detail: 'Linguistic heuristics based on English-language word patterns. They measure writing style, not emotional state.' },
            { title: 'Topic classification has blind spots', detail: 'Keyword matching can\'t detect irony, nuance, or subjects outside our taxonomy.' },
            { title: 'We can\'t verify your data', detail: 'We trust that your export is complete and authentic. Partial datasets may show misleading patterns.' },
          ].map(lim => (
            <div key={lim.title} className="card p-5 bg-amber-100/20 border-amber-200/60">
              <h3 className="text-[15px] font-semibold text-charcoal-900 mb-1">{lim.title}</h3>
              <p className="text-[14px] text-charcoal-500 leading-relaxed">{lim.detail}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Platform context */}
        <h2 className="text-[24px] font-semibold text-charcoal-900 mb-6">
          How platforms shape the environment
        </h2>
        <p className="text-[15px] text-charcoal-500 leading-relaxed mb-8 max-w-lg">
          SelfTrace exists because platform design choices create conditions
          that may influence self-expression at scale. Here&apos;s what we mean.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Engagement feedback', desc: 'Likes, shares, and replies create a variable feedback loop. Some posts get a lot, others little, with no clear pattern.' },
            { title: 'Algorithmic ranking', desc: 'Content is shown based on predicted engagement, not chronology. This means some posts get seen, others don\'t.' },
            { title: 'Identity incentives', desc: 'Profiles, bios, and follower counts encourage consistent, categorizable self-presentation.' },
            { title: 'Memory features', desc: '"On This Day" and similar features choose which of your past posts to resurface — based on criteria you can\'t see.' },
          ].map(item => (
            <div key={item.title} className="card p-5">
              <h3 className="text-[15px] font-semibold text-charcoal-900 mb-2">{item.title}</h3>
              <p className="text-[14px] text-charcoal-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
