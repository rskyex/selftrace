import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-column px-6 pt-32 pb-24 text-center">
        <h1 className="text-[38px] md:text-[48px] font-bold tracking-tight text-ink-900 leading-[1.15]">
          Have you ever wondered how much of your online self is really you?
        </h1>

        <p className="mt-10 text-[18px] text-ink-500 leading-relaxed max-w-md mx-auto">
          Platforms reward certain patterns. Over time, those patterns can
          quietly shape what you post, how you sound, and which parts of
          yourself you share. SelfTrace helps you see them — so you can
          decide if they still feel like yours.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/start" className="btn-primary">
            See your patterns
          </Link>
          <Link href="/start?demo=true" className="btn-secondary">
            Try with a demo first
          </Link>
        </div>

        <p className="mt-8 font-sans text-[13px] text-ink-300">
          Everything runs in your browser. We never see your data.
        </p>
      </section>

      {/* ── Three observations ────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="reading-column px-6 space-y-10">
          <div>
            <p className="text-[18px] text-ink-500 leading-[1.8]">
              Most people can&apos;t accurately describe what they actually post
              about. When they see their data, the gap between self-image
              and reality is often the most interesting part.
            </p>
          </div>

          <div className="border-l-3 border-coral-600 pl-6">
            <p className="text-[18px] text-ink-500 leading-[1.8]">
              Some of what you post gets more attention than the rest. Over
              time, those attention patterns can quietly shape what you post
              more of — and what fades away.
            </p>
          </div>

          <div>
            <p className="text-[18px] text-ink-500 leading-[1.8]">
              The things you kept posting about despite low engagement might
              be the most authentically yours.
            </p>
          </div>
        </div>
      </section>

      {/* ── Not a diagnosis ──────────────────────────────── */}
      <section className="py-24">
        <div className="narrow-column px-6 text-center">
          <h2 className="text-[28px] font-bold text-ink-900 tracking-tight mb-6">
            This is not a diagnosis
          </h2>
          <p className="text-[17px] text-ink-500 leading-relaxed mb-4">
            SelfTrace doesn&apos;t claim the algorithm &ldquo;replaced the real
            you.&rdquo; It doesn&apos;t score you, rank you, or tell you what to fix.
          </p>
          <p className="text-[17px] text-ink-500 leading-relaxed mb-6">
            It shows you patterns. Some will feel right. Some might surprise you.
            What you do with them is entirely up to you.
          </p>
          <p className="text-[17px] text-ink-400 italic">
            Patterns you can see are patterns you can choose.
          </p>
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="narrow-column px-6 text-center">
          <p className="font-sans text-[13px] font-semibold text-sage-600 uppercase tracking-wider mb-3">
            About your privacy
          </p>
          <p className="text-[17px] text-ink-500 leading-relaxed">
            There is no server. No database. Your data is processed in your
            browser and exists only in memory. When you close the tab,
            it&apos;s gone.
          </p>
          <Link href="/how-it-works" className="font-sans inline-block mt-4 text-[14px] text-coral-600 hover:text-coral-700 font-medium">
            How it works &rarr;
          </Link>
        </div>
      </section>

      {/* ── Gentle CTA ───────────────────────────────────── */}
      <section className="py-24">
        <div className="narrow-column px-6 text-center">
          <p className="text-[20px] text-ink-700 leading-relaxed mb-8">
            It takes a couple of minutes. You might notice something you
            hadn&apos;t seen before.
          </p>
          <Link href="/start" className="btn-primary">
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
