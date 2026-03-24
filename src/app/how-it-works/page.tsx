import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <h1 className="text-[32px] font-bold tracking-tight text-ink-900 mb-4">
        How SelfTrace works
      </h1>

      <div className="prose-body text-[17px] text-ink-500 leading-[1.8] mb-14">
        <p>
          SelfTrace looks at your posting history and notices patterns — what
          you post about, how your tone has shifted, which topics seem to
          correlate with engagement, and where your self-image and your data
          might not quite line up.
        </p>
        <p>
          It doesn&apos;t access any platform&apos;s algorithm. It can&apos;t see what was
          shown to you or how your posts were ranked. It works entirely with
          what you posted.
        </p>
      </div>

      <h2 className="text-[24px] font-bold text-ink-900 mb-6">What we look at</h2>
      <div className="space-y-4 mb-14">
        {[
          { l: 'Topics', d: 'What you post about, tracked over time using keyword matching. Transparent and auditable.' },
          { l: 'Topic variety', d: 'How spread out your interests are each quarter. A declining measure means you\'re focusing on fewer subjects.' },
          { l: 'Vocabulary', d: 'Which words became more or less frequent across your posting history.' },
          { l: 'Tone', d: 'Approximate measures of assertiveness, emotionality, formality, and urgency. Directional signals, not precise measurements.' },
          { l: 'Engagement patterns', d: 'Whether topics that got more attention correlate with what you posted more of afterward.' },
          { l: 'Recurring phrases', d: 'Phrases that appear in multiple posts — verbal patterns without interpreting why.' },
          { l: 'Self-descriptions', d: 'When you describe yourself in posts ("as a...", "in my experience..."), we track how that evolves.' },
        ].map(m => (
          <div key={m.l} className="observation">
            <h3>{m.l}</h3>
            <p>{m.d}</p>
          </div>
        ))}
      </div>

      <h2 className="text-[24px] font-bold text-ink-900 mb-4">How sure are we?</h2>
      <p className="text-[17px] text-ink-500 mb-6">You&apos;ll see small colored dots throughout:</p>
      <div className="space-y-4 mb-14">
        <div className="flex items-start gap-3"><span className="dot dot-high mt-1.5" /><p className="text-[15px] text-ink-500"><strong className="text-ink-700">Green</strong> — directly in your data. We&apos;re just counting.</p></div>
        <div className="flex items-start gap-3"><span className="dot dot-medium mt-1.5" /><p className="text-[15px] text-ink-500"><strong className="text-ink-700">Gold</strong> — a pattern we noticed. Plausible, not certain.</p></div>
        <div className="flex items-start gap-3"><span className="dot dot-low mt-1.5" /><p className="text-[15px] text-ink-500"><strong className="text-ink-700">Gray</strong> — one possible reading. You might see it differently.</p></div>
      </div>

      <h2 className="text-[24px] font-bold text-ink-900 mb-4">What we can&apos;t tell you</h2>
      <div className="prose-body text-[17px] text-ink-500 leading-[1.8] mb-14">
        <p>We can&apos;t prove causation. If your topics shifted toward what gets engagement, we can show the pattern but not prove the engagement caused it.</p>
        <p>We can&apos;t see algorithms. We don&apos;t know what was shown to you or how your posts were ranked.</p>
        <p>Our tone measurements are rough. They&apos;re based on word patterns and measure writing style, not emotional state.</p>
      </div>

      {/* Privacy */}
      <h2 className="text-[24px] font-bold text-ink-900 mb-4">Your privacy</h2>
      <div className="observation-sage mb-6">
        <h3>There is no server</h3>
        <p>
          Your data is processed entirely in your browser. It exists only in memory.
          When you close the tab, it&apos;s gone. There is no database, no account, no
          tracking. The source code is available for inspection.
        </p>
      </div>

      <Link href="/start" className="font-sans text-[14px] text-coral-600 hover:text-coral-700 font-semibold">
        Try it yourself &rarr;
      </Link>
    </div>
  );
}
