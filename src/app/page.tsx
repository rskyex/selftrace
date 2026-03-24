import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-column px-6 pt-28 pb-20 text-center">
        <h1 className="text-[40px] md:text-[52px] font-semibold tracking-tight text-ink-900 leading-[1.15] max-w-lg mx-auto">
          Have you ever felt like your online self isn&apos;t quite&hellip; you?
        </h1>
        <p className="mt-8 text-[18px] text-ink-500 leading-relaxed max-w-md mx-auto">
          Platforms reward certain patterns. Over time, those patterns can
          quietly reshape what you post, how you sound, and which parts of
          yourself you share. SelfTrace helps you see those patterns clearly —
          so you can decide if they still feel like yours.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/start"
            className="font-sans inline-flex items-center justify-center px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-[15px] font-medium rounded-xl shadow-sm"
          >
            See your patterns
          </Link>
          <Link
            href="/start?demo=true"
            className="font-sans inline-flex items-center justify-center px-7 py-3.5 bg-white hover:bg-warm-100 text-ink-700 text-[15px] font-medium rounded-xl border border-warm-200"
          >
            Try with a demo first
          </Link>
        </div>

        <p className="mt-6 font-sans text-[13px] text-ink-300">
          Private by design. Everything runs in your browser. Nothing is stored.
        </p>
      </section>

      {/* ── What you'll see ──────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="reading-column px-6">
          <h2 className="text-[28px] font-semibold text-ink-900 tracking-tight text-center mb-12">
            What SelfTrace shows you
          </h2>

          <div className="space-y-8">
            <div className="observation">
              <h3>What you think you post about &mdash; vs. what your data shows</h3>
              <p>
                Before we analyze anything, we ask you to describe yourself.
                Then we compare your self-image with your actual posting patterns.
                The gaps are often the most revealing part.
              </p>
            </div>

            <div className="observation">
              <h3>How your voice has quietly shifted over time</h3>
              <p>
                Most change happens gradually enough that you don&apos;t notice it.
                We map how your topics, your tone, and your vocabulary
                have evolved across months and years of posting.
              </p>
            </div>

            <div className="observation">
              <h3>Which patterns got rewarded &mdash; and which ones you kept anyway</h3>
              <p>
                Some of what you post gets more attention than the rest. We
                show you whether those attention patterns correlate with what you
                posted more of over time. And, just as importantly, we show
                you what you kept posting despite low engagement. Those might be
                the most authentically yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it feels ─────────────────────────────────── */}
      <section className="py-20">
        <div className="reading-column px-6 text-center">
          <h2 className="text-[28px] font-semibold text-ink-900 tracking-tight mb-6">
            This is not a diagnosis
          </h2>
          <div className="text-[17px] text-ink-500 leading-relaxed max-w-md mx-auto space-y-4">
            <p>
              SelfTrace doesn&apos;t claim the algorithm &ldquo;replaced the
              real you.&rdquo; It doesn&apos;t score you, rank you, or tell you
              what to fix.
            </p>
            <p>
              It shows you patterns. Some will feel right. Some will surprise
              you. What you do with them is entirely up to you.
            </p>
            <p className="text-ink-400 italic">
              Patterns you can see are patterns you can choose.
            </p>
          </div>
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="narrow-column px-6 text-center">
          <p className="font-sans text-[14px] font-medium text-sage-600 mb-3">
            About your privacy
          </p>
          <p className="text-[17px] text-ink-500 leading-relaxed">
            There is no server. There is no database. Your data is processed
            entirely in your browser and exists only in memory. When you close
            the tab, it&apos;s gone. You can verify this in the source code.
          </p>
          <Link
            href="/privacy"
            className="font-sans inline-block mt-4 text-[14px] text-violet-600 hover:text-violet-700 font-medium"
          >
            Read more about privacy &rarr;
          </Link>
        </div>
      </section>

      {/* ── Gentle CTA ───────────────────────────────────── */}
      <section className="py-20">
        <div className="narrow-column px-6 text-center">
          <p className="text-[20px] text-ink-700 leading-relaxed mb-6">
            It takes a couple of minutes. You might notice something
            you hadn&apos;t seen before.
          </p>
          <Link
            href="/start"
            className="font-sans inline-flex items-center justify-center px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-[15px] font-medium rounded-xl shadow-sm"
          >
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
