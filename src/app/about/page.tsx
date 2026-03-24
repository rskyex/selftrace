import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="reading-column px-6 pt-20 pb-24">
      <h1 className="text-[32px] font-semibold tracking-tight text-ink-900 mb-4">
        How SelfTrace works
      </h1>

      <div className="prose-body text-[17px] text-ink-500 leading-[1.8] mb-12">
        <p>
          SelfTrace looks at your posting history and notices patterns —
          what you post about, how your tone has shifted, which topics
          seem to correlate with engagement, and where your self-image
          and your data might not quite line up.
        </p>
        <p>
          It doesn&apos;t access any platform&apos;s algorithm. It can&apos;t see what
          was shown to you or how your posts were ranked. It works entirely
          with what you posted.
        </p>
      </div>

      <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mb-4">
        What we analyze
      </h2>
      <div className="space-y-4 mb-12">
        {[
          { label: 'Topics', desc: 'What you post about, tracked over time using keyword matching. Transparent and auditable.' },
          { label: 'Topic variety', desc: 'How spread out your interests are each quarter. A declining measure means you\'re focusing on fewer subjects.' },
          { label: 'Vocabulary', desc: 'Which words became more or less frequent across your posting history.' },
          { label: 'Tone', desc: 'Approximate measures of assertiveness, emotionality, formality, and urgency. Rough directional signals, not precise measurements.' },
          { label: 'Engagement patterns', desc: 'Whether topics that got more attention correlate with what you posted more of afterward. Correlation only — we can\'t prove causation.' },
          { label: 'Recurring phrases', desc: 'Phrases that appear in multiple posts. Shows verbal patterns without interpreting why they recur.' },
          { label: 'Self-descriptions', desc: 'When you describe yourself in posts ("as a...", "in my experience..."), we track how that evolves.' },
        ].map(item => (
          <div key={item.label} className="observation">
            <h3>{item.label}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mb-4">
        How confident are we?
      </h2>
      <p className="text-[17px] text-ink-500 leading-relaxed mb-6">
        Not all findings are equally certain. You&apos;ll see small colored
        dots throughout the tool:
      </p>
      <div className="space-y-3 mb-12">
        <div className="flex items-start gap-3">
          <span className="confidence-dot confidence-high mt-2" />
          <p className="text-[15px] text-ink-500"><strong className="text-ink-700">Green</strong> — directly in your data. We&apos;re just counting.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="confidence-dot confidence-medium mt-2" />
          <p className="text-[15px] text-ink-500"><strong className="text-ink-700">Purple</strong> — a pattern we detected. Plausible but not certain.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="confidence-dot confidence-low mt-2" />
          <p className="text-[15px] text-ink-500"><strong className="text-ink-700">Gray</strong> — one possible reading. You might interpret it differently.</p>
        </div>
      </div>

      <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mb-4">
        What we can&apos;t tell you
      </h2>
      <div className="prose-body text-[17px] text-ink-500 leading-[1.8] mb-12">
        <p>
          We can&apos;t prove causation. If your topics shifted toward what gets
          engagement, we can show the pattern but not prove the engagement
          caused it.
        </p>
        <p>
          We can&apos;t see algorithms. We don&apos;t know what was shown to you
          or how your posts were ranked.
        </p>
        <p>
          Our tone measurements are approximate. They&apos;re based on English-
          language word patterns and measure writing style, not emotional state.
        </p>
      </div>

      <div className="observation bg-warm-100">
        <h3>Why this matters</h3>
        <p>
          Platforms shape the environment where you express yourself. Engagement
          feedback, algorithmic ranking, and identity incentives create
          conditions that may — over time, at scale — nudge self-expression
          in directions no one explicitly chose. SelfTrace makes those patterns
          visible so you can decide what to do about them.
        </p>
      </div>

      <div className="mt-12">
        <Link href="/start" className="font-sans text-[14px] text-violet-600 hover:text-violet-700 font-medium">
          Try it yourself &rarr;
        </Link>
      </div>
    </div>
  );
}
