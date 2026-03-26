import Link from 'next/link';

const ANALYSES = [
  { l: 'Recurring phrases and themes', d: 'What you return to \u2014 the formulations, ideas, and framings that appear in multiple posts across time.' },
  { l: 'Topic range', d: 'How spread out your subjects are each quarter. A narrowing range means fewer topics over time.' },
  { l: 'Vocabulary evolution', d: 'Which words became more or less frequent across your posting history, and the character of that change.' },
  { l: 'Tone', d: 'Approximate measures of assertiveness, emotionality, formality, and urgency. Directional signals based on word patterns, not precise measurements of emotional state.' },
  { l: 'Engagement patterns', d: 'Whether topics that received more response correlate with what you posted more of afterward. Correlation, not causation.' },
  { l: 'Self-descriptions', d: 'When you describe yourself in posts, we track how those descriptions evolve. Which self-framings persisted, which emerged, which faded.' },
  { l: 'Persistence', d: 'What you kept posting about despite low engagement. Evidence of expression that didn\u2019t depend on external reward.' },
];

export default function HowItWorksPage() {
  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <header className="mb-16">
        <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-5">
          Methodology
        </p>
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1]">
          How SelfTrace works
        </h1>
      </header>

      <div className="prose-body text-[17px] text-ink-700 leading-[1.85] mb-20">
        <p>
          SelfTrace looks at your posting history and notices patterns &mdash; what you
          wrote about, how your voice shifted, which topics correlate with engagement,
          and where your self-image and your visible trace might not line up.
        </p>
        <p className="text-ink-500">
          It doesn&apos;t access any platform&apos;s algorithm. It can&apos;t see what was shown to
          you or how your posts were ranked. It works entirely with what you wrote &mdash;
          the visible trace, not the invisible infrastructure.
        </p>
      </div>

      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-8">
        What we look at
      </h2>
      <div className="space-y-4 mb-20">
        {ANALYSES.map(m => (
          <div key={m.l} className="observation">
            <h3>{m.l}</h3>
            <p>{m.d}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-5">
        How certain are we
      </h2>
      <p className="text-[17px] text-ink-500 leading-[1.8] mb-7">
        You&apos;ll see small colored dots throughout:
      </p>
      <div className="space-y-5 mb-20">
        <div className="flex items-start gap-3">
          <span className="dot dot-counted mt-2" />
          <p className="text-[16px] text-ink-700"><strong className="font-sans font-medium">Green</strong> &mdash; directly from your data. We counted this.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="dot dot-patterned mt-2" />
          <p className="text-[16px] text-ink-700"><strong className="font-sans font-medium">Umber</strong> &mdash; a pattern we noticed. Plausible, not certain.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="dot dot-interpretive mt-2" />
          <p className="text-[16px] text-ink-700"><strong className="font-sans font-medium">Gray</strong> &mdash; one possible reading. You might see it differently.</p>
        </div>
      </div>

      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-5">
        What we can&apos;t see
      </h2>
      <div className="prose-body text-[17px] text-ink-500 leading-[1.85] mb-20">
        <p>
          We can&apos;t prove causation. If your topics shifted toward what gets engagement,
          we can show the pattern but not prove the engagement caused it.
        </p>
        <p>
          We can&apos;t see algorithms. We don&apos;t know what was shown to you, how your posts
          were ranked, or what was suppressed. The invisible infrastructure remains invisible.
        </p>
        <p>
          Some of what we surface will feel meaningful. Some of it may be noise. You are
          the only one who can tell the difference, because you are the only one who knows
          what it was like to be you during the time this data covers.
        </p>
      </div>

      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-5">
        Your privacy
      </h2>
      <div className="observation-sage mb-12">
        <h3>There is no server</h3>
        <p>
          Your data is processed entirely in your browser. It&apos;s held in memory while
          you&apos;re looking at it and released when you close the tab. There is no database.
          There is no account. There is nothing to delete because nothing was ever stored.
        </p>
        <p className="mt-4">
          We built it this way because what this product shows you is personal in a way
          most apps never are. It&apos;s not your preferences or your purchase history &mdash;
          it&apos;s a picture of how you&apos;ve been becoming yourself. That should belong to
          you and no one else.
        </p>
      </div>

      <Link href="/start" className="text-link text-[15px]">
        Begin &rarr;
      </Link>
    </div>
  );
}
